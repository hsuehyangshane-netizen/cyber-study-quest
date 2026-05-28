// Extracted from app.js to reduce file size and isolate large static config blocks.

const SKIN_META = {
  orange_tabby: { name: "橘虎初始型", rarity: "COMMON", src: "./assets/img/skins/orange_tabby.png", effect: { type: "generalExp", value: 0.03 }, effectText: "全科答對 EXP +3%" },
  tuxedo_basic: { name: "燕尾黑白型", rarity: "COMMON", src: "./assets/img/skins/tuxedo_basic.png", effect: { type: "subjectExp", subject: "英文", value: 0.08 }, effectText: "英文答對 EXP +8%" },
  siamese_basic: { name: "暹羅奶咖型", rarity: "COMMON", src: "./assets/img/skins/siamese_basic.png", effect: { type: "potionExp", value: 0.10 }, effectText: "升級藥水 EXP +10%" },
  gray_tabby: { name: "灰紋巡航型", rarity: "COMMON", src: "./assets/img/skins/gray_tabby.png", effect: { type: "subjectExp", subject: "數學", value: 0.08 }, effectText: "數學答對 EXP +8%" },
  white_basic: { name: "雪白軟糖型", rarity: "COMMON", src: "./assets/img/skins/white_basic.png", effect: { type: "healBoost", value: 0.10 }, effectText: "回復藥水效果 +10%" },
  black_basic: { name: "黑曜夜行型", rarity: "COMMON", src: "./assets/img/skins/black_basic.png", effect: { type: "bossExp", value: 0.08 }, effectText: "Boss 題答對 EXP +8%" },
  ninja_orange: { name: "武士橘喵型", rarity: "UNCOMMON", src: "./assets/img/skins/ninja_orange.png", effect: { type: "subjectExp", subject: "國文", value: 0.18 }, effectText: "國文答對 EXP +18%" },
  cozy_siamese: { name: "暖心毛衣型", rarity: "UNCOMMON", src: "./assets/img/skins/cozy_siamese.png", effect: { type: "catLove", value: 2 }, effectText: "答對時 Pixel 親密度額外 +2" },
  detective_gray: { name: "偵探灰影型", rarity: "RARE", src: "./assets/img/skins/detective_gray.png", effect: { type: "subjectExp", subject: "社會", value: 0.20 }, effectText: "社會答對 EXP +20%" },
  astronaut_white: { name: "太空白喵型", rarity: "RARE", src: "./assets/img/skins/astronaut_white.png", effect: { type: "subjectExp", subject: "自然", value: 0.20 }, effectText: "自然答對 EXP +20%" },
  wizard_black: { name: "魔導黑喵型", rarity: "EPIC", src: "./assets/img/skins/wizard_black.png", effect: { type: "hardExp", value: 0.18 }, effectText: "困難題答對 EXP +18%" },
  cyber_tuxedo: { name: "賽博未來型", rarity: "EPIC", src: "./assets/img/skins/cyber_tuxedo.png", effect: { type: "allExpAndChest", value: 0.10 }, effectText: "全科答對 EXP +10%，Boss 擊破有機率額外寶箱" },
  ssr_moon_treasure: { name: "月夜寶藏豹貓", rarity: "SSR", src: "./assets/img/skins/ssr_moon_treasure.png", effect: { type: "allExpAndChest", value: 0.18 }, effectText: "全科答對 EXP +18%，Boss 擊破額外寶箱機率提升" },
  ssr_fortune_miko: { name: "櫻焰祈願三花", rarity: "SSR", src: "./assets/img/skins/ssr_fortune_miko.png", effect: { type: "subjectExp", subject: "國文", value: 0.35 }, effectText: "國文答對 EXP +35%，任務獎勵感應強化" },
  ssr_alchemy_queen: { name: "幻彩鍊金白貓", rarity: "SSR", src: "./assets/img/skins/ssr_alchemy_queen.png", effect: { type: "subjectExp", subject: "自然", value: 0.35 }, effectText: "自然答對 EXP +35%，藥水效果同步強化" }
};


const TITLE_META = {
  rookie: { name:"新手冒險者", effectText:"無特殊效果", effect:{} },
  textAssassin: { name:"文意刺客", effectText:"國文 EXP +5%", effect:{type:"subjectExp", subject:"國文", value:0.05} },
  mathModeler: { name:"數學建模師", effectText:"數學 EXP +5%", effect:{type:"subjectExp", subject:"數學", value:0.05} },
  sciencePilot: { name:"自然實驗王", effectText:"自然 EXP +5%", effect:{type:"subjectExp", subject:"自然", value:0.05} },
  societyReader: { name:"社會判讀者", effectText:"社會 EXP +5%", effect:{type:"subjectExp", subject:"社會", value:0.05} },
  englishHunter: { name:"英文語境獵人", effectText:"英文 EXP +5%", effect:{type:"subjectExp", subject:"英文", value:0.05} },
  catGuardian: { name:"貓貓守護者", effectText:"餵食親密度 +20%", effect:{type:"feedLove", value:0.2} },
  endlessSurvivor: { name:"無盡倖存者", effectText:"戰鬥開始 HP +10", effect:{type:"startHp", value:10} },
  ssrLucky: { name:"SSR 歐皇", effectText:"寶箱碎片獲得 +1", effect:{type:"fragmentBonus", value:1} },
  newtonWhisperer: { name:"Newton Gate 破譯者", effectText:"數學答對 EXP +8%，Boss 題 EXP +5%", effect:{type:"hybrid", effects:[{type:"subjectExp", subject:"數學", value:0.08},{type:"bossExp", value:0.05}]} }
};

const BOSS_PROFILES = {
  "國文": { icon:"🀄", name:"焚符判詞使", img:"./assets/img/bosses/chinese_boss.png", desc:"操控符咒、判詞與古文語境的怨靈術師，最擅長在字義、修辭與語氣裡埋陷阱。", hp:165, wrongPenalty:1.05, rewardFragments:4, skill:"判詞封印：答錯時 Bonus 額外歸零。" },
  "英文": { icon:"🪶", name:"緋羽夜鴉公", img:"./assets/img/bosses/english_boss.png", desc:"以詞彙、語境、時態與文意推論構成的夜鴉伯爵，會把線索藏在句子細節裡。", hp:160, wrongPenalty:1.0, rewardFragments:4, skill:"語境干擾：Boss 題 EXP 額外提高。" },
  "數學": { icon:"🔷", name:"幾何星律師", img:"./assets/img/bosses/math_boss.png", desc:"掌控幾何、代數與推理結構的星界術士，多步驟運算與圖形概念都在牠的領域內。", hp:180, wrongPenalty:1.15, rewardFragments:5, skill:"重擊：答錯扣血較高，但答對獎勵也較高。" },
  "自然": { icon:"🧪", name:"污染實驗王", img:"./assets/img/bosses/nature_boss.png", desc:"把實驗、原子、藥劑與污染變因揉成一體的瘋狂科學家，專門用觀念混淆來反擊。", hp:170, wrongPenalty:1.08, rewardFragments:5, skill:"變因污染：答錯時 Fever 減少更多。" },
  "社會": { icon:"🌍", name:"帝圖審判者", img:"./assets/img/bosses/society_boss.png", desc:"以歷史、地理、公民制度與世界局勢構成的帝王審判者，擅長地圖、制度與史料判讀。", hp:170, wrongPenalty:1.05, rewardFragments:5, skill:"制度壓力：Boss 擊破給更多碎片。" }
};


const HIDDEN_CALCULUS_QUESTIONS = [
  {
    id:"HCB-001",
    subject:"數學",
    difficulty:"hard",
    topic:"工程數學｜拉普拉斯反轉",
    question:"求 $\\mathcal{L}^{-1}\\left\\{\\dfrac{s+3}{(s+1)^2+4}\\right\\}$。",
    choices:["$e^{-t}(\\cos 2t+\\sin 2t)$","$e^{-t}(\\cos 2t+2\\sin 2t)$","$e^{-t}(\\cos t+\\sin 2t)$","$e^{-2t}(\\cos 2t+\\sin 2t)$"],
    answer:"$e^{-t}(\\cos 2t+\\sin 2t)$",
    explanation:"將 $s+3=(s+1)+2$，故反轉為 $e^{-t}\\cos 2t+e^{-t}\\sin 2t$。"
  },
  {
    id:"HCB-002",
    subject:"數學",
    difficulty:"hard",
    topic:"工程數學｜Green 定理",
    question:"令 $C$ 為單位圓正向邊界，計算 $\\displaystyle \\oint_C (x^2-y)\\,dx+(x+y^2)\\,dy$。",
    choices:["$2\\pi$","$\\pi$","$-2\\pi$","$0$"],
    answer:"$2\\pi$",
    explanation:"由 Green 定理，$\\partial Q/\\partial x-\\partial P/\\partial y=1-(-1)=2$，單位圓面積為 $\\pi$，故結果 $2\\pi$。"
  },
  {
    id:"HCB-003",
    subject:"數學",
    difficulty:"hard",
    topic:"工程數學｜常係數微分方程",
    question:"解 $y''+4y'+5y=e^{-2x}$，且 $y(0)=0,\\ y'(0)=1$。下列何者正確？",
    choices:["$e^{-2x}(1-\\cos x+\\sin x)$","$e^{-2x}(1-\\cos 2x+\\sin x)$","$e^{-2x}(1+\\cos x-\\sin x)$","$e^{-x}(1-\\cos x+\\sin x)$"],
    answer:"$e^{-2x}(1-\\cos x+\\sin x)$",
    explanation:"齊次解為 $e^{-2x}(C_1\\cos x+C_2\\sin x)$，特解為 $e^{-2x}$。代入初值可得 $C_1=-1,C_2=1$。"
  },
  {
    id:"HCB-004",
    subject:"數學",
    difficulty:"hard",
    topic:"工程數學｜重積分換序",
    question:"計算 $\\displaystyle \\int_0^1\\int_0^x e^{x^2}\\,dy\\,dx$。",
    choices:["$\\dfrac{e-1}{2}$","$e-1$","$\\dfrac{e^2-1}{2}$","$\\dfrac{1-e^{-1}}{2}$"],
    answer:"$\\dfrac{e-1}{2}$",
    explanation:"內積分先對 $y$ 得 $x e^{x^2}$，再令 $u=x^2$，結果為 $\\frac12(e-1)$。"
  },
  {
    id:"HCB-005",
    subject:"數學",
    difficulty:"hard",
    topic:"工程數學｜傅立葉級數",
    question:"在 $(0,L)$ 上，$f(x)=x$ 的傅立葉正弦級數係數 $b_n$ 為何？",
    choices:["$\\dfrac{2L(-1)^{n+1}}{n\\pi}$","$\\dfrac{L(-1)^{n+1}}{n\\pi}$","$\\dfrac{2(-1)^{n+1}}{n\\pi}$","$\\dfrac{2L(-1)^n}{n\\pi}$"],
    answer:"$\\dfrac{2L(-1)^{n+1}}{n\\pi}$",
    explanation:"$b_n=\\frac{2}{L}\\int_0^L x\\sin(n\\pi x/L)dx=\\frac{2L(-1)^{n+1}}{n\\pi}$。"
  },
  {
    id:"HCB-006",
    subject:"數學",
    difficulty:"hard",
    topic:"工程數學｜熱方程分離變數",
    question:"熱方程 $u_t=k\\,u_{xx}$，$u(0,t)=u(L,t)=0$，$u(x,0)=\\sin(\\pi x/L)+3\\sin(3\\pi x/L)$。求 $u(L/2,t)$。",
    choices:["$e^{-k\\pi^2t/L^2}-3e^{-9k\\pi^2t/L^2}$","$e^{-k\\pi^2t/L^2}+3e^{-9k\\pi^2t/L^2}$","$e^{-k\\pi^2t/L^2}-e^{-9k\\pi^2t/L^2}$","$3e^{-k\\pi^2t/L^2}-e^{-9k\\pi^2t/L^2}$"],
    answer:"$e^{-k\\pi^2t/L^2}-3e^{-9k\\pi^2t/L^2}$",
    explanation:"代入 $x=L/2$，有 $\\sin(\\pi/2)=1$，$\\sin(3\\pi/2)=-1$。"
  },
  {
    id:"HCB-007",
    subject:"數學",
    difficulty:"hard",
    topic:"工程數學｜廣義積分",
    question:"設 $a>0$，計算 $\\displaystyle \\int_0^\\infty \\dfrac{x}{(x^2+a^2)^2}\\,dx$。",
    choices:["$\\dfrac{1}{2a^2}$","$\\dfrac{1}{a^2}$","$\\dfrac{1}{2a}$","$\\dfrac{\\pi}{4a^2}$"],
    answer:"$\\dfrac{1}{2a^2}$",
    explanation:"令 $u=x^2+a^2$，$du=2x dx$，得 $\\frac12\\int_{a^2}^{\\infty}u^{-2}du=\\frac{1}{2a^2}$。"
  },
  {
    id:"HCB-008",
    subject:"數學",
    difficulty:"hard",
    topic:"工程數學｜留數定理",
    question:"求 $\\displaystyle \\operatorname{Res}_{z=i}\\dfrac{e^{2z}}{(z-i)^2}$。",
    choices:["$2e^{2i}$","$e^{2i}$","$-2e^{2i}$","$2ie^{2i}$"],
    answer:"$2e^{2i}$",
    explanation:"二階極點型態 $g(z)/(z-i)^2$ 的留數為 $g'(i)$。此處 $g(z)=e^{2z}$，故 $g'(i)=2e^{2i}$。"
  },
  {
    id:"HCB-009",
    subject:"數學",
    difficulty:"hard",
    topic:"工程數學｜拉普拉斯微分性質",
    question:"求 $\\mathcal{L}\\{t e^{-3t}\\sin 2t\\}$。",
    choices:["$\\dfrac{4(s+3)}{((s+3)^2+4)^2}$","$\\dfrac{2(s+3)}{((s+3)^2+4)^2}$","$\\dfrac{4s}{((s+3)^2+4)^2}$","$\\dfrac{4(s+3)}{((s+3)^2-4)^2}$"],
    answer:"$\\dfrac{4(s+3)}{((s+3)^2+4)^2}$",
    explanation:"$\\mathcal{L}\\{e^{-3t}\\sin2t\\}=2/((s+3)^2+4)$，再用 $\\mathcal{L}\\{tf(t)\\}=-F'(s)$。"
  },
  {
    id:"HCB-010",
    subject:"數學",
    difficulty:"hard",
    topic:"工程數學｜部分分式與反轉",
    question:"求 $\\mathcal{L}^{-1}\\left\\{\\dfrac{1}{(s^2+1)(s^2+4)}\\right\\}$。",
    choices:["$\\dfrac{1}{3}\\sin t-\\dfrac{1}{6}\\sin 2t$","$\\dfrac{1}{3}\\sin t-\\dfrac{1}{3}\\sin 2t$","$\\dfrac{1}{6}\\sin t-\\dfrac{1}{3}\\sin 2t$","$\\dfrac{1}{3}\\cos t-\\dfrac{1}{6}\\cos 2t$"],
    answer:"$\\dfrac{1}{3}\\sin t-\\dfrac{1}{6}\\sin 2t$",
    explanation:"$\\frac{1}{(s^2+1)(s^2+4)}=\\frac{1}{3}\\frac{1}{s^2+1}-\\frac{1}{3}\\frac{1}{s^2+4}$，反轉得 $\\frac{1}{3}\\sin t-\\frac{1}{6}\\sin 2t$。"
  }
];

const ACHIEVEMENTS = [
  { id:"firstBoss", title:"第一次擊敗 Boss", desc:"擊破 1 隻 Boss", key:"boss", target:1, reward:{exp:40, fragments:5, title:"endlessSurvivor"} },
  { id:"correct10", title:"十連破解", desc:"累積答對 10 題", key:"correct", target:10, reward:{exp:50, fragments:3} },
  { id:"catLove100", title:"貓貓守護者", desc:"Pixel 親密度達 100", custom:()=>state.cat.love>=100 || state.cat.level>=2, reward:{exp:40, title:"catGuardian"} },
  { id:"ssrFirst", title:"SSR 歐皇", desc:"獲得任一 SSR 造型", custom:()=>state.cat.unlockedSkins.some(id=>SKIN_META[id]?.rarity==="SSR"), reward:{exp:80, title:"ssrLucky"} },
  { id:"feverOne", title:"第一次 Fever", desc:"Fever 啟動 1 次", key:"fever", target:1, reward:{exp:35, fragments:3} },
  { id:"endless50", title:"無盡模式倖存者", desc:"單輪答題達 50 題", custom:()=>state.gameMode==="endless" && state.total>=50, reward:{exp:100, chest:1, title:"endlessSurvivor"} },
  { id:"chinese10", title:"文意刺客", desc:"完成 10 題國文", key:"chinese", target:10, reward:{exp:45, title:"textAssassin"} },
  { id:"math10", title:"數學建模師", desc:"完成 10 題數學", key:"math", target:10, reward:{exp:45, title:"mathModeler"} },
  { id:"nature10", title:"自然實驗王", desc:"完成 10 題自然", key:"nature", target:10, reward:{exp:45, title:"sciencePilot"} },
  { id:"society10", title:"社會判讀者", desc:"完成 10 題社會", key:"society", target:10, reward:{exp:45, title:"societyReader"} },
  { id:"english10", title:"英文語境獵人", desc:"完成 10 題英文", key:"english", target:10, reward:{exp:45, title:"englishHunter"} }
];

const RANDOM_EVENTS = [
  {
    id:"examNight", title:"期末考前夜", desc:"Pixel 發現一份破碎筆記。要怎麼處理？",
    choices:[
      { text:"挑戰困難題模組", effect:"EXP +25，但 HP -8", run:()=>{ addExp(25); state.hp=Math.max(1,state.hp-8); } },
      { text:"整理錯題筆記", effect:"寶箱碎片 +3", run:()=>{ gainFragments(3); } },
      { text:"讓 Pixel 休息", effect:"HP +12，親密度 +8", run:()=>{ state.hp=Math.min(100,state.hp+12); state.cat.love=Math.min(100,state.cat.love+8); } }
    ]
  },
  {
    id:"mysteryTutor", title:"神秘補習班", desc:"小喵發現一個可疑的速成課程。",
    choices:[
      { text:"破解課程資料庫", effect:"Fever +30", run:()=>gainFever(30) },
      { text:"拿走練習卷", effect:"EXP +18，碎片 +2", run:()=>{ addExp(18); gainFragments(2); } },
      { text:"把小魚乾留給貓", effect:"小魚乾 +8", run:()=>{ state.cat.fish+=8; } }
    ]
  },
  {
    id:"catSignal", title:"貓貓訊號", desc:"這小傢伙盯著螢幕，好像發現了什麼。",
    choices:[
      { text:"跟著他調查", effect:"寶箱碎片 +4", run:()=>gainFragments(4) },
      { text:"摸摸他冷靜一下", effect:"親密度 +12", run:()=>{ state.cat.love=Math.min(100,state.cat.love+Math.round(12*(1+(titleBonus("feedLove")||0)))); } },
      { text:"直接進入下一題", effect:"Bonus Combo +1", run:()=>{ state.bonusCombo=(state.bonusCombo||0)+1; } }
    ]
  }
];

const SHOP_ITEMS = [
  { id:"removeWrong", icon:"🧹", name:"刪錯卡", desc:"戰鬥中刪除 1 個錯誤選項。", costType:"fish", cost:6 },
  { id:"hintCard", icon:"💡", name:"提示卡", desc:"顯示這題的題型提醒與思考方向。", costType:"fish", cost:5 },
  { id:"shieldCard", icon:"🛡️", name:"護盾卡", desc:"下一次答錯不扣 HP。", costType:"fish", cost:8 },
  { id:"feverBattery", icon:"⚡", name:"Fever 電池", desc:"立即補充 35 Fever 能量。", costType:"fish", cost:9 },
  { id:"bonusGuard", icon:"🔥", name:"Bonus 保護卡", desc:"下一次答錯時保住 Combo 不歸零。", costType:"fragments", cost:3 },
  { id:"expBoost", icon:"📘", name:"EXP 加倍卡", desc:"下一題答對 EXP 加倍。", costType:"fragments", cost:4 },
  { id:"hardTicket", icon:"🧠", name:"困難挑戰券", desc:"下一題強制困難，答對額外給碎片。", costType:"fragments", cost:3 }
];

const MAP_NODE_POOL = [
  { id:"normal", icon:"📘", title:"穩定學習節點", desc:"下一題維持目前節奏，HP +4。", reward:"安全、回血", run:()=>{ state.hp=Math.min(100,state.hp+4); state.nextQuestionMode=null; } },
  { id:"hard", icon:"🧠", title:"困難挑戰節點", desc:"下一題強制困難，答對可得到額外碎片。", reward:"高風險高報酬", run:()=>{ state.nextQuestionMode="hard"; state.hardNodeBonus=true; } },
  { id:"shop", icon:"🛒", title:"小魚乾商店", desc:"進入商店購買提示、護盾、刪錯卡等道具。", reward:"補給與策略", run:()=>showShopPage(true) },
  { id:"rest", icon:"🐾", title:"貓貓休息站", desc:"Pixel 休息並幫你回血，親密度也會上升。", reward:"HP +15、親密度 +8", run:()=>{ state.hp=Math.min(100,state.hp+15); state.cat.love=Math.min(100,state.cat.love+8); } },
  { id:"event", icon:"🌙", title:"突發事件節點", desc:"直接觸發一個隨機事件，可能賺也可能虧。", reward:"事件選擇", run:()=>showRandomEvent() },
  { id:"boss", icon:"👑", title:"Boss 追蹤節點", desc:"加速進入 Boss 戰，適合狀態很好的時候。", reward:"快速刷碎片", run:()=>{ state.roundCount=10; } }
];


window.HIDDEN_CALCULUS_QUESTIONS = HIDDEN_CALCULUS_QUESTIONS;
