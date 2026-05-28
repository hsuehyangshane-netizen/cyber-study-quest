window.CSQ_ATTACH_EXTERNAL_BANK_ADAPTERS = function(ctx){
  const q = ctx.q;
  const pick = ctx.pick;

// v71: external JSON-array English bank adapter.
  // Expected format:
  // [{ id, type, passage, question, options:{A,B,C,D} or ["A. ..."], answer:"A", explanation, difficulty, stage, hint }]
  function normalizeEnglishJsonBank(bank){
    const letters = ["A","B","C","D"];
    const stripLetter = (text, letter) => String(text ?? "")
      .replace(new RegExp("^\\s*" + letter + "[\\.．、\\)]\\s*"), "")
      .trim();
    const inferStage = (item, idx) => {
      if(item.stage) return item.stage;
      const type = String(item.type || "");
      if(idx < 30 || /單字|時態|文法/.test(type)) return "intro";
      if(idx < 65 || /克漏字|細節|其他|猜字/.test(type)) return "middle";
      return "advanced";
    };
    const inferDifficulty = (item) => {
      const raw = String(item.difficulty || item.level || "").trim();
      if(raw.includes("精熟") || raw.toLowerCase() === "hard") return "精熟";
      return "基礎";
    };
    return (Array.isArray(bank) ? bank : []).map((item, idx) => {
      const rawOptions = item.options || {};
      let optObj = {};
      if(Array.isArray(rawOptions)){
        letters.forEach((letter, i) => optObj[letter] = stripLetter(rawOptions[i] || "", letter));
      }else{
        letters.forEach(letter => optObj[letter] = String(rawOptions[letter] ?? "").trim());
      }
      const answerLetter = String(item.answer || "A").trim().toUpperCase().slice(0,1);
      return {
        id: item.id || `EN-${String(idx+1).padStart(3,"0")}`,
        stage: inferStage(item, idx),
        type: item.type || "英文素養",
        difficulty: inferDifficulty(item),
        passage: item.passage || item.context || "",
        question: item.question || "",
        options: optObj,
        answer: letters.includes(answerLetter) ? answerLetter : "A",
        explanation: item.explanation || item.rationale || "",
        hint: item.hint || "Read the sentence or passage first, then check which option best fits the meaning."
      };
    }).filter(item => item.question && item.options && item.options[item.answer]);
  }

  const V71_ENGLISH_ITEMS = normalizeEnglishJsonBank(window.MY_ENGLISH_BANK || []);

  function v71EnglishDifficulty(item){
    return item.difficulty === "精熟" ? "hard" : "easy";
  }

  function v71EnglishQuestionText(item){
    const context = item.passage ? item.passage : `${item.type}｜CAP English`;
    return `【情境】${context}

【資料／題目】
${item.question}

【命題方向】${item.difficulty}｜${item.type}｜CAP English Reading`;
  }

  function v71EnglishToQuestion(item){
    const letters = ["A","B","C","D"];
    const answerText = item.options[item.answer];
    const wrongs = letters.filter(k => k !== item.answer).map(k => item.options[k]);
    const qq = q("英文", v71EnglishDifficulty(item), item.type, v71EnglishQuestionText(item), answerText, wrongs, `${item.explanation}

提示：${item.hint}`);
    qq.id = item.id;
    qq.capId = item.id;
    qq.capType = item.type;
    qq.progressStage = item.stage;
    return qq;
  }

  function v71EnglishAppSig(item){
    return `英文|${String(item.type).replace(/\s+/g,'')}|${String(v71EnglishQuestionText(item)).replace(/[Ａ-Ｚａ-ｚ０-９]/g, ch => String.fromCharCode(ch.charCodeAt(0)-0xFEE0)).replace(/\s+/g,'').replace(/[，。！？、；：「」『』（）()【】\[\]《》〈〉,.!?;:'"“”‘’]/g,'').replace(/[ABCDＡＢＣＤ][\.．、)]/g,'').trim()}`;
  }

  function v71EnglishPool(roundCount=0, bossMode=false, difficulty="easy"){
    if(!V71_ENGLISH_ITEMS.length) return [];
    if(bossMode || roundCount >= 8) return V71_ENGLISH_ITEMS.filter(x => x.stage === "advanced");
    if(roundCount >= 4) return V71_ENGLISH_ITEMS.filter(x => x.stage === "middle");
    return V71_ENGLISH_ITEMS.filter(x => x.stage === "intro");
  }

  window.CSQ_GENERATE_ENGLISH_QUESTION = function(roundCount=0, bossMode=false, stageSigs=null, difficulty="easy"){
    let pool = v71EnglishPool(roundCount, bossMode, difficulty);
    if(!pool.length) pool = V71_ENGLISH_ITEMS;
    if(!pool.length) return null;

    const seenIds = new Set();
    const seenSigs = new Set();
    if(stageSigs && stageSigs.forEach){
      stageSigs.forEach(sig => {
        const s = String(sig);
        seenSigs.add(s);
        const m = s.match(/EN-\d{3}/);
        if(m) seenIds.add(m[0]);
      });
    }

    let candidates = pool.filter(item => !seenIds.has(item.id) && !seenSigs.has(v71EnglishAppSig(item)));
    if(!candidates.length){
      candidates = V71_ENGLISH_ITEMS.filter(item => !seenIds.has(item.id) && !seenSigs.has(v71EnglishAppSig(item)));
    }
    if(!candidates.length) candidates = pool;

    return v71EnglishToQuestion(pick(candidates));
  };



  // v72: external JSON-array Math bank adapter.
  // Expected format:
  // [{ Category_ID, Topic_Name, Question, Options:{A,B,C,D}, Correct_Answer, Solution_Steps, Image_Requirement }]
  function normalizeMathJsonBank(bank){
    const letters = ["A","B","C","D"];
    const inferStage = (item, idx) => {
      if(item.stage) return item.stage;
      const id = String(item.Category_ID || item.id || "");
      if(/^A1/.test(id) || idx < 25) return "intro";
      if(idx < 65) return "middle";
      return "advanced";
    };
    const inferDifficulty = (item, idx) => {
      const raw = String(item.difficulty || item.Difficulty || "").trim();
      if(raw.includes("精熟") || raw.toLowerCase() === "hard") return "精熟";
      return "基礎";
    };
    return (Array.isArray(bank) ? bank : []).map((item, idx) => {
      const rawOptions = item.Options || item.options || {};
      const optObj = {};
      letters.forEach(letter => optObj[letter] = String(rawOptions[letter] ?? "").trim());
      const ans = String(item.Correct_Answer || item.answer || "A").trim().toUpperCase().slice(0,1);
      const image = item.Image_Requirement || {};
      const steps = Array.isArray(item.Solution_Steps) ? item.Solution_Steps : [];
      return {
        id: item.Category_ID || item.id || `MATH-${String(idx+1).padStart(3,"0")}`,
        stage: inferStage(item, idx),
        type: item.Topic_Name || item.topic || "數學",
        difficulty: inferDifficulty(item, idx),
        question: item.Question || item.question || "",
        options: optObj,
        answer: letters.includes(ans) ? ans : "A",
        steps,
        explanation: steps.join("\n"),
        imageRequirement: image
      };
    }).filter(item => item.question && item.options && item.options[item.answer]);
  }

  const V72_MATH_ITEMS = normalizeMathJsonBank(window.MY_MATH_BANK || []);

  function v72MathDifficulty(item){
    return item.difficulty === "精熟" ? "hard" : "easy";
  }

  function v72MathQuestionText(item){
    const imageNote = item.imageRequirement && item.imageRequirement.Need_Image ? "\n\n【請參閱附圖】" : "";
    return `【情境】${item.type}

【資料／題目】
${item.question}${imageNote}

【命題方向】${item.difficulty}｜${item.id}｜108課綱數學素養`;
  }

  function v72MathToQuestion(item){
    const letters = ["A","B","C","D"];
    const answerText = item.options[item.answer];
    const wrongs = letters.filter(k => k !== item.answer).map(k => item.options[k]);
    const imageExtra = item.imageRequirement && item.imageRequirement.Need_Image
      ? `

圖形需求：${item.imageRequirement.Past_Exam_Reference || "需繪圖"}
AI Draw Prompt：${item.imageRequirement.AI_Draw_Prompt || ""}`
      : "";
    const qq = q("數學", v72MathDifficulty(item), item.type, v72MathQuestionText(item), answerText, wrongs, `${item.explanation}${imageExtra}

提示：先判斷題目屬於哪一種數量關係，再依序列式計算。`);
    qq.id = item.id;
    qq.capId = item.id;
    qq.capType = item.type;
    qq.progressStage = item.stage;
    qq.imageRequirement = item.imageRequirement;
    return qq;
  }

  function v72MathAppSig(item){
    return `數學|${String(item.type).replace(/\s+/g,'')}|${String(v72MathQuestionText(item)).replace(/\s+/g,'').replace(/[，。！？、；：「」『』（）()【】\[\]《》〈〉,.!?;:'"“”‘’]/g,'').replace(/[ABCDＡＢＣＤ][\.．、)]/g,'').trim()}`;
  }

  function v72MathPool(roundCount=0, bossMode=false, difficulty="easy"){
    if(!V72_MATH_ITEMS.length) return [];
    if(bossMode || roundCount >= 8) return V72_MATH_ITEMS.filter(x => x.stage === "advanced");
    if(roundCount >= 4) return V72_MATH_ITEMS.filter(x => x.stage === "middle");
    return V72_MATH_ITEMS.filter(x => x.stage === "intro");
  }

  window.CSQ_GENERATE_MATH_QUESTION = function(roundCount=0, bossMode=false, stageSigs=null, difficulty="easy"){
    let pool = v72MathPool(roundCount, bossMode, difficulty);
    if(!pool.length) pool = V72_MATH_ITEMS;
    if(!pool.length) return null;

    const seenIds = new Set();
    const seenSigs = new Set();
    if(stageSigs && stageSigs.forEach){
      stageSigs.forEach(sig => {
        const s = String(sig);
        seenSigs.add(s);
        const m = s.match(/(?:A\d+-\d+|MATH-\d{3})/);
        if(m) seenIds.add(m[0]);
      });
    }

    let candidates = pool.filter(item => !seenIds.has(item.id) && !seenSigs.has(v72MathAppSig(item)));
    if(!candidates.length){
      candidates = V72_MATH_ITEMS.filter(item => !seenIds.has(item.id) && !seenSigs.has(v72MathAppSig(item)));
    }
    if(!candidates.length) candidates = pool;
    return v72MathToQuestion(pick(candidates));
  };



  // v78: external JSON-array Science bank adapter.
  // Expected format:
  // [{ id, Subject_Area, Topic_Name, Question_Type, Difficulty, stage, Group_ID, Passage, Question, Options:{A,B,C,D}, Correct_Answer, Solution_Steps, Hint, Image_Requirement }]
  function normalizeScienceJsonBank(bank){
    const letters = ["A","B","C","D"];
    const inferStage = (item, idx) => {
      if(item.stage) return item.stage;
      if(idx < 20) return "intro";
      if(idx < 70) return "middle";
      return "advanced";
    };
    const inferDifficulty = (item) => {
      const raw = String(item.Difficulty || item.difficulty || "").trim();
      if(raw.includes("精熟") || raw.toLowerCase() === "hard") return "精熟";
      return "基礎";
    };
    return (Array.isArray(bank) ? bank : []).map((item, idx) => {
      const rawOptions = item.Options || item.options || {};
      const optObj = {};
      letters.forEach(letter => optObj[letter] = String(rawOptions[letter] ?? "").trim());
      const ans = String(item.Correct_Answer || item.answer || "A").trim().toUpperCase().slice(0,1);
      const image = item.Image_Requirement || {};
      const steps = Array.isArray(item.Solution_Steps) ? item.Solution_Steps : (item.explanation ? [item.explanation] : []);
      return {
        id: item.id || item.Category_ID || `SCI-${String(idx+1).padStart(3,"0")}`,
        subjectArea: item.Subject_Area || item.area || "自然",
        stage: inferStage(item, idx),
        type: item.Topic_Name || item.topic || "自然科素養",
        questionType: item.Question_Type || item.type || "素養題",
        difficulty: inferDifficulty(item),
        groupId: item.Group_ID || null,
        passage: item.Passage || item.passage || "",
        question: item.Question || item.question || "",
        options: optObj,
        answer: letters.includes(ans) ? ans : "A",
        steps,
        explanation: steps.join("\n"),
        hint: item.Hint || item.hint || "先判斷題目給的是觀察、實驗、圖表還是生活情境，再找出最直接支持的證據。",
        imageRequirement: image
      };
    }).filter(item => item.question && item.options && item.options[item.answer]);
  }

  const V78_SCIENCE_ITEMS = normalizeScienceJsonBank(window.MY_SCIENCE_BANK || []);

  function v78ScienceDifficulty(item){
    return item.difficulty === "精熟" ? "hard" : "easy";
  }

  function v78ScienceQuestionText(item){
    const passage = item.passage ? `【題組資料】\n${item.passage}\n\n` : "";
    const imageNote = item.imageRequirement && item.imageRequirement.Need_Image ? "\n\n【請參閱附圖】" : "";
    return `【情境】${item.subjectArea}｜${item.type}

${passage}【資料／題目】
${item.question}${imageNote}

【命題方向】${item.difficulty}｜${item.id}｜${item.questionType}｜108課綱自然科素養`;
  }

  function v78ScienceToQuestion(item){
    const letters = ["A","B","C","D"];
    const answerText = item.options[item.answer];
    const wrongs = letters.filter(k => k !== item.answer).map(k => item.options[k]);
    const imageExtra = item.imageRequirement && item.imageRequirement.Need_Image
      ? `

圖表需求：${item.imageRequirement.Past_Exam_Reference || "需圖表"}
AI Draw Prompt：${item.imageRequirement.AI_Draw_Prompt || ""}`
      : "";
    const qq = q("自然", v78ScienceDifficulty(item), `${item.subjectArea}｜${item.type}`, v78ScienceQuestionText(item), answerText, wrongs, `${item.explanation}${imageExtra}

提示：${item.hint}`);
    qq.id = item.id;
    qq.capId = item.id;
    qq.capType = item.questionType;
    qq.progressStage = item.stage;
    qq.groupId = item.groupId;
    qq.imageRequirement = item.imageRequirement;
    return qq;
  }

  function v78ScienceAppSig(item){
    return `自然|${String(item.subjectArea + item.type).replace(/\s+/g,'')}|${String(v78ScienceQuestionText(item)).replace(/[Ａ-Ｚａ-ｚ０-９]/g, ch => String.fromCharCode(ch.charCodeAt(0)-0xFEE0)).replace(/\s+/g,'').replace(/[，。！？、；：「」『』（）()【】\[\]《》〈〉,.!?;:'"“”‘’]/g,'').replace(/[ABCDＡＢＣＤ][\.．、)]/g,'').trim()}`;
  }

  function v78SciencePool(roundCount=0, bossMode=false, difficulty="easy"){
    if(!V78_SCIENCE_ITEMS.length) return [];
    if(bossMode || roundCount >= 8) return V78_SCIENCE_ITEMS.filter(x => x.stage === "advanced");
    if(roundCount >= 4) return V78_SCIENCE_ITEMS.filter(x => x.stage === "middle");
    return V78_SCIENCE_ITEMS.filter(x => x.stage === "intro");
  }

  window.CSQ_GENERATE_SCIENCE_QUESTION = function(roundCount=0, bossMode=false, stageSigs=null, difficulty="easy"){
    let pool = v78SciencePool(roundCount, bossMode, difficulty);
    if(!pool.length) pool = V78_SCIENCE_ITEMS;
    if(!pool.length) return null;

    const seenIds = new Set();
    const seenSigs = new Set();
    if(stageSigs && stageSigs.forEach){
      stageSigs.forEach(sig => {
        const s = String(sig);
        seenSigs.add(s);
        const m = s.match(/(?:BIO|PHY|EAR)-\d{3}/);
        if(m) seenIds.add(m[0]);
      });
    }

    let candidates = pool.filter(item => !seenIds.has(item.id) && !seenSigs.has(v78ScienceAppSig(item)));
    if(!candidates.length){
      candidates = V78_SCIENCE_ITEMS.filter(item => !seenIds.has(item.id) && !seenSigs.has(v78ScienceAppSig(item)));
    }
    if(!candidates.length) candidates = pool;
    return v78ScienceToQuestion(pick(candidates));
  };



  // v79: external JSON-array Social Studies bank adapter.
  function normalizeSocialJsonBank(bank){
    const letters = ["A","B","C","D"];
    const inferStage = (item, idx) => {
      if(item.stage) return item.stage;
      if(idx < 20) return "intro";
      if(idx < 75) return "middle";
      return "advanced";
    };
    const inferDifficulty = (item) => {
      const raw = String(item.Difficulty || item.difficulty || "").trim();
      if(raw.includes("精熟") || raw.toLowerCase() === "hard") return "精熟";
      return "基礎";
    };
    return (Array.isArray(bank) ? bank : []).map((item, idx) => {
      const rawOptions = item.Options || item.options || {};
      const optObj = {};
      letters.forEach(letter => optObj[letter] = String(rawOptions[letter] ?? "").trim());
      const ans = String(item.Correct_Answer || item.answer || "A").trim().toUpperCase().slice(0,1);
      const image = item.Image_Requirement || {};
      const steps = Array.isArray(item.Solution_Steps) ? item.Solution_Steps : (item.explanation ? [item.explanation] : []);
      return {
        id: item.id || `SOC-${String(idx+1).padStart(3,"0")}`,
        subjectArea: item.Subject_Area || "社會",
        stage: inferStage(item, idx),
        type: item.Topic_Name || "社會科素養",
        questionType: item.Question_Type || "素養判讀",
        difficulty: inferDifficulty(item),
        groupId: item.Group_ID || null,
        passage: item.Passage || "",
        question: item.Question || "",
        options: optObj,
        answer: letters.includes(ans) ? ans : "A",
        steps,
        explanation: steps.join("\n"),
        hint: item.Hint || "先判斷題目屬於地理、歷史或公民，再找出情境中的關鍵證據。",
        imageRequirement: image
      };
    }).filter(item => item.question && item.options && item.options[item.answer]);
  }

  const V79_SOCIAL_ITEMS = normalizeSocialJsonBank(window.MY_SOCIAL_BANK || []);

  function v79SocialDifficulty(item){
    return item.difficulty === "精熟" ? "hard" : "easy";
  }

  function v79SocialQuestionText(item){
    const passage = item.passage ? `【題組資料】\n${item.passage}\n\n` : "";
    const imageNote = item.imageRequirement && item.imageRequirement.Need_Image ? "\n\n【請參閱附圖】" : "";
    return `【情境】${item.subjectArea}｜${item.type}

${passage}【資料／題目】
${item.question}${imageNote}

【命題方向】${item.difficulty}｜${item.id}｜${item.questionType}｜108課綱社會科素養`;
  }

  function v79SocialToQuestion(item){
    const letters = ["A","B","C","D"];
    const answerText = item.options[item.answer];
    const wrongs = letters.filter(k => k !== item.answer).map(k => item.options[k]);
    const imageExtra = item.imageRequirement && item.imageRequirement.Need_Image
      ? `

圖表需求：${item.imageRequirement.Past_Exam_Reference || "需圖表"}
AI Draw Prompt：${item.imageRequirement.AI_Draw_Prompt || ""}`
      : "";
    const qq = q("社會", v79SocialDifficulty(item), `${item.subjectArea}｜${item.type}`, v79SocialQuestionText(item), answerText, wrongs, `${item.explanation}${imageExtra}

提示：${item.hint}`);
    qq.id = item.id;
    qq.capId = item.id;
    qq.capType = item.questionType;
    qq.progressStage = item.stage;
    qq.groupId = item.groupId;
    qq.imageRequirement = item.imageRequirement;
    return qq;
  }

  function v79SocialAppSig(item){
    return `社會|${String(item.subjectArea + item.type).replace(/\s+/g,'')}|${String(v79SocialQuestionText(item)).replace(/[Ａ-Ｚａ-ｚ０-９]/g, ch => String.fromCharCode(ch.charCodeAt(0)-0xFEE0)).replace(/\s+/g,'').replace(/[，。！？、；：「」『』（）()【】\[\]《》〈〉,.!?;:'"“”‘’]/g,'').replace(/[ABCDＡＢＣＤ][\.．、)]/g,'').trim()}`;
  }

  function v79SocialPool(roundCount=0, bossMode=false, difficulty="easy"){
    if(!V79_SOCIAL_ITEMS.length) return [];
    if(bossMode || roundCount >= 8) return V79_SOCIAL_ITEMS.filter(x => x.stage === "advanced");
    if(roundCount >= 4) return V79_SOCIAL_ITEMS.filter(x => x.stage === "middle");
    return V79_SOCIAL_ITEMS.filter(x => x.stage === "intro");
  }

  window.CSQ_GENERATE_SOCIAL_QUESTION = function(roundCount=0, bossMode=false, stageSigs=null, difficulty="easy"){
    let pool = v79SocialPool(roundCount, bossMode, difficulty);
    if(!pool.length) pool = V79_SOCIAL_ITEMS;
    if(!pool.length) return null;

    const seenIds = new Set();
    const seenSigs = new Set();
    if(stageSigs && stageSigs.forEach){
      stageSigs.forEach(sig => {
        const s = String(sig);
        seenSigs.add(s);
        const m = s.match(/(?:GEO|HIS|CIV)-\d{3}/);
        if(m) seenIds.add(m[0]);
      });
    }

    let candidates = pool.filter(item => !seenIds.has(item.id) && !seenSigs.has(v79SocialAppSig(item)));
    if(!candidates.length){
      candidates = V79_SOCIAL_ITEMS.filter(item => !seenIds.has(item.id) && !seenSigs.has(v79SocialAppSig(item)));
    }
    if(!candidates.length) candidates = pool;
    return v79SocialToQuestion(pick(candidates));
  };
};

