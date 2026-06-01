#!/usr/bin/env python3
import argparse
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

QUESTION_NUMBER_RE = re.compile(r'(?m)^\s*(\d{1,3})[\.、\)]\s*')
OPTION_RE = re.compile(r'(?m)^\s*([A-D])[\.．、\)]\s*(.+?)(?=(?:\n\s*[A-D][\.．、\)]\s*)|\n\d{1,3}[\.、\)]|$)', re.S)
ANSWER_RE = re.compile(r'(?im)^(?:答案|正確答案|Answer|Correct Answer|Ans)[:：\s]*([A-D])\b')
EXPLANATION_SPLIT_RE = re.compile(r'(?im)^(?:解析|解說|說明|解答|Explanation|Analysis)[:：\s]*', re.M)

SUBJECT_PREFIX = {
    'chinese': 'CH',
    'english': 'EN',
    'math': 'MATH',
    'science': 'SCI',
    'social': 'SOC',
}

SUBJECT_DEFAULT_FIELDS = {
    'chinese': {
        'topic_key': 'topic',
        'title_key': 'question',
        'hint_default': '先判斷題幹要求，再排除過度推論或只看關鍵字的選項。',
    },
    'english': {
        'topic_key': 'type',
        'title_key': 'question',
        'hint_default': 'Read the passage carefully, then choose the best answer.',
    },
    'math': {
        'topic_key': 'Topic_Name',
        'title_key': 'Question',
        'hint_default': '先判斷題目屬於哪一種數量關係，再依序列式計算。',
    },
    'science': {
        'topic_key': 'Topic_Name',
        'title_key': 'Question',
        'hint_default': '先判斷題目屬於實驗、觀察、圖表或生活情境，再找出最直接支持的答案。',
    },
    'social': {
        'topic_key': 'Topic_Name',
        'title_key': 'Question',
        'hint_default': '先判斷題目屬於地理、歷史或公民，再找出情境中的關鍵證據。',
    },
}


def load_text_source(path: Path) -> List[Tuple[Path, str]]:
    if path.is_dir():
        files = sorted(path.glob('*.json')) + sorted(path.glob('*.txt'))
        if not files:
            raise FileNotFoundError(f'目錄中沒有 .json 或 .txt 檔案：{path}')
        sources = []
        for file_path in files:
            sources.extend(load_text_source(file_path))
        return sources

    if path.suffix.lower() == '.json':
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        if isinstance(data, list):
            text = '\n\n'.join(str(page.get('text', '')) for page in data)
        elif isinstance(data, dict) and 'pages' in data:
            text = '\n\n'.join(str(page.get('text', '')) for page in data['pages'])
        else:
            raise ValueError(f'不支援的 JSON 格式：{path}')
        return [(path, text)]

    if path.suffix.lower() == '.txt':
        with open(path, 'r', encoding='utf-8') as f:
            return [(path, f.read())]

    raise ValueError(f'不支援的輸入檔案類型：{path}')


def normalize_text(text: str) -> str:
    text = text.replace('\r\n', '\n').replace('\r', '\n')
    lines = [line.rstrip() for line in text.splitlines()]
    return '\n'.join(lines).strip()


def split_question_blocks(text: str) -> List[Tuple[str, str]]:
    matches = list(QUESTION_NUMBER_RE.finditer(text))
    if not matches:
        return [('', text.strip())]

    blocks: List[Tuple[str, str]] = []
    for idx, match in enumerate(matches):
        start = match.start()
        end = matches[idx + 1].start() if idx + 1 < len(matches) else len(text)
        raw_block = text[start:end].strip()
        blocks.append((match.group(1), raw_block))
    return blocks


def parse_options(block_text: str) -> Dict[str, str]:
    options: Dict[str, str] = {}
    for letter, content in OPTION_RE.findall(block_text):
        cleaned = ' '.join(line.strip() for line in content.strip().splitlines() if line.strip())
        options[letter] = cleaned
    return options


def extract_answer(block_text: str) -> Optional[str]:
    match = ANSWER_RE.search(block_text)
    if match:
        return match.group(1).upper()
    return None


def split_explanation(block_text: str) -> Tuple[str, str]:
    parts = EXPLANATION_SPLIT_RE.split(block_text, maxsplit=1)
    if len(parts) == 2:
        return parts[0].strip(), parts[1].strip()
    return block_text.strip(), ''


def parse_question_block(subject: str, question_number: str, block_text: str, default_topic: str) -> Optional[Dict[str, Any]]:
    block_text = block_text.strip()
    if not block_text:
        return None

    block_text, explanation = split_explanation(block_text)
    answer = extract_answer(block_text)
    options = parse_options(block_text)

    if not options:
        return None

    if answer not in options:
        answer = answer or list(options.keys())[0]

    question_text = QUESTION_NUMBER_RE.sub('', block_text, count=1).strip()
    question_lines = []
    for line in question_text.splitlines():
        if re.match(r'^[ \t]*[A-D][\.．、\)]\s*', line):
            break
        question_lines.append(line)
    question_text = ' '.join(line.strip() for line in question_lines if line.strip())

    data: Dict[str, Any] = {}
    subject_lower = subject.lower()
    prefix = SUBJECT_PREFIX.get(subject_lower, 'Q')
    id_value = f'{prefix}-{question_number.zfill(3)}' if question_number else f'{prefix}-{os.urandom(2).hex()}'

    if subject_lower == 'math':
        data = {
            'Category_ID': id_value,
            'Topic_Name': default_topic or '數學題組',
            'Question': question_text,
            'Options': options,
            'Correct_Answer': answer,
            'Solution_Steps': [explanation] if explanation else [],
            'Image_Requirement': {
                'Need_Image': False,
                'Past_Exam_Reference': None,
                'AI_Draw_Prompt': None,
            },
        }
    elif subject_lower in ('science', 'social'):
        data = {
            'id': id_value,
            'Subject_Area': default_topic or subject_lower.title(),
            'Topic_Name': default_topic or f'{subject_lower.title()} 題組',
            'Question_Type': default_topic or '素養題',
            'Difficulty': '',
            'stage': '',
            'groupId': None,
            'Passage': '',
            'Question': question_text,
            'Options': options,
            'Correct_Answer': answer,
            'Solution_Steps': [explanation] if explanation else [],
            'Hint': SUBJECT_DEFAULT_FIELDS[subject_lower]['hint_default'],
            'Image_Requirement': {
                'Need_Image': False,
                'Past_Exam_Reference': None,
                'AI_Draw_Prompt': None,
            },
        }
    elif subject_lower == 'english':
        data = {
            'id': id_value,
            'type': default_topic or '英文素養',
            'stage': '',
            'difficulty': '',
            'passage': '',
            'question': question_text,
            'options': options,
            'answer': answer,
            'explanation': explanation,
            'hint': SUBJECT_DEFAULT_FIELDS[subject_lower]['hint_default'],
        }
    else:
        data = {
            'id': id_value,
            'stage': '',
            'type': default_topic or '國文素養',
            'difficulty': '',
            'context': '',
            'question': question_text,
            'options': options,
            'answer': answer,
            'rationale': explanation,
            'hint': SUBJECT_DEFAULT_FIELDS[subject_lower]['hint_default'],
        }

    return data


def parse_text_source(subject: str, default_topic: str, path: Path, text: str) -> List[Dict[str, Any]]:
    text = normalize_text(text)
    blocks = split_question_blocks(text)
    questions: List[Dict[str, Any]] = []
    for question_number, block_text in blocks:
        item = parse_question_block(subject, question_number, block_text, default_topic)
        if item:
            questions.append(item)
    return questions


def save_json_file(path: Path, data: Any) -> None:
    os.makedirs(path.parent, exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f'已輸出 JSON：{path}')


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


def infer_subject_from_output(output_path: Path) -> Optional[str]:
    match = re.search(r'question_bank_([a-zA-Z]+)\.json$', output_path.name)
    if match:
        return match.group(1).lower()
    return None


def main() -> None:
    parser = argparse.ArgumentParser(description='從 PDF 文字擷取結果生成結構化題庫，並可匯入 data/ 目錄')
    parser.add_argument('--input', required=True, help='PDF 文字輸入檔案或資料夾 (.json 或 .txt)')
    parser.add_argument('--subject', required=True, choices=list(SUBJECT_PREFIX), help='題庫科目，例如 chinese、english、math、science、social')
    parser.add_argument('--output', default='./crawler/output/parsed_questions.json', help='結構化題庫 JSON 輸出路徑')
    parser.add_argument('--topic', default='', help='題型或題組名稱，用於題庫 metadata')
    parser.add_argument('--auto-import', action='store_true', help='同時將結果寫入 data/question_bank_<subject>.json 及 .js')
    parser.add_argument('--data-dir', default='./data', help='匯入目錄，預設為 ./data')
    args = parser.parse_args()

    input_path = Path(args.input)
    sources = load_text_source(input_path)
    questions: List[Dict[str, Any]] = []
    for source_path, text in sources:
        questions.extend(parse_text_source(args.subject, args.topic, source_path, text))

    if not questions:
        print('警告：未解析到任何題目。請檢查輸入文字檔格式。')

    output_path = Path(args.output)
    save_json_file(output_path, questions)

    if args.auto_import:
        auto_import_to_data(args.subject, output_path, Path(args.data_dir))


if __name__ == '__main__':
    main()
