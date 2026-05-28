# GitHub Pages 部署檢查表

如果音樂、圖片或 GIF 跑不出來，最常見原因不是程式壞掉，而是 GitHub Pages 沒有讀到 `assets` 資料夾。

## 必須這樣上傳

請把 zip 解壓縮後，將以下檔案與資料夾一起放到 GitHub repository 的同一層：

```text
index.html
style.css
app.js
data.js
question_bank_chinese.js
question_bank_english.js
question_bank_math.js
question_bank_science.js
question_bank_social.js
assets/
```

重點：不要只上傳 zip 檔。GitHub Pages 不會自動解壓縮 zip。

## 正確資料夾結構

```text
你的 repo/
├─ index.html
├─ style.css
├─ app.js
├─ data.js
├─ question_bank_math.js
├─ question_bank_science.js
├─ question_bank_social.js
└─ assets/
   ├─ start_music.mp3
   ├─ battle_music.mp3
   ├─ nova_pixel_chibi.gif
   ├─ skins/
   ├─ bosses/
   ├─ math/
   ├─ science/
   └─ social/
```

## 大小寫要完全相同

GitHub Pages 是大小寫敏感的伺服器。以下是不一樣的路徑：

```text
assets/skins/orange_tabby.png
Assets/skins/orange_tabby.png
assets/Skins/orange_tabby.png
```

請確認資料夾名稱就是小寫 `assets`。

## 音樂播放注意

多數瀏覽器不允許網頁自動播放音樂。請先點遊戲中的「開始練習」，或確認瀏覽器分頁沒有被靜音。

## 如何檢查

打開 GitHub Pages 網站後，首頁會出現「資源狀態」。如果顯示資源讀不到，請回 repo 檢查 assets 資料夾是否真的存在。
