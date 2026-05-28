# v71 英文題庫匯入說明：JSON Array 版

本版新增英文題庫外部檔案：

- `question_bank_english.json`：純 JSON 陣列，適合備份、給 AI 續寫、匯入資料庫。
- `question_bank_english.js`：Netlify 靜態網站直接讀取的題庫檔，格式為：
  `window.MY_ENGLISH_BANK = [ ... ];`

## 每題格式

```json
{
  "id": "EN-001",
  "type": "單字詞彙",
  "passage": "閱讀題或克漏字文章，單題可留空",
  "question": "The weather is so _______ today...",
  "options": {
    "A": "terrible",
    "B": "beautiful",
    "C": "dark",
    "D": "heavy"
  },
  "answer": "B",
  "explanation": "繁體中文解析",
  "difficulty": "基礎",
  "stage": "intro",
  "hint": "英文提示"
}
```

## stage 出題節奏

- `intro`：前 1–4 題，單字、時態、文法進場。
- `middle`：第 5–8 題，克漏字、短篇閱讀、表格判讀。
- `advanced`：第 9 題後與 Boss，長篇閱讀、推論、整合題。

## 題型分類

本版依照使用者提供的英文題庫分類方向，支援：

1. 單字詞彙
2. 時態
3. 其他文法
4. 克漏字測驗
5. 閱測-主題判斷
6. 閱測-細節判斷
7. 閱測-上下文猜字義
8. 閱測-結論、推論
9. 閱測-其他
