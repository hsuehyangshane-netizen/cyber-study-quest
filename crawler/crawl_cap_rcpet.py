#!/usr/bin/env python3
import argparse
import json
import os
import re
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

BASE_URL = "https://cap.rcpet.edu.tw/"
OUTPUT_DIR = "./crawler/output"


def fetch_url(url, timeout=20):
    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; CAPCrawler/1.0; +https://github.com/hsuehyangshane-netizen/cyber-study-quest)"
    }
    response = requests.get(url, headers=headers, timeout=timeout)
    response.encoding = response.apparent_encoding
    response.raise_for_status()
    return response.text


def ensure_output_dir():
    os.makedirs(OUTPUT_DIR, exist_ok=True)


def normalize_link(href, base=BASE_URL):
    if not href:
        return None
    return urljoin(base, href)


def make_soup(html):
    try:
        return BeautifulSoup(html, "lxml")
    except Exception:
        return BeautifulSoup(html, "html.parser")


def extract_links(html, base=BASE_URL):
    soup = make_soup(html)
    links = set()
    for a in soup.find_all("a", href=True):
        url = normalize_link(a["href"], base)
        if url and urlparse(url).netloc == urlparse(base).netloc:
            links.add(url)
    return sorted(links)


def discover_urls(entry_url):
    print(f"[discover] fetching {entry_url}")
    html = fetch_url(entry_url)
    links = extract_links(html, entry_url)
    print(f"[discover] found {len(links)} internal links")
    for link in links:
        print(link)
    return links


def parse_question_page(html, url):
    soup = make_soup(html)
    title = soup.title.string.strip() if soup.title else ""
    body_text = soup.get_text(separator="\n", strip=True)
    return {
        "source_url": url,
        "page_title": title,
        "raw_text_snippet": body_text[:1000],
    }


def parse_exam_year_options(html, base=BASE_URL):
    soup = make_soup(html)
    select = soup.find("select", id="exam")
    if select is None:
        return []
    years = []
    for option in select.find_all("option"):
        value = option.get("value")
        url = normalize_link(value, base)
        years.append({
            "year_label": option.text.strip(),
            "title": option.get("title"),
            "url": url,
            "selected": option.has_attr("selected"),
        })
    return years


def extract_exam_resources(html, base=BASE_URL):
    soup = make_soup(html)
    resources = []
    for a in soup.find_all("a", href=True):
        href = a["href"].strip()
        if not href:
            continue
        url = normalize_link(href, base)
        text = a.get_text(separator=" ", strip=True)
        if not text:
            continue
        resource_type = "pdf" if ".pdf" in url.lower() or "drive.google.com" in url.lower() else "link"
        resources.append({
            "text": text,
            "url": url,
            "type": resource_type,
            "title": a.get("title"),
        })
    return resources


def extract_drive_file_id(url):
    match = re.search(r"/d/([A-Za-z0-9_-]+)", url)
    if match:
        return match.group(1)
    match = re.search(r"id=([A-Za-z0-9_-]+)", url)
    return match.group(1) if match else None


def download_file(url, output_path, timeout=30):
    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; CAPCrawler/1.0; +https://github.com/hsuehyangshane-netizen/cyber-study-quest)"
    }
    if "drive.google.com" in url:
        drive_id = extract_drive_file_id(url)
        if drive_id:
            url = f"https://drive.google.com/uc?export=download&id={drive_id}"
    response = requests.get(url, headers=headers, timeout=timeout, stream=True)
    response.raise_for_status()
    os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)
    with open(output_path, "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            if chunk:
                f.write(chunk)
    print(f"[download] saved {output_path}")


def write_json(filename, data):
    ensure_output_dir()
    path = os.path.join(OUTPUT_DIR, filename)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"[output] wrote {path}")


def run_discover(args):
    links = discover_urls(args.url)
    write_json("discovered_links.json", {"entry_url": args.url, "links": links})


def run_discover_exams(args):
    print(f"[discover-exams] fetching {args.url}")
    html = fetch_url(args.url)
    years = parse_exam_year_options(html, args.url)
    write_json("exam_years.json", {"entry_url": args.url, "years": years})


def run_extract_resources(args):
    print(f"[extract-resources] fetching {args.url}")
    html = fetch_url(args.url)
    resources = extract_exam_resources(html, args.url)
    write_json("exam_resources.json", {"source_url": args.url, "resources": resources})


def run_batch_resources(args):
    print(f"[batch-resources] fetching {args.url}")
    html = fetch_url(args.url)
    years = parse_exam_year_options(html, args.url)
    all_resources = []
    for year in years:
        if not year["url"]:
            continue
        print(f"[batch-resources] scanning {year['year_label']} -> {year['url']}")
        try:
            html = fetch_url(year["url"])
            resources = extract_exam_resources(html, year["url"])
            all_resources.append({"year": year, "resources": resources})
        except Exception as exc:
            print(f"[batch-resources] failed {year['url']}: {exc}")
    write_json("exam_year_resources.json", {"source_url": args.url, "years": all_resources})


def run_download_pdfs(args):
    links = []
    if args.links_file:
        content = json.load(open(args.links_file, "r", encoding="utf-8"))
        links = []
        if isinstance(content, dict) and "resources" in content:
            links = [res for res in content["resources"] if res.get("type") == "pdf"]
        elif isinstance(content, dict) and "years" in content:
            for year in content["years"]:
                for res in year.get("resources", []):
                    if res.get("type") == "pdf":
                        links.append(res)
        elif isinstance(content, list):
            links = content
    elif args.url:
        html = fetch_url(args.url)
        links = extract_exam_resources(html, args.url)
    else:
        raise ValueError("需要提供 --links-file 或 --url")

    output_dir = os.path.join(OUTPUT_DIR, args.output_dir or "pdfs")
    os.makedirs(output_dir, exist_ok=True)
    for item in links:
        url = item.get("url")
        if not url:
            continue
        filename = item.get("text") or os.path.basename(urlparse(url).path)
        safe_name = re.sub(r"[^A-Za-z0-9\-_\. ]", "_", filename)[:120]
        if not safe_name.lower().endswith(".pdf"):
            safe_name += ".pdf"
        path = os.path.join(output_dir, safe_name)
        try:
            download_file(url, path)
        except Exception as exc:
            print(f"[download-pdfs] failed {url}: {exc}")


def main():
    parser = argparse.ArgumentParser(description="CAP exam crawler for cyber-study-quest")
    parser.add_argument("command", choices=["discover", "download", "batch", "discover-exams", "extract-resources", "batch-resources", "download-pdfs"], help="operation mode")
    parser.add_argument("--url", default=BASE_URL + "examination.html", help="start URL")
    parser.add_argument("--links-file", help="使用現有資源 JSON 列表下載 PDF")
    parser.add_argument("--output-dir", help="PDF 下載目錄，相對於 crawler/output")
    args = parser.parse_args()

    if args.command == "discover":
        run_discover(args)
    elif args.command == "download":
        run_download(args)
    elif args.command == "batch":
        run_batch(args)
    elif args.command == "discover-exams":
        run_discover_exams(args)
    elif args.command == "extract-resources":
        run_extract_resources(args)
    elif args.command == "batch-resources":
        run_batch_resources(args)
    elif args.command == "download-pdfs":
        run_download_pdfs(args)


if __name__ == "__main__":
    main()
