# 會考貓貓冒險

可直接部署到 GitHub Pages 的前端學習遊戲。

## 本版重點

- 電腦版與手機版響應式排版
- 答題後以「本地錯題整理」作為主要學習區
- 下方保留 Pickaxe Chat Input 外部 AI 輔助追問
- 推薦追問按鈕會自動整理目前題目、選項、學生答案、正確答案與解析
- 推薦追問會優先嘗試自動填入 Pickaxe Chat Input；若 Pickaxe 仍封裝成不可操作元件，才會自動複製

## 部署方式

1. 將本資料夾內容上傳到 GitHub repository。
2. 到 GitHub Pages 設定發布分支。
3. 開啟 `index.html` 所在的 GitHub Pages 網址。

## 主要檔案

- `index.html`：主頁面
- `css/style.css`：版面與響應式樣式
- `js/app.js`：主要遊戲邏輯與 AI 輔助流程
- `data/question_bank_*.js`：題庫資料
- `assets/`：遊戲圖片、音樂與音效

## 注意

請勿刪除 `assets/`、`data/`、`js/` 或 `css/` 中的檔案，否則題目、圖片、音效或遊戲功能可能失效。
