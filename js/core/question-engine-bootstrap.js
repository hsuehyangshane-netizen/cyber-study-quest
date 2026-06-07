// Bootstrap placeholders so the app can initialize even before dynamic generators finish wiring.
window.CSQ_META = {
  "國文": { icon: "📜", monster: "文意解碼妖靈", desc: "字詞、句意、短文主旨、雙文本與論證", monsterDesc: "牠會把關鍵線索藏在語氣、轉折與前後文裡。" },
  "英文": { icon: "🔤", monster: "語境幽影", desc: "基礎字詞、文法、生活閱讀與推論", monsterDesc: "牠專門利用時態、代名詞與語氣暗示設陷阱。" },
  "數學": { icon: "🧮", monster: "建模機械獸", desc: "基本計算、比例、函數、機率、幾何與資料判讀", monsterDesc: "牠會把生活情境轉成算式、圖形與比例陷阱。" },
  "自然": { icon: "⚗️", monster: "實驗異變體", desc: "基本概念、控制變因、實驗設計與資料限制", monsterDesc: "牠會把錯誤推論藏在實驗條件與資料限制裡。" },
  "社會": { icon: "🌏", monster: "時空判讀守衛", desc: "地圖、歷史、公民、媒體識讀與公共議題", monsterDesc: "牠守在地圖、史料、制度與公共判斷的交界。" }
};

window.CSQ_DIFFICULTY_LABEL = { easy: "簡單", normal: "普通", hard: "困難" };

function placeholder(n){
  return Array.from({length:n}, (_, i) => ({id:"GEN-" + i}));
}

window.CSQ_QUESTION_BANK = {};
Object.keys(window.CSQ_META).forEach(s => {
  window.CSQ_QUESTION_BANK[s] = {
    easy: placeholder(9999),
    normal: placeholder(9999),
    hard: placeholder(9999)
  };
});
