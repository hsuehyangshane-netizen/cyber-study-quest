function isNewtonUnlocked(){
  return String(state.cat?.name || "").trim().toLowerCase() === "newton";
}

function updateHiddenBossButton(){
  const btn = $("hiddenNewtonBossBtn");
  if(!btn) return;
  const unlocked = isNewtonUnlocked();
  btn.style.display = unlocked ? "inline-flex" : "none";
  btn.textContent = state.hiddenBossFirstClear ? "∂²" : "∂";
  btn.title = unlocked ? (state.hiddenBossFirstClear ? "Newton Gate（已破解，可再次挑戰）" : "Newton Gate") : "";
  btn.setAttribute("aria-label", btn.title || "hidden boss trigger");
}

function hiddenBossProfile(){
  return {
    icon:"∂",
    name:"國立彰化師範大學 陳明飛校長",
    img:"./assets/img/bosses/hidden_calc_boss.png",
    desc:"虛構隱藏 Boss。沒有提示、沒有暖身，只有高壓工程數學；每一題的答案都近得離譜。",
    hp:999,
    wrongPenalty:1.85,
    rewardFragments:12,
    skill:"Newton Gate：10 題工程數學連擊，答錯就被懲罰。"
  };
}

function grantHiddenBossRewards(){
  const firstClear = !state.hiddenBossFirstClear;
  const expReward = 140 + state.correct * 18;
  const fragmentReward = 6 + Math.max(2, state.correct);
  const chestReward = firstClear ? 2 : 1;
  addExp(expReward);
  gainFragments(fragmentReward);
  state.chests += chestReward;
  state.hiddenBossClearCount = (state.hiddenBossClearCount || 0) + 1;
  state.hiddenBossFirstClear = true;
  if(!state.titles.includes("newtonWhisperer")) state.titles.push("newtonWhisperer");
  state.battleLog.unshift(`∂ Newton Gate 獎勵發放：EXP +${expReward}、寶箱 +${chestReward}、碎片 +${fragmentReward}${firstClear ? "｜稱號解鎖：Newton Gate 破譯者" : ""}`);
}


function cleanupHiddenBossNavigation(resetSubject=false){
  state.hiddenBossMode = false;
  state.bossMode = false;
  state.currentQuestion = null;
  state.activeSession = null;
  state.mapPending = false;
  state.mapNodes = [];
  state.dungeonMap = null;
  state.currentRoomId = null;
  state.pendingRoomId = null;
  state.lastMapNote = "";
  state.nextQuestionMode = null;
  state.wrongBookMode = false;
  state.wrongBookModeSubject = null;
  state.daily3Mode = false;
  state.wrongBookModeTypeKey = null;
  state.weakPracticeMode = false;
  state.weakPracticeTypeKey = null;
  state.eventPending = false;
  state.currentEvent = null;
  state.counterMode = false;
  if(resetSubject){
    state.subject = null;
    state.gameMode = "chapter";
    state.hiddenBossResult = "";
  }
}

function finishHiddenBossRun(victory){
  const won = !!victory;
  state.stageCleared = won;
  state.hiddenBossResult = won ? "victory" : "defeat";
  if(won) grantHiddenBossRewards();
  state.hiddenBossLastScore = {
    victory: won,
    correct: state.correct,
    wrong: state.wrong,
    total: state.total,
    accuracy: calcAccuracy(),
    remainingHp: state.hp,
    clearedAt: new Date().toISOString()
  };
  cleanupHiddenBossNavigation(false);
  saveGameState();
  if(!won){
    cleanupHiddenBossNavigation(true);
    setCatMessage("小喵", "Newton Gate 挑戰失敗。這不是普通數學題，也不會進錯題本。先回主頁喘口氣。");
    return goHome();
  }
  switchToStartMusic();
  return showReport();
}

function startHiddenCalculusBoss(){
  if(!isNewtonUnlocked()) return;
  switchToHiddenBossMusic();
  state.subject = "Newton Gate";
  state.gameMode = "hidden";
  state.hiddenBossMode = true;
  state.hiddenBossIndex = 0;
  state.stageCleared = false;
  state.rogueBuffs = {}; state.roguePending = false; state.correctSinceBuff = 0;
  if(typeof resetStageQuestionMemory === "function") resetStageQuestionMemory(); else state.stageQuestionSigs = new Set();
  state.difficulty = "hard";
  state.monsterMaxHp = 999;
  state.monsterHp = 999;
  state.hp = 100;
  state.correct = 0;
  state.wrong = 0;
  state.total = 0;
  state.roundCount = 0;
  state.bossCount = 0;
  state.bossMode = true;
  state.correctStreak = 0;
  state.wrongStreak = 0;
  state.totalExpEarned = 0;
  state.answered = false;
  state.battleLog = [];
  state.wrongBookMode = false;
  state.wrongBookModeSubject = null;
  state.wrongBookModeTypeKey = null;
  state.weakPracticeMode = false;
  state.weakPracticeTypeKey = null;
  state.eventPending = false;
  state.eventCounter = 0;
  state.currentEvent = null;
  state.counterMode = false;
  state.mapPending=false; state.mapCooldownRound=-1; state.mapNodes=[]; state.dungeonFloor=1; state.dungeonMap=null; state.currentRoomId=null; state.pendingRoomId=null; state.lastMapNote=''; state.nextQuestionMode=null; state.activeShield=false; state.activeBonusGuard=false; state.activeExpBoost=false; state.hardNodeBonus=false;
  state.usedIds = new Set();
  state.currentQuestion = null;
  state.activeSession = null;
  state.hiddenBossResult = "";
  $("feedbackArea").innerHTML=`<div class="feedback-card wrong boss-feedback"><div class="feedback-title wrong">∂ Newton Gate 啟動</div><p>10 題工程數學連發開始。沒有提示、沒有暖身，請直接作答。</p></div>`;
  state.battleLog.unshift("∂ Newton Gate 啟動：極限微積術師已出現。這次沒有提示，只有工程數學。");
  nextHiddenCalculusQuestion();
  renderBattle();
  showPage("battlePage");
}


function prepareHiddenBossQuestion(q, sourceIndex){
  const question = {...q};
  const correct = question.answer;
  const distractors = (question.choices || []).filter(x => x !== correct);
  for(let i=distractors.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [distractors[i], distractors[j]] = [distractors[j], distractors[i]];
  }
  // v103: keep hidden-boss answers spread across A/B/C/D, not always A.
  const answerSlots = [2,0,3,1,2,1,3,0,2,1]; // C,A,D,B,C,B,D,A,C,B
  const target = answerSlots[sourceIndex % answerSlots.length];
  const arranged = [];
  let d = 0;
  for(let i=0;i<4;i++){
    arranged[i] = (i === target) ? correct : distractors[d++];
  }
  question.choices = arranged;
  question.answer = correct;
  question.correctLetter = choiceLetter(target);
  return question;
}


function nextHiddenCalculusQuestion(){
  if(!state.hiddenBossMode) return nextAdaptiveQuestion();
  if(state.hp <= 0) return finishHiddenBossRun(false);
  if(state.hiddenBossIndex >= HIDDEN_CALCULUS_QUESTIONS.length) return finishHiddenBossRun(true);
  const sourceIndex = state.hiddenBossIndex;
  const q = prepareHiddenBossQuestion(HIDDEN_CALCULUS_QUESTIONS[sourceIndex], sourceIndex);
  q.subject = "Newton Gate";
  state.hiddenBossIndex += 1;
  state.currentQuestion = q;
  state.currentQuestion.boss = true;
  state.currentQuestion.hiddenBoss = true;
  state.currentQuestion.difficulty = "hard";
  state.bossMode = true;
  state.difficulty = "hard";
  state.answered = false;
}

