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


def parse_js_array(path: str) -> Any:
    text = open(path, "r", encoding="utf-8").read()
    start = text.find("[")
    end = text.rfind("]")
    if start == -1 or end == -1:
        raise ValueError("無法從 JS 檔案中擷取陣列資料")
    return json.loads(text[start:end + 1])


def load_questions(path: str) -> List[Dict[str, Any]]:
    if path.endswith(".json"):
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    elif path.endswith(".js"):
        data = parse_js_array(path)
    else:
        raise ValueError("只支援 .json 或 .js 檔案")
    if not isinstance(data, list):
        raise ValueError("題庫檔案必須是一個題目列表")
    return data


def search_questions(query: str, questions: List[Dict[str, Any]], top_n: int = 5) -> List[Dict[str, Any]]:
    query_lower = query.lower()
    scored = []
    for q in questions:
        text = " ".join(str(q.get(k, "")).lower() for k in ["id", "Question", "Topic_Name", "Subject_Area", "Question_Type"])
        score = sum(text.count(token) for token in query_lower.split())
        if score > 0:
            scored.append((score, q))
    scored.sort(key=lambda item: item[0], reverse=True)
    return [q for _, q in scored[:top_n]]


def build_prompt(query: str, questions: List[Dict[str, Any]]) -> str:
    context = []
    for q in questions:
        context.append(
            f"題目：{q.get('Question', '')}\n"
            f"選項：{q.get('Options', {})}\n"
            f"答案：{q.get('Correct_Answer', q.get('answer', ''))}\n"
            f"解析：{q.get('Solution_Steps', q.get('explanation', ''))}\n"
        )
    sample_text = "\n\n---\n\n".join(context)
    return (
        "你是一個國中會考題目助教。根據下列相關題目與解析，回答學生的問題。"
        "不要直接複製題目內容，而是用簡潔清楚的方式說明概念。\n\n"
        f"學生問題：{query}\n\n"
        f"相關題目：\n{sample_text}\n\n"
        "請以中文回答，並盡量用步驟說明解題思路。"
    )


def generate_answer(model_path: str, prompt: str, max_tokens: int = 512) -> str:
    if not HAS_LLAMA_CPP:
        raise RuntimeError("未安裝 llama_cpp，無法使用本地模型。請安裝 pip install llama-cpp-python")
    model = Llama(model_path=model_path)
    response = model.create(
        prompt=prompt,
        max_tokens=max_tokens,
        temperature=0.7,
        top_p=0.85,
        echo=False,
    )
    return response.choices[0].text.strip()


def print_question_summary(question: Dict[str, Any]):
    print("---")
    print(f"ID: {question.get('id', question.get('Category_ID', ''))}")
    print(f"科目：{question.get('Subject_Area', '')}")
    print(f"題型：{question.get('Question_Type', question.get('topic', ''))}")
    print(f"題目：{question.get('Question', question.get('question', ''))}")
    options = question.get('Options', question.get('options', {}))
    for key, value in (options.items() if isinstance(options, dict) else enumerate(options, start=1)):
        print(f"  {key}: {value}")
    print(f"答案：{question.get('Correct_Answer', question.get('answer', ''))}")


def main() -> None:
    parser = argparse.ArgumentParser(description="AI 助教：從題庫回答問題或解題說明")
    parser.add_argument("--question-bank", required=True, help="題庫檔案 (.json 或 .js)")
    parser.add_argument("--model-path", help="本地模型路徑，若提供則會使用 LLama 做生成")
    parser.add_argument("--query", help="直接查詢問題，不使用互動模式")
    args = parser.parse_args()

    questions = load_questions(args.question_bank)
    if args.query:
        query = args.query
    else:
        print("AI 助教已啟動，輸入你的問題，按 Enter 送出。輸入 q 或 quit 結束。")
        while True:
            query = input("問題：").strip()
            if not query:
                continue
            if query.lower() in {"q", "quit", "exit"}:
                break
            candidates = search_questions(query, questions)
            if candidates:
                print(f"找到 {len(candidates)} 個相關題目: ")
                for q in candidates:
                    print_question_summary(q)
            else:
                print("找不到相關題目，請換個關鍵字。")
            if args.model_path:
                prompt = build_prompt(query, candidates[:3])
                answer = generate_answer(args.model_path, prompt)
                print("\nAI 回答：\n", answer)
            continue
        return

    candidates = search_questions(query, questions)
    print(f"找到 {len(candidates)} 個相關題目")
    for q in candidates:
        print_question_summary(q)
    if args.model_path:
        prompt = build_prompt(query, candidates[:3])
        answer = generate_answer(args.model_path, prompt)
        print("\nAI 回答：\n", answer)


if __name__ == "__main__":
    main()
