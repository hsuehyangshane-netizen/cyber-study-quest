# v72 數學題庫匯入說明：JSON Array 版

本版新增數學題庫外部檔案：

- `question_bank_math.json`：純 JSON 題庫，適合備份、續寫與資料庫匯入。
- `question_bank_math.js`：Netlify 靜態網站直接讀取的題庫檔。

格式採用使用者指定的數學結構：

```json
{
  "Category_ID": "A1-1",
  "Topic_Name": "四則運算與科學記號",
  "Question": "題目，公式使用 LaTeX",
  "Options": {
    "A": "選項A",
    "B": "選項B",
    "C": "選項C",
    "D": "選項D"
  },
  "Correct_Answer": "C",
  "Solution_Steps": [
    "步驟一：...",
    "步驟二：..."
  ],
  "Image_Requirement": {
    "Need_Image": false,
    "Past_Exam_Reference": null,
    "AI_Draw_Prompt": null
  }
}
```

本版先放入 A1 四則運算與科學記號共 7 題。
之後繼續產生 A2、A3 等題目時，只要追加到 `question_bank_math.js` 的 `window.MY_MATH_BANK = [...]` 即可。
