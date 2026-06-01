# CAP Exam Crawler Project

此專案目標是從 `https://cap.rcpet.edu.tw/examination.html` 這類 CAP 歷屆題目網站抓取題目，並轉換成 `cyber-study-quest` 專案可用的本地題庫格式。

## 1. 目標

- 分析目標網站結構，找出可抓取的題目頁面或資料來源
- 將題目資料抽取為結構化格式
- 將題庫轉換為 `data/question_bank_*.json` / `data/question_bank_*.js` 可讀的格式
- 留下可擴充的分析與生成入口，以後可接 AI 題型分析與生成

## 2. 技術選型

- Python 3
- `requests`：抓取靜態頁面
- `beautifulsoup4`：分析 HTML
- `lxml`：更穩定的 HTML 解析
- `argparse`：CLI 介面

如果目標頁面需要動態渲染，可再引入：
- `playwright`
- `selenium`

## 3. 開發流程

1. **網站調查**
   - 先透過入口頁 `https://cap.rcpet.edu.tw/examination.html` 找到各科、各年、歷屆題目連結
   - 判斷題目是否在 HTML 中、PDF 中、或嵌入圖片

2. **入口掃描**
   - 寫一個 `discover` 功能，列出所有可抓取的 URL
   - 儲存發現的頁面清單

3. **資料抓取**
   - 依照發現的 URL 一一抓取內容
   - 針對每個頁面分析題目區塊、選項、答案、解析
   - 若遇到 PDF/圖片，下載檔案並記錄路徑

4. **資料結構化**
   - 將題目轉換成統一 schema，例如：
     - `id`
     - `Subject_Area`
     - `Topic_Name`
     - `Question_Type`
     - `Difficulty`
     - `Question`
     - `Options`
     - `Correct_Answer`
     - `Solution_Steps`
     - `Hint`

5. **輸出與整合**
   - 以 JSON 存檔
   - 撰寫一個轉換器，將 JSON 轉成 `data/question_bank_*.js` 的格式
   - 測試是否可以在 `index.html` 使用

## 4. 目錄結構

- `crawler/`
  - `README.md`
  - `requirements.txt`
  - `crawl_cap_rcpet.py`
  - `convert_to_js.py`
  - `parse_pdf.py`
  - `ai_modify.py`
  - `ai_assistant.py`

## 5. 已實作工具

- `crawl_cap_rcpet.py`
  - `discover`: 掃描 CAP 網站內部連結
  - `discover-exams`: 列出歷屆試題年份與 exam 頁面
  - `extract-resources`: 解析單一年份頁面的 PDF / 試題資源連結
  - `batch-resources`: 批次解析所有年份的資源列表
  - `download-pdfs`: 下載可辨識的 PDF 連結
- `convert_to_js.py`: 將 JSON 題庫轉成 `window.MY_*_BANK = [...]` 的 JS 檔
- `parse_pdf.py`: 從下載的 PDF 中擷取文字，輸出 JSON 或 TXT
- `ai_modify.py`: 重新改寫題目，支援本地模型或模板改寫
- `ai_assistant.py`: AI 助教 CLI，查詢題庫並搭配本地模型回答

## 6. 注意事項

- 爬取前請確認網站使用條款與版權限制
- 先以合理頻率抓取，避免對目標網站造成負擔
- 先測試小範圍，再擴大到整個歷屆題庫

## 7. 使用範例

### 1) 取得歷屆年份網址

```bash
python3 crawler/crawl_cap_rcpet.py discover-exams --url https://cap.rcpet.edu.tw/examination.html
```

### 2) 解析 115 年試題資源

```bash
python3 crawler/crawl_cap_rcpet.py extract-resources --url https://cap.rcpet.edu.tw/exam/115/115exam.html
```

### 3) 批次解析所有年份的資源

```bash
python3 crawler/crawl_cap_rcpet.py batch-resources --url https://cap.rcpet.edu.tw/examination.html
```

### 4) 下載 PDF 檔案

```bash
python3 crawler/crawl_cap_rcpet.py download-pdfs --links-file crawler/output/exam_year_resources.json --output-dir pdfs
```

### 5) 解析 PDF 並輸出文字

```bash
python3 crawler/parse_pdf.py --input crawler/output/pdfs --output-dir crawler/output/pdf_text --format json
```

### 6) 將 JSON 題庫轉成 JS

```bash
python3 crawler/convert_to_js.py --input crawler/output/revised_questions.json --output crawler/output/question_bank_math.js
```

### 7) 啟動 AI 助教

```bash
python3 crawler/ai_assistant.py --question-bank data/question_bank_math.json
```

## 8. AI 改題

- `ai_analysis/`：題型分類與關鍵字擷取
- `generate_question/`：根據題型模板生成相似題目
- `assistant/`：AI 助教問答介面
- `crawler/parse_pdf.py`：如果題目只有 PDF 版本，做 OCR 或 PDF 解析

## 6. 注意事項

- 爬取前請確認網站使用條款與版權限制
- 先以合理頻率抓取，避免對目標網站造成負擔
- 先測試小範圍，再擴大到整個歷屆題庫

## 7. AI 改題

- `crawler/ai_modify.py`：將抓到的題目重新改寫為新變體
- 支援本地模型（`llama_cpp`）或簡單模板改寫
- 輸入檔案可為 `.json` 或 `.js` 題庫檔案
- 輸出改寫後的題庫 JSON 檔案

### 本地 AI 模型

- 安裝可選套件：
  - `pip install llama-cpp-python`
- 準備本地模型權重，例如 `ggml-*.bin`
- 執行範例：
  - `python3 crawler/ai_modify.py --input ./crawler/output/scraped_questions.json --output ./crawler/output/rewritten_questions.json --mode model --model-path /path/to/ggml-model.bin`

### 先不帶模型時

- 可使用 `--mode template` 先做簡單改寫與格式整理
- 之後再換成本地模型產生更自然的題目
