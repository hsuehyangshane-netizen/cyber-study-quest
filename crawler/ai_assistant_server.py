#!/usr/bin/env python3
import argparse
import json
import re
import socketserver
import sys
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from typing import Any, Dict, Optional

try:
    from llama_cpp import Llama
    HAS_LLAMA_CPP = True
except ImportError:
    HAS_LLAMA_CPP = False

MODEL = None
MODEL_PATH = None

PROMPT_TEMPLATE = '''
你是本地開源 AI 助教，負責針對一題高中素養選擇題進行輔導。
請用中文回答，條理清楚。
輸入資料：
題目：{question}
選項：
A. {A}
B. {B}
C. {C}
D. {D}
你選的答案：{choice}
正確答案：{answer}
解析：{explanation}
科目：{subject}
題型：{topic}
難度：{difficulty}

請輸出 JSON 物件，包含：
- guidance: 對學生的實用輔導建議
- why: 為什麼這個選項對/錯？如何判斷？
- tip: 下一次遇到類似題目時應該注意的重點
如果你沒辦法完整解析，請至少寫一段簡短的建議。
''' 


class AssistantHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers()

    def do_GET(self):
        if self.path == '/health':
            self._set_headers()
            self.wfile.write(json.dumps({'status': 'ok', 'model': bool(MODEL_PATH)}).encode('utf-8'))
            return
        self.send_response(404)
        self.end_headers()

    def do_POST(self):
        if self.path != '/assist':
            self.send_response(404)
            self.end_headers()
            return

        length = int(self.headers.get('Content-Length', '0'))
        body = self.rfile.read(length).decode('utf-8')
        try:
            payload = json.loads(body)
        except json.JSONDecodeError:
            self._set_headers(400)
            self.wfile.write(json.dumps({'success': False, 'error': '無效的 JSON。'}).encode('utf-8'))
            return

        response = self.handle_assist(payload)
        self._set_headers(200)
        self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))

    def handle_assist(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        question = payload.get('question', '')
        choices = payload.get('choices', [])
        selected = payload.get('choice', '')
        answer = payload.get('answer', '')
        explanation = payload.get('explanation', '')
        subject = payload.get('subject', '')
        topic = payload.get('topic', '')
        difficulty = payload.get('difficulty', '')

        if not question or not choices or not answer:
            return {'success': False, 'error': '缺少必要題目欄位。'}

        if HAS_LLAMA_CPP and MODEL is not None:
            return self.model_assist(question, choices, selected, answer, explanation, subject, topic, difficulty)
        return self.rule_assist(question, choices, selected, answer, explanation, subject, topic, difficulty)

    def model_assist(self, question, choices, selected, answer, explanation, subject, topic, difficulty):
        prompt = self.build_prompt(question, choices, selected, answer, explanation, subject, topic, difficulty)
        try:
            result = MODEL.create(
                prompt=prompt,
                max_tokens=512,
                temperature=0.25,
                top_p=0.95,
                echo=False,
                stop=['\n\n']
            )
            text = result.choices[0].text.strip()
            data = self.safe_json_load(text)
            if isinstance(data, dict) and 'guidance' in data:
                return {'success': True, 'source': 'model', 'text': json.dumps(data, ensure_ascii=False, indent=2), 'detail': data}
            return {'success': True, 'source': 'model', 'text': text, 'detail': {'guidance': text}}
        except Exception as exc:
            return {'success': False, 'error': f'模型回傳失敗：{exc}'}

    def rule_assist(self, question, choices, selected, answer, explanation, subject, topic, difficulty):
        is_correct = str(selected).strip() == str(answer).strip()
        guidance = self.build_rule_guidance(question, choices, selected, answer, explanation, is_correct, subject)
        return {'success': True, 'source': 'rule', 'text': guidance, 'detail': {'guidance': guidance}}

    def build_prompt(self, question, choices, selected, answer, explanation, subject, topic, difficulty):
        picks = {chr(65 + i): str(choice) for i, choice in enumerate(choices[:4])}
        return PROMPT_TEMPLATE.format(
            question=question,
            A=picks.get('A', ''),
            B=picks.get('B', ''),
            C=picks.get('C', ''),
            D=picks.get('D', ''),
            choice=selected,
            answer=answer,
            explanation=explanation or '無',
            subject=subject or '未知',
            topic=topic or '未知',
            difficulty=difficulty or '未知'
        )

    def build_rule_guidance(self, question, choices, selected, answer, explanation, is_correct, subject):
        advice = []
        if is_correct:
            advice.append(f'你答對了！正確答案是「{answer}」。')
            advice.append('這題的關鍵是先理解題幹，再比對選項細節。')
            if explanation:
                advice.append(f'解析提示：{explanation}')
            advice.append('下次遇到類似題目時，先找出題目要考的核心概念，再把選項逐一排除。')
        else:
            advice.append(f'你選了「{selected}」，但本題正確答案是「{answer}」。')
            if explanation:
                advice.append(f'正確解析：{explanation}')
            advice.append('錯題通常來自於忽略了題幹中的關鍵條件，或把選項細節讀反。')
            advice.append('先把題目條件寫成自己的句子，再對照各個選項是否完全吻合。')
        return '\n'.join(advice)

    def safe_json_load(self, text: str) -> Any:
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            match = re.search(r'\{.*\}', text, re.S)
            if match:
                try:
                    return json.loads(match.group(0))
                except json.JSONDecodeError:
                    pass
        return text


def start_server(host: str, port: int, model_path: Optional[str]):
    global MODEL, MODEL_PATH
    MODEL_PATH = model_path
    if HAS_LLAMA_CPP and model_path:
        MODEL = Llama(model_path=model_path)
        print(f'已載入本地模型：{model_path}')
    else:
        if not HAS_LLAMA_CPP:
            print('警告：未安裝 llama_cpp，本地模型將無法啟動，會使用簡單規則回傳。')
        if not model_path:
            print('警告：未提供模型路徑，會使用簡單規則回傳。')

    server = HTTPServer((host, port), AssistantHandler)
    print(f'AI 助教服務啟動於 http://{host}:{port}/health')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\n已停止服務。')
        server.server_close()


def main():
    parser = argparse.ArgumentParser(description='啟動本地 AI 助教服務')
    parser.add_argument('--host', default='127.0.0.1', help='服務綁定位址')
    parser.add_argument('--port', type=int, default=5000, help='服務埠號')
    parser.add_argument('--model-path', help='本地模型檔案路徑，例如 ggml-*.bin')
    args = parser.parse_args()
    start_server(args.host, args.port, args.model_path)

if __name__ == '__main__':
    main()
