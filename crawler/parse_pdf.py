#!/usr/bin/env python3
import argparse
import json
import os
from pathlib import Path

try:
    from pypdf import PdfReader
    HAS_PYPDF = True
except ImportError:
    HAS_PYPDF = False


def extract_text_from_pdf(path: str):
    if not HAS_PYPDF:
        raise RuntimeError("請先安裝 pypdf：pip install pypdf")
    reader = PdfReader(path)
    pages = []
    for i, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""
        pages.append({"page": i, "text": text})
    return pages


def write_text(path: str, text: str):
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    print(f"已輸出文字檔：{path}")


def write_json(path: str, data):
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"已輸出 JSON：{path}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract text from downloaded PDF exam files")
    parser.add_argument("--input", required=True, help="輸入 PDF 檔案或資料夾")
    parser.add_argument("--output-dir", default="./crawler/output/pdf_text", help="輸出目錄")
    parser.add_argument("--format", choices=["txt", "json"], default="json", help="輸出格式")
    args = parser.parse_args()

    if not HAS_PYPDF:
        print("錯誤：未安裝 pypdf，請執行 pip install pypdf", flush=True)
        return

    input_path = Path(args.input)
    files = []
    if input_path.is_dir():
        files = list(input_path.glob("*.pdf"))
    elif input_path.is_file():
        files = [input_path]
    else:
        raise FileNotFoundError(f"找不到檔案或資料夾：{args.input}")

    for pdf_file in files:
        pages = extract_text_from_pdf(str(pdf_file))
        output_base = Path(args.output_dir) / pdf_file.stem
        if args.format == "txt":
            text = "\n\n".join(page["text"] for page in pages)
            write_text(str(output_base) + ".txt", text)
        else:
            write_json(str(output_base) + ".json" , pages)


if __name__ == "__main__":
    main()
