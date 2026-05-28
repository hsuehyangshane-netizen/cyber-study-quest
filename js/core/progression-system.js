function bossProfile(){ return state.hiddenBossMode ? hiddenBossProfile() : (BOSS_PROFILES[state.subject] || {icon:"👑", name:"核心 Boss", img:"", hp:160, wrongPenalty:1, rewardFragments:4, desc:"核心 Boss。", skill:"無"}); }
function titleMeta(){ return TITLE_META[state.equippedTitle] || TITLE_META.rookie; }
function titleBonus(type, subject){
  const eff = titleMeta().effect || {};
  if(eff.type === "hybrid" && Array.isArray(eff.effects)){
    return eff.effects
      .filter(x=>x.type === type && (!subject || x.subject === subject))
      .reduce((sum,x)=>sum + (x.value || 0), 0);
  }
  if(eff.type === type && (!subject || eff.subject === subject)) return eff.value || 0;
  return 0;
}
function rewardText2(r){
  const arr=[];
  if(r.exp) arr.push(`EXP +${r.exp}`);
  if(r.fragments) arr.push(`碎片 +${r.fragments}`);
  if(r.chest) arr.push(`寶箱 +${r.chest}`);
  if(r.title) arr.push(`稱號：${TITLE_META[r.title]?.name || r.title}`);
  return arr.join("｜");
}
function gainFragments(n){
  const bonus = titleBonus("fragmentBonus") ? titleBonus("fragmentBonus") : 0;
  state.fragments = (state.fragments || 0) + n + bonus;
  while(state.fragments >= 10){
    state.fragments -= 10;
    state.chests++;
    pushLootLog("🧩 寶箱碎片合成：寶箱 +1。");
  }
}
function craftChestFromFragments(){
  if((state.fragments || 0) < 10){
    if($("gachaMessage")) $("gachaMessage").textContent = `碎片不足，目前 ${state.fragments || 0}/10。`;
    return;
  }
  state.fragments -= 10;
  state.chests++;
  if($("gachaMessage")) $("gachaMessage").textContent = "碎片合成成功：寶箱 +1。";
  updateSidebar();
}
function achievementProgress(a){
  if(a.custom) return a.custom() ? a.target || 1 : 0;
  return questValue(a.key);
}
function applyAchievementReward(r){
  if(r.exp) addExp(r.exp);
  if(r.fragments) gainFragments(r.fragments);
  if(r.chest) state.chests += r.chest;
  if(r.title && !state.titles.includes(r.title)) state.titles.push(r.title);
}
function claimAchievement(id){
  const a = ACHIEVEMENTS.find(x=>x.id===id);
  if(!a || state.achievements[id]) return;
  const target = a.target || 1;
  if(achievementProgress(a) < target) return;
  state.achievements[id] = true;
  applyAchievementReward(a.reward || {});
  pushLootLog(`🏆 成就完成：${a.title}，獲得 ${rewardText2(a.reward||{})}。`);
  renderAchievementPage();
  updateSidebar();
}
function equipTitle(id){
  if(!state.titles.includes(id)) return;
  state.equippedTitle = id;
  renderAchievementPage();
  updateSidebar();
}
function renderAchievementPage(){
  const box=$("achievementList");
  if(box){
    box.innerHTML = ACHIEVEMENTS.map(a=>{
      const target=a.target||1, value=Math.min(achievementProgress(a), target), done=value>=target, claimed=!!state.achievements[a.id], pct=Math.min(100,value/target*100);
      return `<div class="achievement-card ${done?'done':''} ${claimed?'claimed':''}">
        <div class="achievement-head"><div><div class="achievement-title">${esc(a.title)}</div><div class="muted small">${esc(a.desc)}</div></div><div class="achievement-reward">${esc(rewardText2(a.reward||{}))}</div></div>
        <div class="progress-small"><div style="width:${pct}%"></div></div>
        <div class="bar-label">${value}/${target}</div>
        <button class="${done&&!claimed?'primary-btn':'secondary-btn'}" ${done&&!claimed?'':'disabled'} onclick="claimAchievement('${a.id}')">${claimed?'已領取':done?'領取成就':'尚未完成'}</button>
      </div>`;
    }).join("");
  }
  const titleList=$("titleList");
  if(titleList){
    titleList.innerHTML = Object.entries(TITLE_META).map(([id,t])=>{
      const unlocked=state.titles.includes(id), equipped=state.equippedTitle===id;
      return `<div class="title-card ${unlocked?'unlocked':'locked'} ${equipped?'equipped':''}">
        <div class="title-head"><div><div class="title-name">${esc(t.name)}</div><div class="muted small">${esc(t.effectText)}</div></div><div class="title-effect-mini">${equipped?'已裝備':unlocked?'可裝備':'未解鎖'}</div></div>
        <button class="${unlocked?'primary-btn':'secondary-btn'}" ${unlocked?'':'disabled'} onclick="equipTitle('${id}')">${equipped?'使用中':'裝備稱號'}</button>
      </div>`;
    }).join("");
  }
  if($("equippedTitleName")) $("equippedTitleName").textContent=titleMeta().name;
  if($("titleEffectText")) $("titleEffectText").textContent=`效果：${titleMeta().effectText}`;
}
function showAchievementPage(){ renderAchievementPage(); showPage("achievementPage"); }

function renderCodexPage(){
  const cats=$("codexCats");
  if(cats){
    cats.innerHTML=Object.entries(SKIN_META).map(([id,m])=>`<div class="codex-card"><div class="codex-head"><div><img src="${m.src}" alt="${esc(m.name)}"><div class="codex-name">${esc(m.name)}</div><div class="muted small">${esc(m.effectText||"")}</div></div><div class="codex-tag">${m.rarity}</div></div></div>`).join("");
  }
  const bosses=$("codexBosses");
  if(bosses){
    bosses.innerHTML=Object.entries(BOSS_PROFILES).map(([s,b])=>`<div class="codex-card"><img class="codex-boss-img" src="${b.img}" alt="${esc(b.name)}"><div class="codex-name">${b.icon} ${esc(s)}｜${esc(b.name)}</div><div class="muted small">${esc(b.desc)}</div><div class="codex-tag">${esc(b.skill)}</div></div>`).join("");
  }
  const buffs=$("codexBuffs");
  if(buffs){
    buffs.innerHTML=ROGUE_BUFFS.map(b=>`<div class="codex-card"><div class="codex-name">${b.icon} ${esc(b.title)}</div><div class="muted small">${esc(b.desc)}</div></div>`).join("");
  }
}
function showCodexPage(){ renderCodexPage(); showPage("codexPage"); }


function ensureItems(){
  state.items = Object.assign({ removeWrong:0, hintCard:0, shieldCard:0, feverBattery:0, bonusGuard:0, expBoost:0, hardTicket:0 }, state.items || {});
  state.catShards = state.catShards || {};
  state.catSkillLevels = state.catSkillLevels || {};
}

function itemName(id){
  return SHOP_ITEMS.find(x=>x.id===id)?.name || id;
}

function catSkillLevel(id = state.cat.equippedSkin){
  state.catSkillLevels = state.catSkillLevels || {};
  return state.catSkillLevels[id] || 1;
}

function catSkillMultiplier(id = state.cat.equippedSkin){
  return 1 + (catSkillLevel(id) - 1) * 0.12;
}

function catUpgradeCost(id = state.cat.equippedSkin){
  const lv = catSkillLevel(id);
  const rarity = SKIN_META[id]?.rarity || "COMMON";
  const base = rarity === "SSR" ? 4 : rarity === "EPIC" ? 3 : rarity === "RARE" ? 2 : 1;
  return { shards: base + lv - 1, fragments: Math.max(1, Math.ceil((base + lv) / 2)) };
}

function duplicateShardAmount(rarity){
  if(rarity === "SSR") return 10;
  if(rarity === "EPIC") return 6;
  if(rarity === "RARE") return 4;
  if(rarity === "UNCOMMON") return 2;
  return 1;
}

function renderCatSkillPanel(){
  if(!$("catSkillName")) return;
  const id = state.cat.equippedSkin;
  const meta = SKIN_META[id] || SKIN_META.orange_tabby;
  const lv = catSkillLevel(id);
  const cost = catUpgradeCost(id);
  $("catSkillName").textContent = meta.name;
  $("catSkillLevel").textContent = `Lv.${lv}`;
  $("catShardCount").textContent = `${state.catShards?.[id] || 0}`;
  $("catSkillEffect").textContent = `目前支援倍率：x${catSkillMultiplier(id).toFixed(2)}。升級需要 ${cost.shards} 個該貓碎片與 ${cost.fragments} 個寶箱碎片。`;
}

function upgradeEquippedCatSkill(){
  ensureItems();
  const id = state.cat.equippedSkin;
  const cost = catUpgradeCost(id);
  const haveShard = state.catShards[id] || 0;
  if(haveShard < cost.shards || (state.fragments || 0) < cost.fragments){
    setCatMessage("小喵", `這小傢伙的升級材料還不夠。需要貓碎片 ${cost.shards}、寶箱碎片 ${cost.fragments}。`);
    return;
  }
  state.catShards[id] -= cost.shards;
  state.fragments -= cost.fragments;
  state.catSkillLevels[id] = catSkillLevel(id) + 1;
  pushLootLog(`🧬 ${skinName(id)} 技能升到 Lv.${state.catSkillLevels[id]}。`);
  setCatMessage("小喵", `這小傢伙的同步等級升到 Lv.${state.catSkillLevels[id]}。看起來有點得意。`);
  updateCatUI();
  updateSidebar();
}

function renderItemBag(){
  ensureItems();
  const box = $("itemBagList");
  if(!box) return;
  const useMap = {
    removeWrong: "useRemoveWrong",
    hintCard: "useHintCard",
    shieldCard: "useShieldCard",
    feverBattery: "useFeverBattery",
    bonusGuard: "useBonusGuard",
    expBoost: "useExpBoost",
    hardTicket: "useHardTicket"
  };
  const total = SHOP_ITEMS.reduce((sum,item)=>sum+(state.items[item.id]||0),0);
  box.innerHTML = `<details class="shop-item-accordion" open>
    <summary><span>🎒 道具背包</span><strong>${total}</strong></summary>
    <div class="shop-item-grid">
      ${SHOP_ITEMS.map(item => `<div class="item-bag-card compact">
        <div class="item-name">${item.icon} ${esc(item.name)}</div>
        <div class="muted small">${esc(item.desc)}</div>
        <div class="item-count">持有：${state.items[item.id] || 0}</div>
        <div class="item-use-line"><button class="secondary-btn" onclick="${useMap[item.id]}()">使用</button></div>
      </div>`).join("")}
    </div>
  </details>`;
}

function renderShopPage(){
  ensureItems();
  const box = $("shopList");
  if(box){
    box.innerHTML = SHOP_ITEMS.map(item=>{
      const costLabel = item.costType === "fish" ? `小魚乾 ${item.cost}` : `寶箱碎片 ${item.cost}`;
      return `<div class="shop-card">
        <div class="shop-title">${item.icon} ${esc(item.name)}</div>
        <div class="muted small">${esc(item.desc)}</div>
        <div class="shop-cost">價格：${costLabel}</div>
        <button class="primary-btn" onclick="buyShopItem('${item.id}')">購買</button>
      </div>`;
    }).join("");
  }
  renderItemBag();
  updateSidebar();
}

function showShopPage(fromMap=false){
  state.shopReturnToBattle = !!fromMap;
  renderShopPage();
  showPage("shopPage");
}

function buyShopItem(id){
  ensureItems();
  const item = SHOP_ITEMS.find(x=>x.id===id);
  if(!item) return;
  if(item.costType === "fish"){
    if(state.cat.fish < item.cost){ setCatMessage("小喵", "小魚乾不夠。那隻小傢伙也不想把最後一口借出去。"); return; }
    state.cat.fish -= item.cost;
  } else {
    if((state.fragments || 0) < item.cost){ setCatMessage("小喵", "寶箱碎片不夠。先去打困難題或 Boss。"); return; }
    state.fragments -= item.cost;
  }
  state.items[id] = (state.items[id] || 0) + 1;
  pushLootLog(`🛒 購買 ${item.name} x1。`);
  renderShopPage();
  updateSidebar();
}

function useRemoveWrong(){
  ensureItems();
  if((state.items.removeWrong || 0) <= 0){ setCatMessage("小喵", "沒有刪錯卡。去商店補貨吧。"); return; }
  if(!state.currentQuestion || state.answered) return;

  const btns = Array.from(document.querySelectorAll ? document.querySelectorAll("#choices button") : []);
  const wrongBtns = btns.filter(btn =>
    btn &&
    btn.dataset &&
    btn.dataset.correct !== "1" &&
    !btn.disabled &&
    !(btn.classList && btn.classList.contains("removed-choice"))
  );

  if(!wrongBtns.length){
    setCatMessage("小喵", "目前已經沒有可刪除的錯誤選項。");
    return;
  }

  const btn = wrongBtns[Math.floor(Math.random()*wrongBtns.length)];
  btn.disabled = true;
  btn.classList.add("removed-choice");
  btn.setAttribute("aria-disabled", "true");

  state.items.removeWrong--;
  state.battleLog.unshift(`🧹 刪錯卡啟動：已確實移除一個錯誤選項。`);
  updateSidebar();
}

function useHintCard(){
  ensureItems();
  if((state.items.hintCard || 0) <= 0){ setCatMessage("小喵", "沒有提示卡。商店有賣，別硬扛。"); return; }
  if(!state.currentQuestion || state.answered) return;
  state.items.hintCard--;
  const q = state.currentQuestion;
  $("feedbackArea").innerHTML = `<div class="feedback-card correct"><div class="feedback-title correct">💡 小喵提示</div><p>題型：${esc(q.topic)}。先找題幹中的限制條件，不要只看關鍵字。這題的陷阱通常在選項的細節差異。</p></div>`;
  updateSidebar();
}

function useShieldCard(){
  ensureItems();
  if((state.items.shieldCard || 0) <= 0){ setCatMessage("小喵", "沒有護盾卡。"); return; }
  state.items.shieldCard--;
  state.activeShield = true;
  state.battleLog.unshift("🛡️ 護盾啟動：下一次答錯不扣 HP。");
  updateSidebar();
}

function useFeverBattery(){
  ensureItems();
  if((state.items.feverBattery || 0) <= 0){ setCatMessage("小喵", "沒有 Fever 電池。"); return; }
  state.items.feverBattery--;
  gainFever(35);
  state.battleLog.unshift("⚡ Fever 電池使用：能量 +35。");
  updateSidebar();
  if(state.subject) renderBattle();
}

function useBonusGuard(){
  ensureItems();
  if((state.items.bonusGuard || 0) <= 0){ setCatMessage("小喵", "沒有 Bonus 保護卡。"); return; }
  state.items.bonusGuard--;
  state.activeBonusGuard = true;
  state.battleLog.unshift("🔥 Bonus 保護啟動：下一次答錯不歸零 Combo。");
  updateSidebar();
}

function useExpBoost(){
  ensureItems();
  if((state.items.expBoost || 0) <= 0){ setCatMessage("小喵", "沒有 EXP 加倍卡。"); return; }
  state.items.expBoost--;
  state.activeExpBoost = true;
  state.battleLog.unshift("📘 EXP 加倍啟動：下一題答對 EXP x2。");
  updateSidebar();
}

function useHardTicket(){
  ensureItems();
  if((state.items.hardTicket || 0) <= 0){ setCatMessage("小喵", "沒有困難挑戰券。"); return; }
  state.items.hardTicket--;
  state.nextQuestionMode = "hard";
  state.hardNodeBonus = true;
  state.battleLog.unshift("🧠 困難挑戰券啟動：下一題強制困難，答對額外給碎片。");
  updateSidebar();
}


function randomInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

function roomCenter(room){
  return { x: room.x + room.w/2, y: room.y + room.h/2 };
}

function overlapWithMargin(a,b,margin=1){
  return !(a.x + a.w + margin <= b.x || b.x + b.w + margin <= a.x || a.y + a.h + margin <= b.y || b.y + b.h + margin <= a.y);
}

function roomTypeMeta(type){
  const meta = {
    spawn: { icon:'🏁', name:'出生房', desc:'起點房，從這裡開始探索。', reward:'起點', className:'spawn' },
    teleport: { icon:'🌀', name:'傳送房', desc:'抵達後可前往下一張地圖。', reward:'前進下一層', className:'teleport' },
    normal: { icon:'⚔️', name:'題目房', desc:'完成 1 題一般挑戰。', reward:'答題推進', className:'normal' },
    hard: { icon:'🔥', name:'挑戰房', desc:'完成 1 題較難挑戰，額外獎勵碎片。', reward:'困難題＋獎勵', className:'hard' },
    rest: { icon:'💖', name:'補給房', desc:'回復一些 HP，穩定往前。', reward:'HP 回復', className:'rest' },
    treasure: { icon:'🎁', name:'獎勵房', desc:'拿到小魚乾與碎片。', reward:'補給獎勵', className:'treasure' }
  };
  return meta[type] || meta.normal;
}

function generateDungeonMap(floor=1){
  const cols = 28;
  const rows = 18;
  const roomCount = randomInt(7, 11);
  const rooms = [];
  let attempts = 0;
  while(rooms.length < roomCount && attempts < 400){
    attempts++;
    const room = { id:`r${rooms.length+1}`, x:randomInt(1, cols-7), y:randomInt(1, rows-5), w:randomInt(3,6), h:randomInt(2,4) };
    if(room.x + room.w >= cols-1 || room.y + room.h >= rows-1) continue;
    if(rooms.some(r => overlapWithMargin(r, room, 1))) continue;
    rooms.push(room);
  }
  if(rooms.length < 5){
    return generateDungeonMap(floor);
  }
  rooms.sort((a,b)=>a.x-b.x || a.y-b.y);
  rooms.forEach((r,i)=>{ r.seq=i+1; r.neighbors=[]; r.cleared=false; r.visited=false; r.type='normal'; });
  const edges = [];
  const seen = new Set();
  const link = (a,b)=>{
    if(!a || !b || a.id===b.id) return;
    const key=[a.id,b.id].sort().join('-');
    if(seen.has(key)) return;
    seen.add(key);
    a.neighbors.push(b.id);
    b.neighbors.push(a.id);
    edges.push({a:a.id,b:b.id});
  };
  for(let i=0;i<rooms.length-1;i++) link(rooms[i], rooms[i+1]);
  const extra = randomInt(1, Math.min(3, rooms.length-3));
  for(let k=0;k<extra;k++){
    const a = rooms[randomInt(0, rooms.length-2)];
    const b = rooms[randomInt(1, rooms.length-1)];
    link(a,b);
  }

  rooms[0].type = 'spawn';
  rooms[0].cleared = true;
  rooms[0].visited = true;
  rooms[rooms.length-1].type = 'teleport';

  const mids = rooms.slice(1,-1);
  if(mids.length){
    const candidates = mids.slice();
    const shuffle = arr => { for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; } return arr; };
    shuffle(candidates);
    if(candidates[0]) candidates[0].type = 'rest';
    if(candidates[1]) candidates[1].type = 'treasure';
    const hardCount = floor >= 3 ? 2 : 1;
    for(let i=0;i<hardCount;i++) if(candidates[2+i]) candidates[2+i].type = 'hard';
  }

  const map = {
    floor,
    cols,
    rows,
    rooms,
    edges,
    spawnId: rooms[0].id,
    teleportId: rooms[rooms.length-1].id
  };
  return map;
}

function ensureDungeonMap(forceNew=false){
  if(forceNew || !state.dungeonMap){
    state.dungeonMap = assertMapHasForwardGoal(generateDungeonMap(state.dungeonFloor || 1));
    state.currentRoomId = state.dungeonMap.spawnId;
    state.pendingRoomId = null;
    state.lastMapNote = '從出生房出發，只能往前走；沿著走廊一定能抵達傳送房。';
  }
  return state.dungeonMap;
}

function currentDungeonRoom(){
  const rooms = state.dungeonMap?.rooms || [];
  return rooms.find(r=>r.id===state.currentRoomId) || null;
}

function getRoomById(id){
  const rooms = state.dungeonMap?.rooms || [];
  return rooms.find(r=>r.id===id) || null;
}

function accessibleRooms(){
  const room = currentDungeonRoom();
  if(!room) return [];
  // v86: 單向推圖。只能前往排序在目前房間之後、尚未完成的相鄰房間。
  // 地圖生成時會以房間序號串成主路徑，所以一定能一路走到傳送房。
  return room.neighbors
    .map(id=>getRoomById(id))
    .filter(r => r && r.seq > room.seq && !r.cleared)
    .sort((a,b)=>a.seq-b.seq);
}

function hasForwardPathToTeleport(map){
  if(!map || !map.rooms?.length) return false;
  const byId = Object.fromEntries(map.rooms.map(r=>[r.id,r]));
  const visited = new Set();
  const stack = [map.spawnId];
  while(stack.length){
    const id = stack.pop();
    if(id === map.teleportId) return true;
    if(visited.has(id)) continue;
    visited.add(id);
    const room = byId[id];
    if(!room) continue;
    for(const nextId of room.neighbors){
      const next = byId[nextId];
      if(next && next.seq > room.seq && !visited.has(next.id)) stack.push(next.id);
    }
  }
  return false;
}

function assertMapHasForwardGoal(map){
  if(hasForwardPathToTeleport(map)) return map;
  // 保險：若隨機結果意外沒有單向路徑，重新生成。
  return generateDungeonMap(map?.floor || state.dungeonFloor || 1);
}

function drawDungeonSvg(map){
  const tile = 22;
  const width = map.cols * tile;
  const height = map.rows * tile;
  const roomById = Object.fromEntries(map.rooms.map(r=>[r.id,r]));
  const corridorParts = map.edges.map(edge=>{
    const a = roomCenter(roomById[edge.a]);
    const b = roomCenter(roomById[edge.b]);
    const x1 = a.x * tile, y1 = a.y * tile, x2 = b.x * tile, y2 = b.y * tile;
    return `<path d="M ${x1} ${y1} L ${x2} ${y1} L ${x2} ${y2}" class="dungeon-corridor" />`;
  }).join('');
  const current = state.currentRoomId;
  const accIds = new Set(accessibleRooms().map(r=>r.id));
  const roomParts = map.rooms.map(room=>{
    const meta = roomTypeMeta(room.type);
    const x = room.x * tile, y = room.y * tile, w = room.w * tile, h = room.h * tile;
    const classes = ['dungeon-room', `type-${meta.className}`];
    if(room.id === current) classes.push('current');
    if(room.cleared) classes.push('cleared');
    if(accIds.has(room.id) && room.id !== current) classes.push('reachable');
    const small = meta.name.replace('房','');
    const canGo = accIds.has(room.id) && room.id !== current;
    return `<g class="${classes.join(' ')}" ${canGo ? `onclick="enterDungeonRoom('${room.id}')" role="button" tabindex="0"` : ''}>
      <rect x="${x}" y="${y}" rx="8" ry="8" width="${w}" height="${h}"></rect>
      <text x="${x + w/2}" y="${y + h/2 - 4}" text-anchor="middle" class="dungeon-room-label">${meta.icon}</text>
      <text x="${x + w/2}" y="${y + h/2 + 14}" text-anchor="middle" class="dungeon-room-sub">${small}</text>
    </g>`;
  }).join('');
  const playerRoom = getRoomById(current);
  let marker='';
  if(playerRoom){
    const c = roomCenter(playerRoom);
    marker = `<g class="dungeon-player"><circle cx="${c.x * tile}" cy="${c.y * tile}" r="10"></circle><text x="${c.x * tile}" y="${c.y * tile + 4}" text-anchor="middle">🐾</text></g>`;
  }
  return `<svg viewBox="0 0 ${width} ${height}" class="dungeon-svg" aria-label="隨機關卡地圖">${corridorParts}${roomParts}${marker}</svg>`;
}

function renderMapPage(){
  const map = ensureDungeonMap(false);
  if($('mapSvgWrap')) $('mapSvgWrap').innerHTML = drawDungeonSvg(map);
  const room = currentDungeonRoom();
  const choices = accessibleRooms();
  if($('mapRoomChoices')){
    $('mapRoomChoices').innerHTML = choices.map(r=>{
      const meta = roomTypeMeta(r.type);
      return `<button class="map-room-choice ${meta.className}" onclick="enterDungeonRoom('${r.id}')">
        <div class="node-title">${meta.icon} ${meta.name}</div>
        <div class="muted small">${esc(meta.desc)}</div>
        <div class="node-reward">${esc(meta.reward)}</div>
      </button>`;
    }).join('') || '<div class="muted">目前沒有可前往的房間。</div>';
  }
  if($('mapCurrentRoom')) $('mapCurrentRoom').textContent = room ? `${roomTypeMeta(room.type).icon} ${roomTypeMeta(room.type).name}` : '-';
  if($('mapFloor')) $('mapFloor').textContent = `${map.floor}`;
  if($('mapRoomCount')) $('mapRoomCount').textContent = `${map.rooms.length}`;
  if($('mapSubject')) $('mapSubject').textContent = state.subject || '-';
  if($('mapTotal')) $('mapTotal').textContent = state.total;
  if($('mapHp')) $('mapHp').textContent = `${state.hp}/100`;
  if($('mapFish')) $('mapFish').textContent = state.cat.fish;
  if($('mapFragments')) $('mapFragments').textContent = `${state.fragments || 0}/10`;
  if($('mapNote')) $('mapNote').textContent = state.lastMapNote || '選擇相鄰房間後前進。';
}

function showMapPage(forceNew=false){
  if(state.daily3Mode || state.gameMode === "daily3"){
    showPage("battlePage");
    if($("hubHint")) $("hubHint").textContent = "今日 3 題是短挑戰，不使用冒險地圖。";
    return;
  }
  if(state.hiddenBossMode || state.gameMode === "hidden" || state.subject === "Newton Gate"){
    cleanupHiddenBossNavigation(true);
    showSubjects();
    if($("hubHint")) $("hubHint").textContent = "隱藏 Boss 不使用冒險地圖。請重新選擇一般科目。";
    saveGameState();
    return;
  }
  if(!state.subject) return showSubjects();
  switchToBattleMusic();
  state.mapPending = true;
  ensureDungeonMap(forceNew);
  renderMapPage();
  showPage('mapPage');
}

function clearRoomAndReturn(room, note=''){
  if(!room) return;
  room.cleared = true;
  room.visited = true;
  state.currentRoomId = room.id;
  state.pendingRoomId = null;
  state.currentQuestion = null;
  state.answered = false;
  if(note) state.lastMapNote = note;
  renderMapPage();
  showPage('mapPage');
  updateSidebar();
}

function enterDungeonRoom(roomId){
  const room = getRoomById(roomId);
  if(!room) return;
  const reachableIds = new Set(accessibleRooms().map(r=>r.id));
  if(room.id !== state.currentRoomId && !reachableIds.has(room.id)){
    state.lastMapNote = "這張地圖是單向推進，不能回到已經走過的房間。請選擇前方相鄰房間。";
    renderMapPage();
    return;
  }
  const meta = roomTypeMeta(room.type);
  state.lastMapNote = `已前往 ${meta.name}。`;
  state.mapPending = false;

  if(room.type === 'teleport'){
    state.currentRoomId = room.id;
    room.cleared = true;
    room.visited = true;
    state.dungeonFloor = (state.dungeonFloor || 1) + 1;
    state.dungeonMap = assertMapHasForwardGoal(generateDungeonMap(state.dungeonFloor));
    state.currentRoomId = state.dungeonMap.spawnId;
    state.pendingRoomId = null;
    state.lastMapNote = `已通過第 ${state.dungeonFloor - 1} 張地圖，前往第 ${state.dungeonFloor} 張。`;
    state.battleLog.unshift(`🌀 抵達傳送房，已前往第 ${state.dungeonFloor} 張地圖。`);
    renderMapPage();
    showPage('mapPage');
    updateSidebar();
    return;
  }

  if(room.type === 'rest'){
    const heal = randomInt(10, 18);
    state.hp = Math.min(100, state.hp + heal);
    state.battleLog.unshift(`💖 補給房：HP 回復 ${heal}。`);
    return clearRoomAndReturn(room, `補給完成，HP 回復 ${heal}。`);
  }

  if(room.type === 'treasure'){
    const fish = randomInt(3, 8);
    const frag = randomInt(1, 2);
    state.cat.fish += fish;
    gainFragments(frag);
    state.battleLog.unshift(`🎁 獎勵房：小魚乾 +${fish}，碎片 +${frag}。`);
    return clearRoomAndReturn(room, `已取得獎勵：小魚乾 +${fish}、碎片 +${frag}。`);
  }

  state.pendingRoomId = room.id;
  state.currentRoomId = room.id;
  state.currentQuestion = null;
  state.answered = false;
  if(room.type === 'hard'){
    state.nextQuestionMode = 'hard';
    state.hardNodeBonus = true;
  }
  nextAdaptiveQuestion();
  $('feedbackArea').innerHTML='';
  renderBattle();
  showPage('battlePage');
}

function continueFromMap(){
  const choices = accessibleRooms();
  const nextRoom = choices.find(r=>r.type!=='teleport') || choices[0];
  if(nextRoom) return enterDungeonRoom(nextRoom.id);
}

function chooseMapNode(i){
  const node = (state.mapNodes || [])[i];
  if(!node) return;
}

function shouldOfferMap(){
  return false;
}

function maybeTriggerEvent(){
  if(state.gameMode !== "endless" || state.bossMode || state.eventPending || state.hp<=0) return false;
  state.eventCounter = (state.eventCounter || 0) + 1;
  if(state.eventCounter >= 6){
    state.eventCounter = 0;
    showRandomEvent();
    return true;
  }
  return false;
}
function showRandomEvent(){
  state.eventPending=true;
  const ev = RANDOM_EVENTS[Math.floor(Math.random()*RANDOM_EVENTS.length)];
  state.currentEvent = ev;
  if($("eventTitle")) $("eventTitle").textContent = ev.title;
  if($("eventDesc")) $("eventDesc").textContent = ev.desc;
  if($("eventChoices")){
    $("eventChoices").innerHTML = ev.choices.map((c,i)=>`<button class="event-choice-card" onclick="chooseEvent(${i})"><div class="achievement-title">${esc(c.text)}</div><div class="muted small">${esc(c.effect)}</div></button>`).join("");
  }
  showPage("eventPage");
}
function chooseEvent(i){
  const ev = state.currentEvent;
  if(ev && ev.choices[i]) ev.choices[i].run();
  state.eventPending=false;
  state.currentEvent = null;
  pushLootLog(`🌙 事件完成：${ev?.title || "神秘事件"}。`);
  updateSidebar();
  showPage("battlePage");
  goNext();
}
function startCounterQuestion(){
  if(state.hiddenBossMode || state.gameMode === "hidden") return;
  if(!state.lastWrongRecord) return;
  state.counterMode=true;
  state.currentQuestion = offlineSimilarQuestion(state.lastWrongRecord);
  state.currentQuestion.topic = "錯題反擊｜" + (state.currentQuestion.topic || "");
  state.answered=false;
  $("feedbackArea").innerHTML="";
  renderBattle();
  showPage("battlePage");
}


function expToNext(){ return 50 + (state.level - 1) * 10; }
function modeLabel(m){ return m === "daily3" ? "今日 3 題" : (m === "hidden" ? "隱藏 Boss" : (m === "wrongbook" ? "錯題本模式" : (m === "endless" ? "無盡模式" : "10題章節模式"))); }
function skinName(id){ return SKIN_META[id]?.name || id; }
function rarityClass(r){ return String(r || "COMMON").toLowerCase(); }
function currentSkin(){ return SKIN_META[state.cat.equippedSkin] || SKIN_META.orange_tabby; }
function currentEffectText(){ return currentSkin().effectText || "無特殊效果"; }
function computeExpBonus(base, q, isBoss){
  const skin = currentSkin();
  const eff = skin.effect || {};
  let bonus = 0;
  if(eff.type === "generalExp") bonus += eff.value;
  if(eff.type === "allExpAndChest") bonus += eff.value;
  if(eff.type === "subjectExp" && eff.subject === state.subject) bonus += eff.value;
  bonus += titleBonus("subjectExp", state.subject);
  if(eff.type === "bossExp" && isBoss) bonus += eff.value;
  if(eff.type === "hardExp" && q && q.difficulty === "hard") bonus += eff.value;
  return { exp: Math.max(1, Math.round(base * (1 + bonus))), bonus };
}
function questValue(key){ return state.questStats?.[key] || 0; }
function bumpQuest(key, amount = 1){
  if(!state.questStats) state.questStats = {};
  state.questStats[key] = (state.questStats[key] || 0) + amount;
}
function pushLootLog(text){
  state.inventoryLog.unshift(text);
  state.inventoryLog = state.inventoryLog.slice(0, 10);
}

function ensureDailyMail(){
  state.dailyMail = Object.assign({ lastClaimDate:"", streak:0, lastRewardText:"", lastMessage:"" }, state.dailyMail || {});
  return state.dailyMail;
}

function dailyMailTodayKey(){
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function dailyMailYesterdayKey(){
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function dailyMailRewardPreview(nextStreak){
  if(nextStreak > 0 && nextStreak % 7 === 0) return "7 日獎勵：寶箱 +1、刪錯卡 +1、小魚乾 +3";
  if(nextStreak > 0 && nextStreak % 3 === 0) return "3 日獎勵：碎片 +2、小魚乾 +4";
  return "今日獎勵：小魚乾 +3、碎片 +1";
}

function dailyMailApplyReward(streak){
  let text = "";
  if(streak > 0 && streak % 7 === 0){
    state.chests += 1;
    ensureItems();
    state.items.removeWrong = (state.items.removeWrong || 0) + 1;
    state.cat.fish += 3;
    text = "寶箱 +1、刪錯卡 +1、小魚乾 +3";
  }else if(streak > 0 && streak % 3 === 0){
    gainFragments(2);
    state.cat.fish += 4;
    text = "碎片 +2、小魚乾 +4";
  }else{
    gainFragments(1);
    state.cat.fish += 3;
    text = "小魚乾 +3、碎片 +1";
  }
  return text;
}

function buildDailyMailMessage(){
  const mail = ensureDailyMail();
  const today = dailyMailTodayKey();
  const claimed = mail.lastClaimDate === today;
  const nextStreak = claimed ? (mail.streak || 0) : ((mail.lastClaimDate === dailyMailYesterdayKey()) ? (mail.streak || 0) + 1 : 1);
  const catName = state.cat?.name || "Pixel";

  if(claimed){
    return `${catName} 今天的郵件已經領過了。可以不用硬衝，完成「今日 3 題」就算有維持手感。`;
  }
  if(nextStreak >= 7 && nextStreak % 7 === 0){
    return `${catName} 寄來一封閃亮郵件：你快湊到 7 日節奏了。今天只要回來一下，也值得被獎勵。`;
  }
  if(nextStreak >= 3 && nextStreak % 3 === 0){
    return `${catName} 在信上畫了三個魚乾：連續回來的感覺正在形成。今天不用多，先打 3 題就好。`;
  }
  return `${catName} 今天也在等你。讀書很累的話，不用開長關卡，先用「今日 3 題」讓腦袋暖機。`;
}

function renderDailyMailCard(){
  const mail = ensureDailyMail();
  const today = dailyMailTodayKey();
  const claimed = mail.lastClaimDate === today;
  const nextStreak = claimed ? (mail.streak || 0) : ((mail.lastClaimDate === dailyMailYesterdayKey()) ? (mail.streak || 0) + 1 : 1);

  if($("dailyMailDate")) $("dailyMailDate").textContent = `今日日期：${today}`;
  if($("dailyMailStreak")) $("dailyMailStreak").textContent = `連續 ${mail.streak || 0} 天`;
  if($("dailyMailMessage")) $("dailyMailMessage").textContent = buildDailyMailMessage();
  if($("dailyMailReward")) $("dailyMailReward").textContent = claimed ? `已領取：${mail.lastRewardText || "今日郵件獎勵"}` : dailyMailRewardPreview(nextStreak);
  if($("dailyMailClaimBtn")){
    $("dailyMailClaimBtn").disabled = claimed;
    $("dailyMailClaimBtn").textContent = claimed ? "今日已領取" : "領取今日郵件";
  }
}

function claimDailyMail(){
  const mail = ensureDailyMail();
  const today = dailyMailTodayKey();
  if(mail.lastClaimDate === today){
    renderDailyMailCard();
    return;
  }
  const streak = mail.lastClaimDate === dailyMailYesterdayKey() ? (mail.streak || 0) + 1 : 1;
  const rewardText = dailyMailApplyReward(streak);
  mail.lastClaimDate = today;
  mail.streak = streak;
  mail.lastRewardText = rewardText;
  mail.lastMessage = buildDailyMailMessage();
  pushLootLog(`📮 今日貓貓郵件：${rewardText}。連續 ${streak} 天。`);
  setCatMessage("小喵", `今日郵件已領取：${rewardText}。`);
  saveGameState();
  renderDailyMailCard();
  updateSidebar();
}

