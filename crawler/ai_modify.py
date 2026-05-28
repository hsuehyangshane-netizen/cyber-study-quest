#!/usr/bin/env python3
import argparse
import json
import os
import re
import sys
from typing import Any, Dict, List, Optional

try:
    from llama_cpp import Llama
    HAS_LLAMA_CPP = True
except ImportError:
    HAS_LLAMA_CPP = False


def load_json(path: str) -> Any:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def parse_js_array(path: str) -> Any:
    text = open(path, "r", encoding="utf-8").read()
    start = text.find("[")
    end = text.rfind("]")
    if start == -1 or end == -1:
        raise ValueError("無法從 JS 檔案中擷取陣列資料")
    candidate = text[start:end + 1]
    try:
        return json.loads(candidate)
    except json.JSONDecodeError as exc:
        raise ValueError(f"解析 JS 題庫失敗：{exc}") from exc


def load_questions(path: str) -> List[Dict[str, Any]]:
    if path.endswith(".json"):
        data = load_json(path)
    elif path.endswith(".js"):
        data = parse_js_array(path)
    else:
        raise ValueError("只支援 .json 或 .js 題庫檔案")
    if not isinstance(data, list):
        raise ValueError("題庫檔案結構必須是一個題目陣列")
    return data


def save_json(path: str, data: Any) -> None:
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"已輸出 {path}")


def infer_subject_from_path(path: str) -> Optional[str]:
    lower = path.lower()
    for subject in ["chinese", "english", "math", "science", "social"]:
        if subject in lower:
            return subject
    return None


def run_convert_to_js(json_path: Path, js_path: Path) -> None:
    script_path = Path(__file__).resolve().parent / 'convert_to_js.py'
    if not script_path.exists():
        raise FileNotFoundError(f'找不到 convert_to_js.py：{script_path}')
    subprocess.run([sys.executable, str(script_path), '--input', str(json_path), '--output', str(js_path)], check=True)
    print(f'已輸出 JS：{js_path}')


def auto_import_to_data(subject: str, source_json: Path, data_dir: Path) -> None:
    data_dir.mkdir(parents=True, exist_ok=True)
    subject_lower = subject.lower()
    json_path = data_dir / f'question_bank_{subject_lower}.json'
    js_path = data_dir / f'question_bank_{subject_lower}.js'
    shutil.copy2(str(source_json), str(json_path))
    print(f'已匯入 JSON 到 {json_path}')
    run_convert_to_js(json_path, js_path)


def build_rewrite_prompt(question: Dict[str, Any]) -> str:
    payload = {
        "Question": question.get("Question", ""),
        "Options": question.get("Options", {}),
        "Correct_Answer": question.get("Correct_Answer", ""),
        "Solution_Steps": question.get("Solution_Steps", []),
        "Hint": question.get("Hint", ""),
        "Subject_Area": question.get("Subject_Area", ""),
        "Topic_Name": question.get("Topic_Name", ""),
        "Difficulty": question.get("Difficulty", ""),
    }
    prompt = (
        "你是一個試題改寫助手，請根據以下題目內容生成一個同樣題型、相同難度、但語句不同的新題目。"
        " 請保留正確答案位置不變，並輸出一個 JSON 物件，包含以下欄位："
        " Question、Options、Correct_Answer、Solution_Steps、Hint、AI_Draw_Prompt。"
        " 如果原題無法生成 AI 圖片提示，則設定 AI_Draw_Prompt 為 null。\n\n"
        "原始題目資料：\n"
        f"{json.dumps(payload, ensure_ascii=False, indent=2)}\n\n"
        "請僅輸出純 JSON，不要多餘文字。"
    )
    return prompt


def generate_with_llama(model_path: str, prompt: str, max_tokens: int = 512) -> str:
    if not HAS_LLAMA_CPP:
        raise RuntimeError("未安裝 llama_cpp，無法使用本地模型。請執行 pip install llama-cpp-python")
    model = Llama(model_path=model_path)
    response = model.create(
        prompt=prompt,
        max_tokens=max_tokens,
        temperature=0.7,
        top_p=0.9,
        echo=False,
        stop=["\n\n"],
    )
    return response.choices[0].text


def safe_json_load(text: str) -> Any:
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # 嘗試提取第一個 JSON 物件
        match = re.search(r"\{.*\}", text, re.S)
        if match:
            return json.loads(match.group(0))
        raise


def template_rewrite(question: Dict[str, Any]) -> Dict[str, Any]:
    rewritten = {
        "Question": question.get("Question", "") + "（請改寫）",
        "Options": question.get("Options", {}),
        "Correct_Answer": question.get("Correct_Answer", ""),
        "Solution_Steps": question.get("Solution_Steps", []),
        "Hint": question.get("Hint", ""),
        "AI_Draw_Prompt": question.get("AI_Draw_Prompt", None),
    }
    return rewritten


def rewrite_question(question: Dict[str, Any], mode: str, model_path: Optional[str] = None) -> Dict[str, Any]:
    if mode == "model":
        if model_path is None:
            raise ValueError("使用 model 模式時必須指定 --model-path")
        prompt = build_rewrite_prompt(question)
        text = generate_with_llama(model_path, prompt)
        data = safe_json_load(text)
        if not isinstance(data, dict):
            raise ValueError("模型回傳內容不是 JSON 物件")
        return {
            "Question": data.get("Question", question.get("Question", "")),
            "Options": data.get("Options", question.get("Options", {})),
            "Correct_Answer": data.get("Correct_Answer", question.get("Correct_Answer", "")),
            "Solution_Steps": data.get("Solution_Steps", question.get("Solution_Steps", [])),
            "Hint": data.get("Hint", question.get("Hint", "")),
            "AI_Draw_Prompt": data.get("AI_Draw_Prompt", question.get("AI_Draw_Prompt", None)),
        }
    return template_rewrite(question)


def run_rewrite(args: argparse.Namespace) -> None:
    questions = load_questions(args.input)
    rewritten = []
    for idx, q in enumerate(questions, start=1):
        print(f"[{idx}/{len(questions)}] 改寫題目：{q.get('id', '') or q.get('Question', '')[:30]}")
        try:
            output = rewrite_question(q, args.mode, args.model_path)
            rewritten.append({**q, **output})
        except Exception as exc:
            print(f"  跳過：{exc}")
            rewritten.append(q)
    save_json(args.output, rewritten)


def main() -> None:
    parser = argparse.ArgumentParser(description="AI 題庫改寫工具")
    parser.add_argument("--input", required=True, help="輸入題庫檔案 (.json 或 .js)")
    parser.add_argument("--output", required=True, help="輸出改寫後題庫 JSON 檔案")
    parser.add_argument("--mode", choices=["model", "template"], default="template", help="改寫模式")
    parser.add_argument("--model-path", help="本地模型檔案路徑，mode=model 時必填")
    parser.add_argument("--subject", choices=["chinese", "english", "math", "science", "social"], help="題庫科目，用於 auto-import")
    parser.add_argument("--auto-import", action="store_true", help="同時將改寫後題庫匯入 data/question_bank_<subject>.json 及 .js")
    parser.add_argument("--data-dir", default="./data", help="匯入目錄，預設為 ./data")
    args = parser.parse_args()

    if args.mode == "model" and not HAS_LLAMA_CPP:
        print("錯誤：未安裝 llama_cpp，請安裝 pip install llama-cpp-python", file=sys.stderr)
        sys.exit(1)

    run_rewrite(args)

    if args.auto_import:
        subject = args.subject or infer_subject_from_path(args.output) or infer_subject_from_path(args.input)
        if not subject:
            print("錯誤：無法從檔名推斷科目，請使用 --subject 指定。", file=sys.stderr)
            sys.exit(1)
        auto_import_to_data(subject, Path(args.output), Path(args.data_dir))


if __name__ == "__main__":
    main()
