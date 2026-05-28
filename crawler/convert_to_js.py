#!/usr/bin/env python3
import argparse
import json
import os
import re
from typing import Any


def parse_js_array(path: str) -> Any:
    text = open(path, "r", encoding="utf-8").read()
    start = text.find("[")
    end = text.rfind("]")
    if start == -1 or end == -1:
        raise ValueError("無法從 JS 檔案中擷取陣列資料")
    candidate = text[start:end + 1]
    return json.loads(candidate)


def load_json_or_js(path: str) -> Any:
    if path.endswith(".json"):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    if path.endswith(".js"):
        return parse_js_array(path)
    raise ValueError("只支援 .json 或 .js 檔案")


def infer_variable_name(output_path: str, explicit_name: str | None = None) -> str:
    if explicit_name:
        return explicit_name
    basename = os.path.basename(output_path)
    name = os.path.splitext(basename)[0]
    if name.startswith("question_bank_"):
        suffix = name[len("question_bank_"):].upper()
    else:
        suffix = re.sub(r"[^A-Za-z0-9]+", "_", name).upper()
    return f"window.MY_{suffix}_BANK"


def write_js(output_path: str, variable_name: str, data: Any) -> None:
    os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(f"{variable_name} = ")
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(f"已輸出 {output_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Convert question bank JSON to browser JS assignment file")
    parser.add_argument("--input", required=True, help="輸入題庫檔案 (.json 或 .js)")
    parser.add_argument("--output", required=True, help="輸出 JS 檔案路徑")
    parser.add_argument("--var-name", help="自訂輸出變數名稱，例如 window.MY_MATH_BANK")
    args = parser.parse_args()

    data = load_json_or_js(args.input)
    if not isinstance(data, list):
        raise ValueError("題庫必須是一個題目列表")
    variable_name = infer_variable_name(args.output, args.var_name)
    write_js(args.output, variable_name, data)


if __name__ == "__main__":
    main()
