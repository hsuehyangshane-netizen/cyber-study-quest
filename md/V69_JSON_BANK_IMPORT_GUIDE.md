# v69 題庫匯入說明：JSON Array 版

本版已把國文題庫改成「外部 JSON 陣列」可匯入格式。

## 最容易改的檔案

1. `question_bank_chinese.json`
   - 純 JSON 陣列，適合拿去給 AI、Firebase、MongoDB、後端資料庫或版本管理。
2. `question_bank_chinese.js`
   - Netlify 靜態網站會直接讀這個檔案。
   - 格式是：
     `window.MY_CHINESE_BANK = [ ... ];`

如果你只是要部署到 Netlify，請改 `question_bank_chinese.js`。
如果你要備份或給 AI 續寫題庫，請用 `question_bank_chinese.json`。

## 每題格式

```json
{
  "id": "CH-001",
  "topic": "形音義",
  "context": "情境或題組引文，可留空",
  "question": "題目敘述",
  "options": [
    "A. 選項一",
    "B. 選項二",
    "C. 選項三",
    "D. 選項四"
  ],
  "answer": "A",
  "explanation": "解析",
  "difficulty": "基礎",
  "stage": "intro",
  "hint": "提示"
}
```

## 漸進式出題用 stage

- `intro`：前 1–4 題，基礎分析進場。
- `middle`：第 5–8 題，資料判讀與生活文本。
- `advanced`：第 9 題後與 Boss，題組、跨文本、新詩、文言。

如果 AI 生成題庫時沒有填 `stage`，系統會依題號與 topic 自動判斷。
