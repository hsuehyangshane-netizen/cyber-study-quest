
// Cyber Study Quest v47 Graded Question Engine
// EASY = direct/basic, NORMAL = guided 1-2 step, HARD = deeper inference / multi-step.

(function(){
  const answerSeq = {
    "國文": "DDBBCDBCBACCCBCDABADCAADAAABBCCABDCBBDCB",
    "英文": "ACBBDDBDCDCAACCDCDAABCDAABBCDDAABCBBCCABD",
    "數學": "AACDBDDCACACBABBCCBBDABBB",
    "自然": "BBCCACCACADBDDDCBDBCCAACDDABCADDBBCBBBDCCADC",
    "社會": "BACABBCAACCCBCBADCDAACBACABDCADDBBCDDBADCBACADCB"
  };
  let seqIndex = 0;
  const recent = {};
  function rnd(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
  function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
  function gcd(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){ const t=a%b; a=b; b=t; } return a||1; }
  function frac(n,d){ const g=gcd(n,d); n/=g; d/=g; if(d<0){n=-n; d=-d;} return d===1?String(n):`${n}/${d}`; }
  function uniq(a){ const out=[]; const s=new Set(); for(const x of a.map(String)){ if(!s.has(x)){s.add(x); out.push(x);} } return out; }
  function order(subject, answer, wrongs){
    answer=String(answer); let ws=uniq(wrongs).filter(x=>x!==answer);
    const fillers=["只符合部分條件", "忽略題幹關鍵", "把線索過度放大"];
    for(const f of fillers){ if(ws.length<3 && f!==answer && !ws.includes(f)) ws.push(f); }
    ws=ws.slice(0,3);
    const seq=answerSeq[subject]||"ABCD"; const pos="ABCD".indexOf(seq[seqIndex++%seq.length]);
    const choices=[null,null,null,null]; choices[pos]=answer; let wi=0;
    for(let i=0;i<4;i++) if(choices[i]===null) choices[i]=ws[wi++];
    return choices;
  }
  function q(subject,difficulty,topic,question,answer,wrongs,explanation){
    return { id:`${subject}-${difficulty}-${topic}-${Date.now()}-${Math.floor(Math.random()*1000000)}`, subject, difficulty, topic, question:String(question).trim(), choices:order(subject,answer,wrongs), answer:String(answer), explanation:String(explanation).trim() };
  }
  function sig(qx){ return `${qx.subject}|${qx.topic}|${String(qx.question).replace(/\s+/g,'').replace(/[，。！？、；：「」『』（）()【】\[\]《》〈〉,.!?;:'"“”‘’]/g,'')}`; }
  function remember(k,s){ recent[k]=recent[k]||[]; recent[k].push(s); if(recent[k].length>240) recent[k].shift(); }

  function easyChinese(){
    const t=rnd(0,11);
    if(t===0){ const x=pick([["高興","開心"],["仔細","認真細心"],["匆忙","急急忙忙"],["安靜","沒有吵鬧聲"],["鼓勵","給人信心"]]); return q("國文","easy","字詞語意",`「${x[0]}」最接近下列哪一個意思？`,x[1],["完全相反的意思","表示地點","表示數量很多"],"簡單題只考常用詞的基本語意。"); }
    if(t===1) return q("國文","easy","句子主詞","「小明把書包放在桌上，然後走到操場。」句中主要動作的人是誰？","小明",["書包","桌上","操場"],"句子的動作由小明完成。");
    if(t===2) return q("國文","easy","標點判斷","「媽媽說：『晚餐好了。』」句中的冒號主要功能是什麼？","引出後面說的話",["表示結束全文","表示疑問","表示兩數相除"],"冒號常用來引出說話內容。");
    if(t===3) return q("國文","easy","連接詞","「外面下雨了，＿＿我帶了雨傘。」空格最適合填入何者？","所以",["但是","如果","雖然"],"下雨導致帶傘，前後是因果關係。");
    if(t===4){ const x=pick([["亡羊補牢","犯錯後及時補救"],["畫蛇添足","多做反而壞事"],["雪中送炭","在困難時幫助別人"],["守株待兔","不努力只想碰運氣"]]); return q("國文","easy","成語基礎",`哪一個意思最符合「${x[0]}」？`,x[1],["故意拖延時間","形容天氣很好","表示聲音很大"],"此題考常見成語的基本意思。") }
    if(t===5) return q("國文","easy","文意直接理解","短文：『弟弟忘了帶水壺，姐姐把自己的水分給他。』姐姐做了什麼？","把水分給弟弟",["拿走弟弟的水壺","把水倒掉","叫弟弟不要喝水"],"題幹直接說姐姐把自己的水分給弟弟。");
    if(t===6) return q("國文","easy","語氣辨識","「請你把窗戶關上，好嗎？」這句話的語氣最接近何者？","請求",["命令處罰","自我介紹","描述風景"],"句末的『好嗎』表示請求。");
    if(t===7) return q("國文","easy","修辭入門","「月亮像一顆白色的球。」這句主要使用哪種修辭？","譬喻",["排比","設問","引用"],"把月亮比作白色的球，是譬喻。");
    if(t===8) return q("國文","easy","順序判斷","「先洗手，再吃飯。」這句話表示哪件事先做？","洗手",["吃飯","睡覺","寫作業"],"『先』表示第一個動作。");
    if(t===9) return q("國文","easy","人物行動","短文：『老師把錯題寫在黑板上，請大家一起訂正。』老師請大家做什麼？","訂正錯題",["擦黑板","放學回家","畫圖比賽"],"題幹直接說請大家一起訂正。");
    if(t===10) return q("國文","easy","形容詞","「這杯熱茶很燙。」句中用來形容茶的詞是？","燙",["這杯","熱茶","很"],"『燙』描述茶的溫度。");
    return q("國文","easy","簡單因果","「因為昨天熬夜，所以他今天上課一直打哈欠。」他打哈欠的主要原因是？","昨天熬夜",["今天下雨","老師請假","忘記帶筆"],"句中用『因為』指出原因。");
  }
  function normalChinese(){
    const t=rnd(0,7);
    if(t===0){ const x=pick([["他每天練習十分鐘，三個月後終於能完整彈完一首曲子。","持續練習能累積成果"],["同學吵架後願意道歉，關係才慢慢恢復。","道歉與溝通有助於修復關係"],["社區把空地改成菜園，居民也開始互相分享收成。","公共空間能促進社區互動"]]); return q("國文","normal","短文主旨",`短文：「${x[0]}」最適合的主旨是？`,x[1],["所有事情都能立刻成功","人際關係完全不需溝通","公共空間只會造成麻煩"],"普通題需要整合一句以上的訊息。") }
    if(t===1) return q("國文","normal","轉折理解","「他成績很好，卻不願意幫助同學。」句中『卻』表示什麼關係？","前後語意有轉折",["前後完全相同","後句是前句原因","後句補充地點"],"『卻』表示與預期不同。");
    if(t===2) return q("國文","normal","選項辨析","某文說『速度帶來便利，也可能讓人忽略感受』。下列哪個理解最恰當？","作者提醒效率也可能有代價",["作者完全反對速度","作者只在介紹交通工具","作者認為感受不重要"],"普通題要避免只抓單一詞語。");
    if(t===3) return q("國文","normal","推論心理","「他把道歉訊息打好又刪掉，重複了三次。」最可能顯示他？","想道歉但仍感到猶豫",["完全不在意對方","已經睡著了","正在練習打字速度"],"動作反覆顯示心理猶豫。");
    if(t===4) return q("國文","normal","雙句關係","甲句說『書本提供知識』，乙句說『討論讓知識變成自己的想法』。兩句合起來強調什麼？","閱讀與討論可以互相補充",["只要背書就夠了","討論會讓知識消失","書本完全沒有用"],"需統整兩句共同觀點。");
    if(t===5) return q("國文","normal","語境詞義","「那句話在他心裡發酵了幾天。」此處『發酵』最接近何意？","想法逐漸產生變化",["食物真的變酸","聲音變大","天氣變熱"],"語境中是比喻心理變化。");
    if(t===6) return q("國文","normal","論點證據","若要支持『運動能改善心情』，下列哪項最適合作為證據？","調查顯示規律運動者壓力感較低",["某運動場很大","運動鞋有很多顏色","有人不喜歡下雨"],"證據需直接支持論點。");
    return q("國文","normal","文言基本","「學而不思則罔」大意最接近何者？","只學不思考容易迷惑",["只要思考就不用學","學習一定會失敗","思考會讓人忘記知識"],"普通文言題考基本句意。");
  }
  function hardChinese(){
    const t=rnd(0,5);
    if(t===0) return q("國文","hard","雙文本統整","甲文說科技使溝通更快，乙文說快速回覆也讓人缺少深思。綜合兩文，最恰當的觀點是？","科技提升效率，但使用時仍需保留思考空間",["科技只會造成負面影響","快速回覆一定代表深思熟慮","兩文都完全否定溝通"],"困難題需要整合兩個文本的互補觀點。");
    if(t===1) return q("國文","hard","反諷辨析","某人說自己最守時，卻每次都讓大家等半小時。作者這樣寫主要形成什麼效果？","以言行矛盾形成反諷",["證明他真的很守時","單純交代時間表","表示大家都提早到"],"困難題重點在辨識隱含態度。");
    if(t===2) return q("國文","hard","論證謬誤","某人說：『我朋友看完這本書考高分，所以所有人只要看這本書都會考高分。』此推論問題是？","以單一例子過度推論整體",["完全沒有提出例子","結論比前提更小","只是在說明書的厚度"],"從個案推全體是過度推論。");
    if(t===3) return q("國文","hard","敘事視角","故事由主角第一人稱敘述，但其他人物反應常與主角說法矛盾。閱讀時最應注意？","主角敘述可能有限或帶有偏見",["第一人稱一定完全正確","其他人物都不存在","故事不能有矛盾"],"困難題需判斷敘事可靠性。");
    if(t===4) return q("國文","hard","象徵判讀","文章結尾寫『窗外雨停了，屋裡的燈還亮著』，若前文寫人物仍煩惱，燈最可能象徵？","心事仍未平息",["電費一定很貴","天氣永遠不會變","房間裡沒有人"],"具體物象承載抽象心理。");
    return q("國文","hard","文言推論","「木欲高，必固其根；根不固，風至則折。」最適合延伸為何種觀點？","追求成果前應先打好基礎",["只要長得高就不怕風","根部完全不重要","所有樹都不能成長"],"由樹根比喻基礎的重要。");
  }

  function easyEnglish(){
    const items=[
      ["I am thirsty. I want some ____.","water",["paper","stone","shoes"],"Thirsty means wanting to drink."],
      ["Tom ____ to school every morning.","walks",["walk","walking","to walk"],"Tom is third-person singular, so use walks."],
      ["The box is too ____ to carry. It needs two people.","heavy",["sweet","quiet","blue"],"The clue is needing two people to carry it."],
      ["We eat breakfast in the ____.","morning",["night","map","chair"],"Breakfast is usually eaten in the morning."],
      ["Mary lost her pencil, so I gave ____ one.","her",["him","it","they"],"Mary receives the pencil, so use her."],
      ["There are three ____ on the desk.","books",["book","booking","booked"],"Three means plural."],
      ["The cat is under the table. It is ____ the table.","below",["above","outside","before"],"Under means below."],
      ["If someone says 'Thank you,' a common answer is ____.","You're welcome",["Good night","I'm hungry","Turn left"],"This is a polite response."],
      ["Which word is a color?","red",["run","desk","happy"],"Red is a color."],
      ["My sister ____ a student.","is",["are","am","be"],"My sister is singular."],
      ["It is raining. Please take an ____.","umbrella",["eraser","apple","notebook"],"An umbrella is used in rain."],
      ["I brush my teeth before I go to ____.","bed",["school bus","rain","milk"],"People brush teeth before bed."]
    ]; const x=pick(items); return q("英文","easy","Basic",x[0],x[1],x[2],x[3]);
  }
  function normalEnglish(){
    const items=[
      ["Notice: The library closes at 5 p.m. Books must be borrowed before 4:30 p.m. What should students do?","Borrow books before 4:30 p.m.",["Return books after 5 p.m.","Enter only at 5 p.m.","Never borrow books"],"The notice gives a borrowing deadline."],
      ["Lily put on her coat and took an umbrella before leaving. What can we infer?","The weather may be cold or rainy.",["She is going swimming","She lost her coat","The umbrella is broken"],"Coat and umbrella suggest cold or rainy weather."],
      ["I will call you when I ____ home.","get",["will get","got","getting"],"In future time clauses with when, use present tense."],
      ["A short article says students sleep better when they stop using phones before bed. What is the main idea?","Reducing phone use before bed may help sleep.",["Phones always improve sleep","Students should never sleep","Beds are not useful"],"Summarize the article's point."],
      ["A ticket is $120. A student card gives a $30 discount. How much does a student pay?","$90",["$30","$120","$150"],"120 - 30 = 90."],
      ["Although Kevin was tired, he ____ his homework before going to bed.","finished",["finishing","finish","finishes"],"The sentence is past tense."],
      ["A: I failed the test. B: Don't give up. Try again next time. What is B doing?","Encouraging A",["Laughing at A","Asking for money","Changing schools"],"B tells A not to give up."],
      ["The road was wet because it rained all night. Why was the road wet?","It rained all night.",["It was sunny","The road was new","A bird sang"],"Because introduces the reason."]
    ]; const x=pick(items); return q("英文","normal","Context",x[0],x[1],x[2],x[3]);
  }
  function hardEnglish(){
    const items=[
      ["A writer says, 'The app promised to save time, but I spent the whole evening learning how to use it.' What is the tone?","Mildly ironic",["Completely admiring","Strictly scientific","Deeply romantic"],"The sentence contrasts promise and result."],
      ["An article says a city should build bike lanes because they reduce traffic, improve health, and lower pollution. Which option best describes the argument?","It supports bike lanes with several public benefits.",["It opposes all transportation","It only discusses bicycle colors","It says traffic is impossible to change"],"Need integrate multiple reasons."],
      ["After the coach praised only the fastest runners, some beginners stopped joining practice. What can we infer?","The coach's praise may have discouraged less confident students.",["All beginners became faster","The coach canceled practice","Fast runners stopped running"],"Need infer social effect from reactions."],
      ["Text A says online classes are flexible. Text B says online classes require self-control. What is the best combined idea?","Online classes offer freedom but also demand responsibility.",["Online classes have no advantages","Self-control is unrelated to learning","Flexibility means no work"],"Need combine two perspectives."],
      ["Club rule: New members may borrow one camera for two days. Senior members may borrow two cameras for three days. Tina is new and borrowed two cameras. What is wrong?","New members may borrow only one camera.",["She borrowed for too few days","Senior members cannot borrow cameras","The club has no rules"],"Apply the rule to Tina's status."],
      ["When asked about the long meeting, Leo said, 'Well, I learned that chairs can be uncomfortable.' What does he imply?","The meeting was too long or boring.",["He studied furniture design","He loved the meeting","The chairs were the meeting topic"],"The comment indirectly criticizes the meeting."]
    ]; const x=pick(items); return q("英文","hard","Inference",x[0],x[1],x[2],x[3]);
  }

  function easyMath(){ const t=rnd(0,11); if(t===0){const a=rnd(5,30),b=rnd(3,20);return q("數學","easy","加法",`${a}+${b}=?`,a+b,[a-b,a+b+10,a*b],"簡單加法。")}; if(t===1){const a=rnd(20,60),b=rnd(3,19);return q("數學","easy","減法",`${a}-${b}=?`,a-b,[a+b,b,a-b+5],"簡單減法。")}; if(t===2){const a=rnd(2,9),b=rnd(2,9);return q("數學","easy","乘法",`${a}×${b}=?`,a*b,[a+b,a*b+a,a*b-b],"九九乘法。")}; if(t===3){const b=rnd(2,9),ans=rnd(2,9);return q("數學","easy","除法",`${b*ans}÷${b}=?`,ans,[b,ans+b,b*ans],"被除數除以除數。")}; if(t===4){const l=rnd(4,12),w=rnd(3,10);return q("數學","easy","面積",`長方形長 ${l}、寬 ${w}，面積為何？`,l*w,[2*(l+w),l+w,l*w+2],"長方形面積＝長×寬。")}; if(t===5){const m=rnd(2,9);return q("數學","easy","單位",`${m} 公尺等於幾公分？`,m*100,[m*10,m+100,m],"1 公尺 = 100 公分。")}; if(t===6){const a=rnd(60,80),b=rnd(80,100);return q("數學","easy","平均",`${a} 和 ${b} 的平均是多少？`,(a+b)/2,[a+b,b-a,Math.max(a,b)],"兩數平均＝總和÷2。")}; if(t===7){const k=rnd(2,6);return q("數學","easy","比例入門",`一枝筆 ${k} 元，買 3 枝要多少元？`,k*3,[k+3,k*2,k*4],"單價乘以數量。")}; if(t===8){const a=rnd(30,120);return q("數學","easy","角度",`兩角互補，其中一角 ${a}°，另一角幾度？`,180-a,[90-a,a,180+a],"互補角和為 180°。")}; if(t===9)return q("數學","easy","機率入門","袋中有 1 顆紅球、1 顆藍球，任取一顆，抽到紅球的機率為何？","1/2",["1/3","1","0"],"共有兩顆，其中一顆紅球。"); if(t===10){const a=rnd(-5,5),b=rnd(1,4);return q("數學","easy","數線",`數線上從 ${a} 往右移 ${b} 格會到哪裡？`,a+b,[a-b,b-a,a],"往右代表加。")}; const a=rnd(1,9),d=rnd(1,5); return q("數學","easy","等差入門",`數列 ${a}, ${a+d}, ${a+2*d}, ... 下一項為何？`,a+3*d,[a+2*d+1,a+4*d,a*d],`每次增加 ${d}。`); }
  function normalMath(){ const t=rnd(0,7); if(t===0){const p=rnd(100,500),d=rnd(20,80);return q("數學","normal","二步驟",`商品 ${p} 元，折價 ${d} 元後再加收 10 元袋子費，總共多少？`,p-d+10,[p-d,p+10,p+d+10],"先折價，再加袋子費。")}; if(t===1){const a=rnd(2,5),b=rnd(3,7),k=rnd(5,12);return q("數學","normal","比例",`甲乙比為 ${a}:${b}，若乙為 ${b*k}，甲為何？`,a*k,[b*k,(a+b)*k,a+b],"先求每一份是多少。")}; if(t===2){const p=rnd(200,800),r=rnd(10,30);return q("數學","normal","百分比",`${p} 元打 ${100-r} 折後是多少？`,Math.round(p*(100-r)/100),[p-r,Math.round(p*r/100),p+r],"打折後乘以折扣比例。")}; if(t===3){const x=rnd(2,8),y=rnd(2,8);return q("數學","normal","聯立概念",`若 x+y=${x+y}，x-y=${x-y}，則 x=?`,x,[y,x+y,x-y],"兩式相加可求 x。")}; if(t===4){const l=rnd(6,15),w=rnd(3,9);return q("數學","normal","幾何周長",`長方形長 ${l}、寬 ${w}，周長為何？`,2*(l+w),[l*w,l+w,2*l+w],"周長＝2×(長+寬)。")}; if(t===5){const r=rnd(2,7),b=rnd(3,8);return q("數學","normal","機率",`袋中紅球 ${r} 顆、藍球 ${b} 顆，抽到紅球機率為何？`,frac(r,r+b),[frac(b,r+b),frac(r,b),frac(r+b,r)],"機率＝紅球數÷總球數。")}; if(t===6){const m=rnd(2,5),c=rnd(1,9),x=rnd(2,8);return q("數學","normal","函數入門",`若 y=${m}x+${c}，當 x=${x} 時，y=?`,m*x+c,[m+c,x+c,m*x],"代入 x 計算。")}; const v=rnd(40,80),tm=rnd(2,4); return q("數學","normal","速率",`車速每小時 ${v} 公里，行駛 ${tm} 小時共走幾公里？`,v*tm,[v+tm,v/tm,v*(tm+1)],"距離＝速率×時間。") }
  function hardMath(){ const t=rnd(0,5); if(t===0){const p=rnd(800,1600),a=rnd(80,200),r=rnd(10,25);return q("數學","hard","多步折扣",`商品原價 ${p} 元，先折價 ${a} 元，再打 ${100-r} 折，最後加運費 60 元，總價為何？`,Math.round((p-a)*(100-r)/100+60),[Math.round(p*(100-r)/100-a+60),p-a+60,Math.round((p-a)*r/100+60)],"需依序折價、打折、加運費。")}; if(t===1){const m=rnd(2,6),x=rnd(3,10),c=rnd(5,20),y=m*x+c;return q("數學","hard","反向函數",`若 y=${m}x+${c}，且 y=${y}，則 x=?`,x,[x+1,Math.floor(y/m),y-c],"先移項再除以係數。")}; if(t===2){const a=rnd(2,6),b=rnd(3,8);return q("數學","hard","條件機率",`盒中有 ${a} 張中獎卡、${b} 張未中獎卡。先抽出 1 張未中獎卡不放回，再抽 1 張，中獎機率為何？`,frac(a,a+b-1),[frac(a,a+b),frac(a-1,a+b-1),frac(b-1,a+b-1)],"已移除一張未中獎卡，總數少 1，中獎卡數不變。")}; if(t===3){const a=rnd(30,70);return q("數學","hard","幾何推理",`等腰三角形頂角為 ${a}°，每個底角為幾度？`,(180-a)/2,[180-a,a/2,90-a],"兩底角相等，且三角形內角和 180°。")}; if(t===4){const a=rnd(2,8),d=rnd(2,6),n=rnd(8,15);return q("數學","hard","數列公式",`等差數列首項 ${a}、公差 ${d}，第 ${n} 項為何？`,a+(n-1)*d,[a+n*d,a+(n-2)*d,a*d*n],"第 n 項＝首項+(n-1)公差。")}; return q("數學","hard","資料判讀","某班平均分數 70 分，加入一位 100 分學生後平均變 75 分。原本班上有幾人？","5",["4","6","10"],"設原本 n 人，70n+100=75(n+1)，解得 n=5。") }

  function easyNature(){ const items=[["冰塊融化成水，主要是哪一種變化？","物理變化",["化學變化","核反應","生物演化"],"物質仍是水，只是狀態改變。"],["眼睛主要用來感受什麼？","光線",["聲音","味道","重量"],"眼睛是視覺器官。"],["植物行光合作用通常需要哪一項？","陽光",["沙子聲音","鐵釘","塑膠袋"],"光合作用需要光。"],["把球往前推，球會往前動，主要是因為受到什麼？","力",["顏色","氣味","影子"],"推是施力。"],["熱水放久會變涼，主要是熱量往哪裡移動？","周圍環境",["水裡增加更多熱","完全消失不轉移","只跑到杯底"],"熱會由高溫處傳到低溫處。"],["聲音需要透過什麼傳播？","介質",["真空一定更快","影子","顏色"],"聲音需要空氣、水或固體等介質。"],["密度的計算方式是什麼？","質量÷體積",["體積÷質量","質量+體積","只看顏色"],"密度定義為質量除以體積。"],["血液中主要負責運送氧氣的是？","紅血球",["指甲","頭髮","牙齒"],"紅血球含血紅素，可運送氧氣。"],["下雨時通常代表空氣中有較多什麼凝結？","水氣",["石頭","金屬","塑膠"],"雨來自水氣凝結。"],["磁鐵最容易吸引哪一類物質？","鐵",["木頭","紙張","玻璃"],"磁鐵常吸引鐵、鎳、鈷等物質。"],["月亮本身會發光嗎？","不會，主要反射太陽光",["會像太陽一樣發光","只在白天發光","只靠地球發光"],"月光主要是反射太陽光。"],["草→兔→狼中，兔主要吃什麼？","草",["狼","石頭","陽光"],"箭頭表示能量從草到兔。"]]; const x=pick(items); return q("自然","easy","基本概念",x[0],x[1],x[2],x[3]) }
  function normalNature(){ const items=[["比較不同肥料對植物高度的影響，光照與水量應如何處理？","保持相同",["每組都不同","完全不記錄","只改變水量"],"要公平比較肥料，其他條件應控制。"],["某植物在有光組長得較高，無光組長得較矮。最合理推論是？","光照會影響植物生長",["水分完全不重要","植物不需要光","土壤一定有毒"],"由兩組差異推論光照影響生長。"],["甲物質 20g、10cm³；乙物質 30g、10cm³。何者密度較大？","乙",["甲","一樣大","無法比較"],"體積相同，質量較大者密度較大。"],["一個簡單電路中，若開關打開，燈泡通常會如何？","熄滅",["更亮","變成磁鐵","自己發電"],"開關打開使電路不通。"],["同量水中，攪拌通常會讓糖溶解得如何？","較快",["完全不溶","變成鹽","質量消失"],"攪拌增加接觸，有助溶解。"],["鐵生鏽通常與水和哪種氣體有關？","氧氣",["氦氣","氮氣一定單獨造成","二氧化碳完全無關且必然生鏽"],"鐵鏽形成與水和氧氣有關。"],["若黑眼為顯性 B、紅眼為隱性 b，紅眼個體基因型為何？","bb",["BB","Bb","B"],"隱性性狀需兩個隱性基因。"],["若溫度升高時反應速率先上升後下降，最可能表示？","有最適溫度",["溫度越高永遠越快","溫度完全無影響","低溫一定最快"],"圖表呈現先升後降。"]]; const x=pick(items); return q("自然","normal","應用概念",x[0],x[1],x[2],x[3]) }
  function hardNature(){ const items=[["某研究想知道光照時間是否影響豆苗高度。下列哪組設計最合理？","只改變光照時間，控制水量、土壤與溫度",["同時改變光照與水量","每組用不同植物且不記錄條件","只觀察一天不做比較"],"困難題需完整判斷操作變因與控制變因。"],["某實驗只測 3 種塑膠在 25℃ 的酒精中變化，就宣稱所有塑膠在任何溫度都安全。問題是？","樣本與條件不足，推論過度",["完全沒有任何資料","酒精一定不會影響塑膠","只要有三種樣本就能代表所有情況"],"結論超出實驗條件。"],["密閉系統達化學平衡時，下列何者正確？","正、逆反應仍進行且速率相等",["所有反應完全停止","只有正反應進行","物質質量不再存在"],"平衡是動態平衡，不是停止。"],["踩腳踏車帶動發電機使燈亮，主要能量轉換為何？","人體化學能→動能→電能→光能",["光能→電能→動能","聲能→核能→光能","電能憑空產生"],"需依序判斷能量轉換。"],["某地白天海風、夜晚陸風明顯，最主要與什麼有關？","陸地與海洋升溫、降溫速度不同",["月球每天撞擊海面","海水沒有溫度","風只由植物產生"],"海陸比熱差異造成氣壓差。"],["兩隻外表皆黑眼的魚生出紅眼子代，若紅眼為隱性，親代最可能是？","兩者皆帶有隱性基因",["兩者一定都是顯性純合","紅眼不可能出現","子代一定全黑眼"],"隱性子代表示雙親都提供隱性基因。"]]; const x=pick(items); return q("自然","hard","探究推理",x[0],x[1],x[2],x[3]) }

  function easySocial(){ const items=[["地圖上的北方通常在圖的哪一邊？","上方",["下方","左下角","沒有方向"],"一般地圖以北方在上。"],["家人照顧生病成員，主要展現什麼功能？","照顧與支持",["外交談判","司法審判","貨幣發行"],"家庭有照顧與情感支持功能。"],["買東西前比較價格，主要是為了？","做較合適的選擇",["讓價格一定上升","避免知道商品內容","增加浪費"],"比價有助理性消費。"],["學生在班會提出意見，主要展現哪種參與？","公共參與",["地形作用","天氣變化","生物繁殖"],"表達意見屬公共參與。"],["西元 2026 年屬於哪一世紀？","21 世紀",["19 世紀","20 世紀","22 世紀"],"2001 到 2100 年為 21 世紀。"],["太陽早上大多從哪個方向升起？","東方",["西方","北方","地下"],"太陽東升西落。"],["同一商品買的人變多，可能使價格如何？","上升",["一定變成 0","一定不能賣","與需求完全無關"],"需求增加常推升價格。"],["紅燈停、綠燈行屬於哪類規範？","交通規則",["家庭食譜","氣象預報","地形圖例"],"這是道路交通規則。"],["春節貼春聯、吃年夜飯屬於什麼？","節慶習俗",["火山活動","法律審判","股票交易"],"這是傳統節慶活動。"],["一地出生的人比死亡的人多，人口自然增加通常會如何？","增加",["一定減少","完全不變","變成負數"],"出生多於死亡，自然增加為正。"],["捷運、公車主要提供什麼服務？","大眾運輸",["農業灌溉","法院審判","海底採礦"],"捷運與公車是大眾運輸。"],["校園地圖通常比世界地圖顯示更多校園細節，因為它的範圍較？","小",["大","一樣","無限大"],"範圍小通常能呈現較多細節。"]]; const x=pick(items); return q("社會","easy","基本概念",x[0],x[1],x[2],x[3]) }
  function normalSocial(){ const items=[["政府開罰人民必須依法律程序，這最能表現什麼？","法治精神",["人治任意決定","完全沒有規範","只看個人喜好"],"政府權力也要受法律約束。"],["同一事件在不同媒體呈現角度不同，讀者應該怎麼做？","比較多方資料並判斷來源",["只看標題就相信","完全不接觸新聞","只相信轉傳訊息"],"媒體識讀需查證與比較。"],["商店常聚集在車站附近，主要原因是？","人潮多、交通便利",["土壤一定肥沃","沒有法律限制","氣候一定寒冷"],"商業活動重視交通與人潮。"],["港口開放貿易後，外國商人與新思想進入，可能造成？","文化交流增加",["完全與外界隔絕","所有人口消失","自然災害停止"],"貿易促進人與資訊流動。"],["某商品數量不變，但需求大增，價格通常？","上升",["下降到 0","完全不能交易","一定由天氣決定"],"需求增加且供給固定，價格可能上升。"],["政府補助偏鄉交通，主要想改善什麼？","交通近用與公平",["增加距離","禁止搭車","讓道路消失"],"公共政策常考量公平與需求。"],["外國品牌進入本地市場，同時本地店家調整經營方式，反映什麼？","全球化影響在地經濟",["完全沒有交流","只和地形有關","所有文化都消失"],"跨國流動會影響在地市場。"],["研究某時代人民生活，日記、照片、報紙都可作為什麼？","史料",["天氣現象","數學公式","生物器官"],"能反映過去的資料可作史料。"]]; const x=pick(items); return q("社會","normal","應用概念",x[0],x[1],x[2],x[3]) }
  function hardSocial(){ const items=[["政府提高電價以反映成本，但補助弱勢家庭。此政策同時考量？","市場成本與社會公平",["只照顧企業利潤","完全不考慮人民","取消所有能源使用"],"困難題需看見兩個政策目標。"],["某史書把中原政權視為正統，忽略邊疆民族觀點。此敘述提醒我們？","史料可能受書寫者立場影響",["史料永遠沒有立場","邊疆民族不存在","所有政權都沒有歷史"],"困難題需辨識史觀與立場。"],["某島位於重要航道上，周邊國家都重視其控制權。此島的重要性主要來自？","戰略位置",["一定有最多人口","完全沒有交通價值","只因土壤顏色"],"航道位置影響戰略價值。"],["犯罪件數下降，但相關新聞大幅增加，民眾仍覺得治安惡化。最合理解釋？","媒體報導量可能影響風險感受",["犯罪一定上升","統計資料必定無用","民眾不能有意見"],"需比較客觀數據與主觀感受。"],["古代君主可任意徵調人民，現代政府徵收財產需法律程序與補償。差異反映？","現代公權力受法治限制",["現代政府沒有權力","古代一定最民主","補償與權利無關"],"困難題比較制度與權利保障。"],["一地因高鐵通車帶來觀光人潮，也造成房價上升壓力。最適合的分析是？","交通建設可能同時帶來利益與負擔",["交通建設只有好處","房價與交通完全無關","觀光人潮必然消失"],"需要同時看正負影響。"]]; const x=pick(items); return q("社會","hard","整合判斷",x[0],x[1],x[2],x[3]) }

  
  
  if(typeof window.CSQ_ATTACH_EXTERNAL_BANK_ADAPTERS === "function"){
    window.CSQ_ATTACH_EXTERNAL_BANK_ADAPTERS({ q, pick });
  }

function generate(subject,difficulty){
    if(subject === "國文" && window.CSQ_GENERATE_CHINESE_QUESTION){
      return window.CSQ_GENERATE_CHINESE_QUESTION(0, false, null, difficulty);
    }
    const capPool = (typeof V62_CAP_BANK !== "undefined" && V62_CAP_BANK[subject] && V62_CAP_BANK[subject][difficulty]) ? V62_CAP_BANK[subject][difficulty] : null;
    if(capPool && capPool.length){
      return pick(capPool).make();
    }

    // Fallback only: old engines remain as safety net if a subject/difficulty has no v62 pool.
    const v59Pool = (typeof V59_CEEC_EXTRA !== "undefined" && V59_CEEC_EXTRA[subject] && V59_CEEC_EXTRA[subject][difficulty]) ? V59_CEEC_EXTRA[subject][difficulty] : null;
    if(v59Pool && v59Pool.length){
      return pick(v59Pool).make();
    }
    if(subject==="國文") return difficulty==="easy"?easyChinese():difficulty==="normal"?normalChinese():hardChinese();
    if(subject==="英文") return difficulty==="easy"?easyEnglish():difficulty==="normal"?normalEnglish():hardEnglish();
    if(subject==="數學"){
      if(typeof V48_MATH_EXTRA !== "undefined" && V48_MATH_EXTRA[difficulty]){
        return pick(V48_MATH_EXTRA[difficulty]).make();
      }
      return difficulty==="easy"?easyMath():difficulty==="normal"?normalMath():hardMath();
    }
    if(subject==="自然") return difficulty==="easy"?easyNature():difficulty==="normal"?normalNature():hardNature();
    return difficulty==="easy"?easySocial():difficulty==="normal"?normalSocial():hardSocial();
  }
  window.CSQ_GENERATE_QUESTION = function(subject,difficulty,source){
    const key=`${subject}_${difficulty}`;
    for(let i=0;i<80;i++){
      const qq=generate(subject,difficulty);
      const ss=sig(qq);
      if(!(recent[key]||[]).includes(ss)){ remember(key,ss); return qq; }
    }
    const qq=generate(subject,difficulty); remember(key,sig(qq)); return qq;
  };
  
  function factory(topic, make){ return {topic, make}; }



  // v65: Chinese question bank reset.
  // Old Chinese engines are intentionally bypassed. 國文只使用此 50 題 CAP 深度題庫。
  
  // v69: external JSON-array Chinese bank adapter.
  // For Netlify/static sites, edit question_bank_chinese.js or question_bank_chinese.json.
  // Expected standard format:
  // [{ id, topic, context, question, options:["A. ...","B. ...","C. ...","D. ..."], answer:"A", explanation, difficulty, stage, hint }]
  function normalizeChineseJsonBank(bank){
    const letters = ["A","B","C","D"];
    const stripLetter = (text, letter) => String(text ?? "")
      .replace(new RegExp("^\\s*" + letter + "[\\.．、\\)]\\s*"), "")
      .trim();
    const inferStage = (item, idx) => {
      if(item.stage) return item.stage;
      const topic = String(item.topic || item.type || "");
      if(idx < 15 || /形音義|詞|成語|修辭|語法|文句分析|段落理解|國學/.test(topic)) return "intro";
      if(idx < 32 || /資料|法律|生活|會議|社群|公告|海報|問卷/.test(topic)) return "middle";
      return "advanced";
    };
    const inferDifficulty = (item) => {
      const raw = String(item.difficulty || item.level || "").trim();
      if(raw.includes("精熟") || raw.toLowerCase() === "hard") return "精熟";
      return "基礎";
    };
    return (Array.isArray(bank) ? bank : []).map((item, idx) => {
      const rawOptions = item.options || [];
      let optObj = {};
      if(Array.isArray(rawOptions)){
        letters.forEach((letter, i) => {
          optObj[letter] = stripLetter(rawOptions[i] || "", letter);
        });
      }else{
        letters.forEach(letter => {
          optObj[letter] = String(rawOptions[letter] ?? "").trim();
        });
      }
      const answerLetter = String(item.answer || "A").trim().toUpperCase().slice(0,1);
      return {
        id: item.id || `CH-${String(idx+1).padStart(3,"0")}`,
        stage: inferStage(item, idx),
        type: item.type || item.topic || "國文素養",
        difficulty: inferDifficulty(item),
        context: item.context || "",
        question: item.question || "",
        options: optObj,
        answer: letters.includes(answerLetter) ? answerLetter : "A",
        rationale: item.rationale || item.explanation || "",
        hint: item.hint || "先判斷題幹要求，再排除過度推論或只看關鍵字的選項。"
      };
    }).filter(item => item.question && item.options && item.options[item.answer]);
  }

const V65_CHINESE_ITEMS = normalizeChineseJsonBank(window.MY_CHINESE_BANK || window.CSQ_FALLBACK_CHINESE_BANK || []);

  function v65ChineseDifficulty(item){
    return item.difficulty === "精熟" ? "hard" : "easy";
  }

  function v65ChineseToQuestion(item){
    const letters = ["A","B","C","D"];
    const answerText = item.options[item.answer];
    const wrongs = letters.filter(k => k !== item.answer).map(k => item.options[k]);
    const question = v65ChineseQuestionText(item);
    const explanation = `${item.rationale}

提示：${item.hint}`;
    const qq = q("國文", v65ChineseDifficulty(item), item.type, question, answerText, wrongs, explanation);
    qq.id = item.id;
    qq.capId = item.id;
    qq.capType = item.type;
    qq.progressStage = item.stage;
    return qq;
  }

  function v65ChineseSignature(item){
    return `國文|${item.id}|${item.type}|${String(item.question).replace(/\s+/g,"")}`;
  }

  function v65ChineseQuestionText(item){
    return `【情境】${item.context}

【資料／題目】
${item.question}

【命題方向】${item.difficulty}｜${item.type}｜114P精神・108課綱素養導向`;
  }

  function v65ChineseAppSig(item){
    return `國文|${String(item.type).replace(/\s+/g,'')}|${String(v65ChineseQuestionText(item)).replace(/[Ａ-Ｚａ-ｚ０-９]/g, ch => String.fromCharCode(ch.charCodeAt(0)-0xFEE0)).replace(/\s+/g,'').replace(/[，。！？、；：「」『』（）()【】\[\]《》〈〉,.!?;:'"“”‘’]/g,'').replace(/[ABCDＡＢＣＤ][\.．、)]/g,'').trim()}`;
  }

  function v65ChinesePool(roundCount=0, bossMode=false, difficulty="easy"){
    // Progression: 前段先用基礎分析類，中段進入判讀與生活文本，後段/Boss 才大量進入題組與跨文本。
    if(bossMode || roundCount >= 8) return V65_CHINESE_ITEMS.filter(x => x.stage === "advanced");
    if(roundCount >= 4) return V65_CHINESE_ITEMS.filter(x => x.stage === "middle");
    return V65_CHINESE_ITEMS.filter(x => x.stage === "intro");
  }

  window.CSQ_GENERATE_CHINESE_QUESTION = function(roundCount=0, bossMode=false, stageSigs=null, difficulty="easy"){
    let pool = v65ChinesePool(roundCount, bossMode, difficulty);
    if(!pool.length) pool = V65_CHINESE_ITEMS;

    const seenIds = new Set();
    const seenSigs = new Set();
    if(stageSigs && stageSigs.forEach){
      stageSigs.forEach(sig => {
        const s = String(sig);
        seenSigs.add(s);
        const m = s.match(/(?:CHI|CH)-\d{3}/);
        if(m) seenIds.add(m[0]);
      });
    }

    let candidates = pool.filter(item => !seenIds.has(item.id) && !seenSigs.has(v65ChineseAppSig(item)));
    if(!candidates.length){
      // If the stage pool is exhausted, expand to all unplayed Chinese questions before repeating.
      candidates = V65_CHINESE_ITEMS.filter(item => !seenIds.has(item.id) && !seenSigs.has(v65ChineseAppSig(item)));
    }
    if(!candidates.length) candidates = pool;

    const item = pick(candidates);
    return v65ChineseToQuestion(item);
  };

  function capQ(subject,difficulty,topic,context,question,answer,wrongs,rationale,hint){
    const levelText = difficulty === "hard" ? "精熟" : "基礎";
    const prompt = `【情境】${context}

【資料／題目】
${question}

【命題方向】${levelText}｜108課綱素養導向`;
    const exp = `${rationale}

提示：${hint}`;
    return q(subject,difficulty,topic,prompt,answer,wrongs,exp);
  }

  // v62 CAP-style refreshed question bank.
  // Philosophy: 三多一沒有（文字多、圖表多、情境多、沒有複雜純數字運算）
  // All questions are original simulations, modeled on CAP literacy-oriented structures.
  const V62_CAP_BANK = {
    "國文": {
      easy: [
        factory("社群對話主旨", () => {
          const item = pick([
            ["班群討論是否禁止午休滑手機。甲說手機是私物不能管，乙說午休影響下午精神，丙提醒緊急聯絡需求。", "可訂規範，但需保留特殊需求配套", ["手機是私物所以不能有任何規範", "只要有人精神不好就永久禁帶手機", "緊急聯絡需求代表規範一定無效"]],
            ["校刊討論營養午餐剩食。甲認為吃不完就丟，乙提出可先減量盛飯，丙補充可記錄每日剩食量。", "減少剩食可從調整份量與紀錄開始", ["剩食只和廚師有關，學生不用改變", "只要記錄就一定不會有剩食", "吃不完的食物都應直接禁止供餐"]],
            ["學生會討論校園雨傘共用架。甲擔心傘被拿走，乙建議登記借還，丙主張先試辦一週。", "可用試辦與登記降低共用制度的風險", ["共用一定失敗所以不用討論", "只要有登記就不會出現問題", "雨傘共用和校園生活無關"]]
          ]);
          return capQ("國文","easy","社群對話主旨","校園社群媒體對話",item[0] + "\n\n根據對話，下列哪一項最能整合多數人的想法？",item[1],item[2],
            "正確選項能整合不同立場，而不是只抓單一發言。錯誤選項多半把某一句話絕對化，形成過度推論。",
            "先找各方共同想解決的問題，再看哪個選項兼顧秩序與彈性。");
        }),
        factory("說明書閱讀", () => {
          const item = pick([
            ["環保杯借用說明：借杯須掃描學生證；三日內歸還不收費；逾期將暫停借用資格。", "借用制度鼓勵準時歸還並維持流通", ["借杯後可以永久保留", "逾期者會被要求退學", "掃描學生證是為了公開成績"]],
            ["實驗室安全卡：加熱液體時，試管口不得朝向自己或他人；若聞氣味，應以手輕搧，不可直接湊近。", "操作安全重點在避免燙傷與吸入刺激氣體", ["試管口朝人較方便觀察", "氣味越濃越應直接吸入", "安全卡只提醒整理桌面"]],
            ["圖書館公告：熱門書每人限借一本，借期七天，不開放續借；若無人預約，普通書可續借一次。", "熱門書限制較多，是為了讓更多人能借閱", ["熱門書可以無限續借", "普通書完全不能借", "限借一本是因為書本受損"]]
          ]);
          return capQ("國文","easy","實用文本閱讀","校園規範與說明書",`${item[0]}\n\n依據說明，下列理解何者最合理？`,item[1],item[2],
            "實用文本題重點在讀出規範目的，而不是只抓單一詞語。陷阱選項常把規定誇大或曲解。",
            "注意規定背後要解決的問題：安全、流通、秩序，還是公平？");
        }),
        factory("古今對照理解", () => {
          const item = pick([
            ["古文：『不以規矩，不能成方圓。』今譯：沒有合宜的準則，就難以把事情做好。", "規範若合宜，有助於維持秩序與完成目標", ["所有規定都不能修改", "只要有規定就一定公平", "方形和圓形不能一起出現"]],
            ["古文：『知不足而後能自反也。』今譯：知道自己的不足，才會進一步反省。", "發現不足是改進的起點", ["承認不足代表永遠失敗", "只要反省就不需行動", "不知道不足才是最好的學習"]],
            ["古文：『良藥苦口利於病，忠言逆耳利於行。』今譯：有幫助的勸告可能聽起來不順耳。", "不順耳的建議仍可能有助於改進", ["只要難聽就一定正確", "別人的建議都不該聽", "藥越苦就越沒有用"]]
          ]);
          return capQ("國文","easy","古今對照理解","古文今譯對照",`${item[0]}\n\n下列哪一項最符合這段話的意思？`,item[1],item[2],
            "正確答案會抓住古文的抽象道理；錯誤選項常把字面意思絕對化或誇張化。",
            "先看今譯，再把道理套回生活情境。");
        }),
        factory("數據轉文字", () => {
          const item = pick([
            ["班級閱讀調查：紙本書 42%、電子書 38%、有聲書 20%。", "紙本書仍最多，但電子書比例也接近", ["有聲書使用比例最高", "電子書完全沒有人使用", "紙本書占全部學生九成以上"]],
            ["午餐剩食紀錄：週一 8 公斤、週二 6 公斤、週三 5 公斤、週四 5 公斤。", "剩食量有下降後趨於穩定的情形", ["剩食量每天都增加", "週四比週一多很多", "資料完全無法看出變化"]],
            ["社團參與問卷：運動類 35%、藝文類 30%、服務類 25%、其他 10%。", "三大類社團參與比例相近，運動類略高", ["其他類占最多", "服務類完全沒有人參加", "藝文類比運動類多一倍"]]
          ]);
          return capQ("國文","easy","圖表文字轉換","資料圖表轉換成文字敘述",`${item[0]}\n\n若要把資料寫成一句客觀敘述，下列何者最恰當？`,item[1],item[2],
            "圖表轉文字要忠實呈現比例與趨勢，不能加入資料沒有支持的結論。",
            "先找最高、最低、接近或變化方向，再檢查選項有沒有誇大。");
        })
      ],
      normal: [
        factory("新聞評論論點", () => {
          const item = pick([
            ["某市推動共享腳踏車，評論指出：便利不等於可任意停放。若沒有停車規範，行人空間反而被壓縮。", "共享服務需兼顧便利與公共空間秩序", ["共享腳踏車完全不應存在", "只要方便就不需任何規範", "行人空間和交通政策無關"]],
            ["新聞評論說：校園外送平台讓午餐選擇變多，但若包裝垃圾增加，學校也應思考減量制度。", "便利消費也應搭配垃圾減量規畫", ["外送一定比營養午餐健康", "只要垃圾增加就禁止所有午餐", "包裝垃圾不是校園問題"]],
            ["評論指出：AI 可輔助寫作，但若學生只貼上產出而不檢查，學習可能被工具取代。", "工具可被使用，但學生仍需保留思考與修正", ["AI 工具完全不能出現在學校", "只要使用 AI 就一定進步", "寫作只需要速度不需要思考"]]
          ]);
          return capQ("國文","normal","新聞評論論點","新聞評論節錄",`${item[0]}\n\n此評論最主要想表達什麼？`,item[1],item[2],
            "評論主旨通常不是單純贊成或反對，而是指出某種平衡或限制條件。",
            "看作者先承認什麼好處，再提醒什麼風險。");
        }),
        factory("會議紀錄推論", () => {
          const item = pick([
            ["會議紀錄：一、學生反映走廊下雨易濕滑。二、總務處表示防滑墊可先設在轉角處。三、導師建議先觀察一週事故回報。", "會議決定傾向先在高風險處試辦並觀察效果", ["立刻拆除所有走廊", "完全不處理濕滑問題", "只要學生反映就永久封閉走廊"]],
            ["會議紀錄：一、圖書館座位不足。二、部分座位常被書包占用。三、決議試辦離座三十分鐘清位提醒。", "問題不只在座位數，也包含座位使用方式", ["圖書館不需要座位", "只要買更多椅子即可解決所有問題", "清位提醒表示禁止閱讀"]],
            ["會議紀錄：一、校慶攤位希望減少排隊。二、資訊組提出線上預約時段。三、學生會建議保留少量現場名額。", "安排兼顧效率與未預約者的參與機會", ["所有人都只能現場排隊", "線上預約代表不能參加校慶", "只要有效率就不需公平"]]
          ]);
          return capQ("國文","normal","會議紀錄推論","會議紀錄摘要",`${item[0]}\n\n根據紀錄，下列推論何者最合理？`,item[1],item[2],
            "會議紀錄常有問題、建議與暫行決議，要整合各點，不可只取其中一句。",
            "判斷決議想同時解決哪些問題。");
        }),
        factory("科普說明文", () => {
          const item = pick([
            ["珊瑚白化並非珊瑚立刻死亡，而是共生藻離開或色素減少，使珊瑚失去主要能量來源。若環境恢復，部分珊瑚仍可能復原。", "珊瑚白化是受環境壓力影響的警訊，但不等於立即死亡", ["珊瑚白化代表珊瑚一定已死亡", "共生藻離開後珊瑚能量一定增加", "環境恢復和珊瑚狀態無關"]],
            ["城市熱島常與柏油、水泥、車流與綠地不足有關。增加樹蔭與透水鋪面，可降低局部高溫。", "城市降溫需從材料、交通與綠化等因素思考", ["只要開冷氣就能消除熱島", "樹蔭一定使城市沒有夏天", "柏油和溫度完全無關"]],
            ["微塑膠可能來自塑膠袋、衣物纖維或輪胎磨耗，進入水體後不易短時間分解。", "微塑膠來源多元且可能長期存在環境中", ["微塑膠只來自飲料瓶", "微塑膠進入水中會立刻消失", "衣物纖維不可能進入水體"]]
          ]);
          return capQ("國文","normal","科普說明文閱讀","科普文章節錄",`${item[0]}\n\n下列哪一項最符合文意？`,item[1],item[2],
            "科普說明文常考『精確理解』，不要把可能、部分、相關因素誤讀成絕對結論。",
            "留意文中的『可能、部分、常與、可』這類限制語。");
        }),
        factory("過度推論辨識", () => {
          const item = pick([
            ["調查發現，參加閱讀社的學生平均閱讀時間較長。有人因此說：『只要加入閱讀社，成績一定會變好。』", "把相關性誤推為必然因果", ["完全沒有使用任何資料", "結論比資料更保守", "閱讀時間和社團絕對無關"]],
            ["某班使用平板學習後，有三位學生進步。有人說：『全校都應改成只用平板上課。』", "樣本少且把輔助工具擴大為唯一方法", ["平板不能顯示文字", "進步學生一定沒有使用平板", "全校學生都已經參與實驗"]],
            ["一篇貼文說某家店排隊很長，所以餐點一定最健康。", "把受歡迎程度直接等同於健康程度", ["排隊表示沒有人購買", "健康一定不能討論", "餐點完全沒有味道"]]
          ]);
          return capQ("國文","normal","論證缺口",`網路討論中的推論`,`${item[0]}\n\n此推論最主要的問題是什麼？`,item[1],item[2],
            "題目要判斷推論是否超出證據。陷阱通常是把『可能相關』說成『一定因果』。",
            "問自己：資料真的能推出那麼強的結論嗎？");
        })
      ],
      hard: [
        factory("跨文本價值平衡", () => {
          const item = pick([
            ["甲文：校園應保留安靜閱讀空間。乙文：學生也需要能討論與合作的學習角落。丙圖表：午休時段安靜區使用率 80%，放學後討論區使用率 75%。", "不同時段與空間可採分區管理，兼顧安靜與合作需求", ["既然安靜區使用率高，就取消討論區", "討論區放學後有人用，所以午休也應全面開放吵鬧", "兩種空間需求互相矛盾，只能選一種"]],
            ["甲文：社群平台能快速傳遞災害資訊。乙文：未查證消息也可能造成恐慌。資料：某次豪雨假訊息轉傳量高於官方澄清。", "災害資訊需要快速傳播，也需要查證與來源辨識", ["官方澄清較少轉傳所以一定不重要", "社群平台只能帶來傷害", "只要傳得快就一定正確"]],
            ["甲文：古蹟修復應保留原貌。乙文：若完全不開放使用，維護經費與公共參與都會降低。表格：開放導覽後維護捐款上升。", "古蹟保存可在保護原貌與適度利用間取得平衡", ["古蹟只要能賺錢就可任意改造", "保留原貌代表完全不能參觀", "導覽人數增加一定會破壞古蹟"]]
          ]);
          return capQ("國文","hard","跨文本統整","多文本閱讀與資料判讀",`${item[0]}\n\n綜合三項資料，下列判斷何者最周延？`,item[1],item[2],
            "精熟題需同時處理兩種價值與一份資料，最佳答案通常能兼顧而非走極端。",
            "找出每份材料支持的面向，再選擇能同時容納多方資訊的敘述。");
        }),
        factory("敘事可靠度", () => capQ("國文","hard","敘事觀點","小說閱讀",`短文：\n「我確定全班都討厭我的報告。」他低頭看著講稿。其實坐在前排的同學正把他提到的例子抄進筆記，老師也在評分表上寫下「例證清楚」。\n\n閱讀此段，下列判斷何者最合理？`,"敘事者的感受不一定等於事實，需從其他角色行動判斷",["全班確實討厭他的報告", "老師完全沒有聽報告", "前排同學抄筆記是為了嘲笑他"],
          "主角主觀感受與外在行動線索不一致，因此不能只相信主角自我判斷。",
          "比較主角的想法和其他人物的實際反應。")),
        factory("語氣與反諷", () => capQ("國文","hard","語氣判讀","新聞評論留言",`留言：「真是太有效率了，為了節省三分鐘排隊時間，我們多花了半小時填寫系統錯誤回報。」\n\n這句話的語氣最接近下列何者？`,"反諷制度宣稱效率卻造成更多耗時",["真心稱讚系統節省時間", "客觀介紹系統操作步驟", "單純抱怨排隊人太多"],
          "句中『節省三分鐘』與『多花半小時』形成矛盾，顯示說話者並非真心稱讚。",
          "注意表面稱讚和實際結果是否互相衝突。")),
        factory("文言延伸應用", () => capQ("國文","hard","文言應用","古文與生活情境",`古文：「欲速則不達。」今譯：一味求快，反而不能達成目標。\n\n下列哪個情境最能呼應這句話？`,"學生只背題目答案，遇到變化題反而無法作答",["學生每天固定複習並調整錯因", "學生先理解規則再練習應用", "學生放慢速度檢查圖表單位"],
          "『欲速則不達』重點是急於求成導致失敗，背答案看似快，卻無法應付變化。",
          "找出看似省時間、實際造成學習失敗的情境。"))
      ]
    },

    "英文": {
      easy: [
        factory("School notice", () => capQ("英文","easy","Notice reading","school notice",`Notice: Bring your own cup on Friday. Students with reusable cups can get NT$5 off at the school drink stand. The activity is to reduce plastic waste.\n\nWhat is the main purpose of the notice?`,"to encourage students to use reusable cups",["to ask students to buy more plastic cups","to cancel the drink stand on Friday","to make all drinks more expensive"],
          "The notice mentions reusable cups, a discount, and reducing plastic waste. These details point to the purpose.",
          "Find the action students are asked to do and the reason given.")),
        factory("Dialogue inference", () => capQ("英文","easy","Dialogue inference","classroom dialogue",`Mia: I thought the science report was due tomorrow.\nBen: It was changed to today. The teacher wrote it on the board yesterday.\n\nWhat most likely happened?`,"Mia did not notice the new due date",["Ben forgot to do the report","The teacher canceled the report","The report is due next week"],
          "Mia still thinks the old due date is correct, while Ben points out the change.",
          "Look for the difference between Mia's belief and Ben's information.")),
        factory("Cloze logic", () => capQ("英文","easy","Cloze logic","short paragraph",`The park was full of trash after the picnic. The students worked together to clean it up. ____, the park looked nice again.`,"Finally",["However","Before","Never"],
          "The last sentence gives the result after cleaning, so 'Finally' fits the sequence.",
          "Decide whether the missing word shows result, contrast, or time order.")),
        factory("Sign reading", () => capQ("英文","easy","Sign reading","public sign",`Sign: Please keep your voice low. Students are reading and studying here.\n\nWhere would you most likely see this sign?`,"in a library",["at a swimming pool","on a basketball court","in a night market"],
          "Keeping voices low because people are reading and studying points to a library.",
          "Match the rule with the place where it is needed."))
      ],
      normal: [
        factory("AI writing policy", () => capQ("英文","normal","Argument reading","school AI policy",`Many students use AI tools to check grammar or get ideas. The school does not ban these tools, but students must write a note explaining how they used them and what they changed after thinking.\n\nWhat is the main idea?`,"Students may use AI tools, but they should show their own thinking",["The school believes AI tools should never be used","Students should copy AI paragraphs to save time","Grammar is the only important part of writing"],
          "The passage balances usefulness and responsibility. It does not completely ban AI.",
          "Look for the rule the school chooses instead of a total ban.")),
        factory("Two views", () => capQ("英文","normal","Comparing views","class debate",`Text A: Online classes save travel time and let students replay lessons.\nText B: Some students lose focus at home if they do not make a study plan.\n\nWhich statement best combines the two views?`,"Online classes can help, but students still need good learning habits",["Online classes are always worse than school","Travel time is the only problem in learning","Students never need a study plan at home"],
          "Text A gives advantages; Text B gives a condition or risk. The best answer includes both.",
          "Do not choose an extreme answer that ignores one text."),
        ),
        factory("Paragraph cohesion", () => capQ("英文","normal","Paragraph cohesion","environmental paragraph",`Choose the best sentence to fill in the blank.\n\nSome stores give discounts to customers who bring their own bags. The discount is small, but it reminds people to reduce waste. ________ In this way, a simple shopping habit can help the environment.`,"If many people do it, the effect can grow over time.",["Plastic bags are always free in every store.","Customers should never buy food.","Shopping habits have nothing to do with waste."],
          "The missing sentence should connect a small discount to a larger environmental effect.",
          "Read the sentence before and after the blank.")),
        factory("Conditional notice", () => capQ("英文","normal","Conditional reasoning","train station notice",`Notice: The 3:30 train will not stop at Green Station today. Passengers for Green Station should get off at Lake Station and take Bus 12.\n\nWho needs to change plans?`,"a passenger taking the 3:30 train to Green Station",["a passenger going to Lake Station","a passenger taking a train tomorrow","a passenger who is already on Bus 12"],
          "Only passengers on the 3:30 train who want Green Station are affected.",
          "Check both the time and destination conditions."))
      ],
      hard: [
        factory("Long argument", () => capQ("英文","hard","Long argumentative reading","student newspaper editorial",`A school plans to replace paper announcements with a phone app. Supporters say the app saves paper and sends news quickly. However, some students do not check their phones during school, and some families prefer printed notices. The editor suggests using the app for urgent messages but keeping paper copies for important long-term information.\n\nWhat is the editor's position?`,"Use different communication methods for different needs",["Use only the app because speed is everything","Keep only paper notices because apps never work","Cancel all school announcements"],
          "The editor does not choose one method for all situations; the suggestion separates urgent and long-term needs.",
          "Look at the final suggestion and how it balances two sides.")),
        factory("Tone detection", () => capQ("英文","hard","Tone and irony","online comment",`A student writes: 'Great. The new system saved me five minutes of waiting, so I only spent thirty minutes reporting why it could not log in.'\n\nWhat is the tone?`,"ironic",["grateful without complaint","scientific and neutral","excited about sports"],
          "The sentence says 'Great' but describes a worse result, which creates irony.",
          "Compare the positive word with the actual situation.")),
        factory("Evidence selection", () => capQ("英文","hard","Evidence for claim","research claim",`Claim: Students understand news better when they compare different sources.\n\nWhich evidence best supports the claim?`,"After reading two reports with different viewpoints, students explained the issue with more reasons.",["The school library has many chairs.","News articles often have pictures.","Some students read news after dinner."],
          "Good evidence must directly support the claim about comparing sources and understanding.",
          "Choose the option that measures the result of comparing sources.")),
        factory("Policy inference", () => capQ("英文","hard","Policy inference","club rules",`Club rule: Members may use the art room after school only if a teacher is present. Students who need extra practice must sign up one day earlier.\n\nWhich student follows the rule?`,"A student signs up on Monday and practices with a teacher on Tuesday.",["A student enters alone because the door is open.","A student signs up after finishing practice.","A student practices without telling anyone because it is urgent."],
          "The rule requires both teacher presence and signing up earlier.",
          "Check all conditions, not just one."))
      ]
    },

    "數學": {
      easy: [
        factory("折扣模型判斷", () => {
          const price=pick([800,1000,1200]), fee=pick([40,60,80]), off=pick([10,20]);
          const ans=Math.round(price*(100-off)/100+fee);
          return capQ("數學","easy","生活建模：折扣","百貨公司會員方案",`某商品原價 ${price} 元，會員可打 ${100-off} 折，結帳時另收運費 ${fee} 元。若只買此商品，總金額應如何判斷？`,`${ans} 元`,[`${Math.round((price+fee)*(100-off)/100)} 元`,`${Math.round(price*(100-off)/100)} 元`,`${price-off+fee} 元`],
            "正確作法是先對商品價格打折，再加上不打折的運費。陷阱包含先加運費再打折、忘記運費、把折扣數字當作直接扣款。",
            "想清楚哪一部分有打折，哪一部分沒有。");
        }),
        factory("資料表比例", () => capQ("數學","easy","資料解讀：比例","班級社團調查",`某班社團參與如下：運動 12 人、藝文 9 人、服務 6 人、未參加 3 人。若要用一句話描述資料，下列何者合理？`,"運動社團人數最多，未參加者最少",["藝文社團人數比運動社團多","未參加者占全班一半","服務社團人數比運動社團多"],
          "本題重點是讀表比較大小，不需複雜計算。",
          "先找最大與最小，不要被選項的語氣影響。")),
        factory("幾何直覺：圓", () => capQ("數學","easy","圖像幾何：圓面積","校園灑水器覆蓋",`操場草皮裝設圓形灑水器。甲灑水器半徑約為乙的 2 倍。若只比較理想圓形覆蓋面積，下列何者較合理？`,"甲的覆蓋面積約為乙的 4 倍",["甲的覆蓋面積約為乙的 2 倍","甲和乙覆蓋面積相同","半徑越大，面積一定只多 1 倍"],
          "圓面積與半徑平方有關，半徑變 2 倍，面積變 4 倍。",
          "想想面積是看半徑本身，還是半徑的平方。")),
        factory("路線選擇", () => capQ("數學","easy","生活建模：路線","校外教學路線比較",`A 路線步行 8 分鐘、搭車 12 分鐘；B 路線步行 5 分鐘、搭車 18 分鐘。若只比較總時間，下列何者正確？`,"A 路線較快",["B 路線較快","兩路線一樣快","資料不足，因為沒有天氣"],"A 總時間 20 分鐘，B 總時間 23 分鐘。這是生活情境的簡單建模。",
          "先把同一路線的時間合併，再比較。"))
      ],
      normal: [
        factory("基地台覆蓋", () => capQ("數學","normal","圓形覆蓋與重疊","校園 Wi-Fi 規劃",`方案甲：1 台大型基地台，訊號可視為半徑 20 公尺的圓。\n方案乙：4 台小型基地台，每台半徑 10 公尺，分散放置。\n\n只看理論面積與可能重疊，下列判斷何者合理？`,"甲的理論面積和四台乙的面積總和相同，但乙可能因重疊使實際覆蓋變小",["甲半徑是乙兩倍，所以甲面積只比單台乙多兩倍","四台乙面積加總相同，所以實際覆蓋形狀一定相同","基地台數量越多，實際覆蓋一定越大"],
          "半徑 20 的圓面積為 400π；四個半徑 10 的圓總和也是 400π。但多個圓可能重疊。",
          "同時考慮公式關係與實際配置。")),
        factory("相似形判斷", () => capQ("數學","normal","相似形與比例","美術課放大圖稿",`學生將一張長寬比為 3:2 的海報放大。若新海報的寬為原來的 1.5 倍，且圖形不變形，下列何者正確？`,"新海報的長也應為原來的 1.5 倍",["新海報的長應為原來的 3 倍","只放大寬，長不用變","長寬比會變成 2:3"],
          "相似放大時，各方向長度需乘以相同倍率，形狀才不變。",
          "抓住『不變形』代表比例固定。")),
        factory("人口占比", () => capQ("數學","normal","占比調整","社區人口資料",`某社區青年人口占 20%。若社區希望青年活動報名者比例接近社區人口結構，卻發現報名者中青年占 40%。下列描述何者最合理？`,"青年報名占比約為社區青年占比的 2 倍",["青年報名人數一定是全社區青年人數的 2 倍","青年完全沒有參加活動","青年報名比例比社區占比低"],
          "本題比較的是比例，不是實際人數。40% 是 20% 的 2 倍。",
          "小心『占比』和『人數』不是同一件事。")),
        factory("幾何與面積變化", () => capQ("數學","normal","幾何建模：面積","校園花圃調整",`長方形花圃原本長 12 公尺、寬 8 公尺。園藝社想把長增加 2 公尺、寬減少 1 公尺。下列判斷何者合理？`,"新面積比原面積大 2 平方公尺",["新面積等於原面積","只要長增加，面積一定增加很多","應比較周長而不是面積"],
          "原面積 96，新面積 14×7=98，所以增加 2。計算不難，重點是把情境轉成面積比較。",
          "先算原面積與新面積，再比較差異。"))
      ],
      hard: [
        factory("三角比直覺", () => capQ("數學","hard","圖像幾何：三角比","校園旗桿影子",`某日陽光照射下，旗桿、地面與影子可形成直角三角形。學生知道同一時間，物體高度和影長的比值相同。若 A 竿高 2 公尺、影長 3 公尺；旗桿影長約 12 公尺，則下列推論何者合理？`,"旗桿高度約為 8 公尺",["旗桿高度約為 18 公尺","旗桿高度約為 6 公尺","只知道影長，完全不能利用 A 竿資料推估"],
          "同一時間陽光角度相同，可用相似形比例。高度:影長 = 2:3，所以旗桿高度為 12×2/3=8。",
          "把旗桿和 A 竿看成兩個相似直角三角形。")),
        factory("方案評估", () => capQ("數學","hard","生活建模：方案評估","家庭網路資費",`方案甲：每月基本費 399 元，超過流量每單位 20 元。\n方案乙：每月基本費 499 元，超過流量每單位 10 元。\n某家庭常超過 12 單位流量。若只比較費用，下列判斷何者合理？`,"乙方案較便宜，因為超量多時較低的加收費會抵銷基本費差",["甲基本費較低，所以任何情況都較便宜","乙基本費較高，所以任何情況都較貴","無法比較，因為沒有網路速度資料"],
          "甲總費用 399+12×20=639；乙為 499+12×10=619。重點是比較固定費與變動費。",
          "把費用分成基本費和超量費，代入情境即可。")),
        factory("空間圖形", () => capQ("數學","hard","空間圖形與展開","包裝設計",`一個無蓋長方體盒子要用紙板製作，底面是長方形，四周有四個側面。設計圖只畫出底面和兩個側面就說可以直接完成盒子。下列判斷何者合理？`,"設計圖不完整，還需要另外兩個側面才能形成無蓋盒",["無蓋盒只需要底面，不需要側面","畫出兩個側面就一定能形成完整盒子","只要有紙板，展開圖是否完整不重要"],
          "無蓋長方體仍需要底面與四個側面。題目考空間展開圖的構成，不是公式。",
          "想像把紙板折起來，哪些面會缺少？")),
        factory("資料倍率與陷阱", () => capQ("數學","hard","資料判讀與倍率","人口占比變化報告",`某區老年人口占比從 15% 上升到 30%。新聞標題寫：「老年人口人數必定增加為 2 倍。」若只根據占比資料，下列評估何者合理？`,"標題過度推論，因為占比變 2 倍不代表實際人數一定變 2 倍",["標題一定正確，因為 30% 是 15% 的 2 倍","占比資料完全沒有任何意義","只要占比增加，總人口一定增加"],
          "占比受總人口影響，比例倍數不一定等於實際人數倍數。",
          "分清楚比例和實際人數。"))
      ]
    },

    "自然": {
      easy: [
        factory("實驗變因", () => capQ("自然","easy","探究：操作變因","植物生長實驗",`學生想研究「光照時間是否影響豆苗高度」。A 組每天照光 4 小時，B 組每天照光 8 小時；兩組水量、土壤、溫度相同。\n\n此實驗的操作變因是什麼？`,"光照時間",["豆苗高度","土壤種類","測量日期"],
          "操作變因是研究者主動改變的條件。豆苗高度是結果，不是操作變因。",
          "問自己：哪個條件是實驗者故意改變的？")),
        factory("圖表趨勢", () => capQ("自然","easy","圖表解讀：趨勢","水溫與溶解量資料",`某物質在水中的溶解量如下：20°C：25g，40°C：38g，60°C：52g。\n\n下列描述何者最符合資料？`,"在此溫度範圍內，溫度越高溶解量越大",["溫度越高溶解量越小","三個溫度的溶解量相同","資料顯示 60°C 無法溶解任何物質"],
          "資料呈現 25、38、52 逐漸增加，因此可描述為此範圍內隨溫度增加而增加。",
          "先看數據是增加、減少還是維持不變。")),
        factory("安全操作", () => capQ("自然","easy","實驗安全","加熱液體實驗",`實驗課加熱試管中的液體時，老師要求試管口不要朝向自己或同學。主要原因為何？`,"避免液體噴濺造成燙傷",["讓液體更快變甜","使試管口比較好看","讓溫度計讀數變大"],
          "加熱液體可能噴濺，因此試管口不能朝人。",
          "想想這個規則要避免哪種危險。")),
        factory("生活能量轉換", () => capQ("自然","easy","能量轉換","手搖手電筒",`手搖手電筒發亮時，使用者轉動把手後燈泡發光。下列能量轉換何者較合理？`,"動能轉成電能，再轉成光能",["光能轉成食物，再轉成聲音","電能直接變成水","熱能轉成文字"],
          "手搖提供運動能量，發電裝置產生電能，燈泡再發光。",
          "依照動作發生的順序想。"))
      ],
      normal: [
        factory("控制變因異常", () => capQ("自然","normal","探究：控制變因","豆苗實驗紀錄",`A 組：光照 4 小時，水量 20mL，25°C，高度 6.2cm。\nB 組：光照 8 小時，水量 20mL，25°C，高度 9.1cm。\nC 組：光照 8 小時，水量 40mL，30°C，高度 12.4cm。\n\n若有人說「光照 8 小時一定讓豆苗長到 12cm 以上」，此說法的主要問題是？`,"C 組同時改變水量與溫度，不能只歸因於光照",["A 組和 B 組完全不能比較","C 組高度最高所以結論一定正確","植物生長不需要控制條件"],
          "C 組除了光照外，水量與溫度也不同，因此無法單獨判斷光照效果。",
          "看哪幾組只有一個條件不同，哪一組混入太多變因。")),
        factory("電路圖文字化", () => capQ("自然","normal","電路推理","串聯電路文字圖",`一個電路中，電池、開關、燈泡甲、燈泡乙依序連成單一路徑。若燈泡甲燒壞形成斷路，燈泡乙通常會怎樣？`,"也不亮，因為串聯路徑中斷",["變得更亮，因為電流集中到乙","變成電池，繼續供電","與甲無關，一定正常發亮"],
          "串聯電路只有一條路徑，一處斷路會使整個電路電流中斷。",
          "想像電流有沒有其他路可走。")),
        factory("密度情境", () => capQ("自然","normal","密度概念","回收材料分類",`回收站要分辨兩種塑膠材料。甲：質量 30g、體積 15cm³；乙：質量 30g、體積 30cm³。若放入某液體時，密度較大的較容易下沉，下列判斷何者合理？`,"甲密度較大，較可能下沉",["乙密度較大，因為體積較大","兩者質量相同所以密度一定相同","密度與體積和質量都無關"],
          "密度是質量除以體積。兩者質量相同時，體積較小者密度較大。",
          "不需要大量計算，先比較同質量下誰體積較小。")),
        factory("生態資料", () => capQ("自然","normal","生態系推論","溪流生態調查",`調查發現某溪流上游昆蟲幼蟲減少，而主要以昆蟲幼蟲為食的小魚數量也下降。下列解釋何者較合理？`,"食物來源減少可能影響小魚族群",["小魚下降必定與食物無關","昆蟲減少一定會讓小魚立刻增加","溪流中只有一種生物"],
          "食物鏈中一個族群變動會影響捕食者，但題目仍用『可能』較嚴謹。",
          "找出誰吃誰，以及食物變少後可能造成什麼影響。"))
      ],
      hard: [
        factory("雙圖表整合", () => capQ("自然","hard","跨圖表整合：溶解度與降溫","飲料結晶實驗",`資料一：某物質在 80°C 可溶 60g，在 40°C 可溶 35g。\n資料二：學生把 80°C 時剛好溶有 60g 的溶液冷卻到 40°C，杯底出現晶體。\n\n下列解釋何者最合理？`,"降溫後可溶量下降，多出的物質析出形成晶體",["降溫使可溶量增加，所以晶體是水變成的","晶體出現表示原本沒有溶解任何物質","溫度和溶解量無關"],
          "80°C 可溶 60g，但 40°C 只能溶 35g，因此多出的部分會析出。",
          "把兩個溫度下的可溶量放在一起比較。")),
        factory("異常數據判讀", () => capQ("自然","hard","探究：異常數據","酵素反應速率實驗",`某酵素在 25°C、35°C、45°C 的反應速率依序上升，但 65°C 時反應速率突然大幅下降。學生說：「溫度越高反應一定越快。」下列評估何者合理？`,"說法不完整，高溫可能破壞酵素構造使速率下降",["說法完全正確，因為前三組都上升","65°C 的資料一定要刪除","酵素反應和溫度完全無關"],
          "前三組上升不代表所有溫度都上升；65°C 的異常可能有生物構造原因。",
          "不要只看部分數據，要解釋整體趨勢與轉折。")),
        factory("天體軌跡判讀", () => capQ("自然","hard","地科圖表判讀","太陽視運動圖文字描述",`某地夏至與冬至的太陽路徑比較：夏至太陽升得較高、白天較長；冬至太陽高度較低、白天較短。\n\n下列推論何者合理？`,"太陽高度與日照時間會影響季節感受與地表受熱",["冬至太陽高度較低，所以地球停止自轉","夏至白天較長代表一年只有夏天","太陽路徑變化與季節完全無關"],
          "太陽高度與日照長短會影響接收能量，這是季節差異的重要因素。",
          "把太陽高度、日照時間和受熱量連起來想。")),
        factory("實驗設計改良", () => capQ("自然","hard","探究：實驗設計改良","防曬材料測試",`學生想比較三種布料阻擋紫外線的效果，但每種布料厚度不同、照射距離不同、測量時間也不同。若要改良實驗，最重要的是？`,"一次只改變布料種類，其他條件盡量相同",["每組都使用不同距離讓結果更豐富","只測一次就能代表所有情況","把紫外線感測器放在不同角度比較有趣"],
          "要比較布料種類，就需控制厚度、距離、時間等其他因素，否則無法判斷主因。",
          "先決定你要比較的因素，其他條件就要盡量固定。"))
      ]
    },

    "社會": {
      easy: [
        factory("地圖座標", () => capQ("社會","easy","地理圖網座標","校園簡圖文字描述",`校園地圖以方格表示。圖書館位於 B2，操場位於 B4，兩者在同一欄。若從圖書館前往操場，主要方向為何？`,"沿同一欄往數字較大的方向移動",["先換到 C 欄再往回走","兩地在同一格","必須跨越所有欄位"],
          "B2 到 B4 欄位相同、數字變大，表示沿同一欄移動。",
          "先看字母欄，再看數字列的變化。")),
        factory("權利與限制", () => capQ("社會","easy","公民：權利限制","校園公共生活",`學生有表達意見的自由，但若在網路散布未查證謠言造成他人恐慌，可能需負責。這說明什麼？`,"權利行使也需尊重他人權益與公共秩序",["言論自由完全不存在","只要是網路發言就不用負責","所有意見都必須相同"],
          "自由受保障，但不是無限制。散布不實訊息可能傷害他人與公共秩序。",
          "思考權利和責任是否能分開。")),
        factory("歷史因果", () => capQ("社會","easy","歷史變遷因果","港口城市發展",`某港口因貿易興盛，外國商人、商品與新觀念進入當地。下列影響何者較合理？`,"促進文化交流與社會變遷",["使當地完全沒有外來影響","讓所有農業立刻消失","使城市永遠不再改變"],
          "貿易帶來人與物的流動，也可能帶來文化與制度變化。",
          "想想港口貿易會帶來哪些交流。")),
        factory("媒體識讀", () => capQ("社會","easy","媒體識讀","社群貼文查證",`某貼文聲稱：「某政策一定讓所有家庭受害。」但沒有來源，也沒有資料。最合適的做法是？`,"查證來源並比較不同資料",["立刻轉傳給所有群組","只看標題就相信","因為很誇張所以一定正確"],
          "公共議題需查證來源與證據，不能只靠情緒化標題。",
          "問自己：這則訊息的來源與證據在哪裡？"))
      ],
      normal: [
        factory("氣候變遷政策", () => capQ("社會","normal","地理與公共政策","沿海城市防災",`某沿海城市豪雨淹水增加。政府規定低窪區新建房屋需提高地基，並提供搬遷補助與公聽會。下列評估何者較合理？`,"政策同時考量防災、財產限制與居民參與",["只要防災就不需補助與公聽會","財產權存在所以政府完全不能限制土地使用","所有居民都必須無條件搬離"],
          "公共政策需在安全、權利、程序與補償間取得平衡。",
          "看政策是否只有限制，還是也有配套與程序。")),
        factory("歷史資料判讀", () => capQ("社會","normal","史料判讀","地方史訪談",`研究某事件時，學生只採用一位當事人的回憶錄。老師提醒還要比對報紙、官方文件與其他訪談。主要原因是什麼？`,"單一史料可能有立場或記憶偏差，需要交叉比對",["回憶錄一定都是假的","官方文件一定完全客觀","只要資料越舊就越正確"],
          "史料可能受立場、記憶與目的影響，因此要多方比對。",
          "想想不同來源可能看到同一事件的不同面向。")),
        factory("供需情境", () => capQ("社會","normal","經濟：供需價格","口罩販售情境",`某地空氣品質惡化期間，口罩需求突然增加，但短期供給量不變。若未有價格管制，價格最可能如何變化？`,"可能上升",["一定下降","一定維持不變","需求增加會使商品消失"],
          "需求增加而供給短期不變，價格通常有上升壓力。",
          "分辨需求改變與供給改變。")),
        factory("法律比例原則", () => capQ("社會","normal","公民：法律限制","校園集會規範",`學生可申請在中庭表達訴求，但學校規定不得阻塞逃生通道，並需事先安排動線。此規定最能說明什麼？`,"表達自由可受合理限制以維護公共安全",["學校完全禁止學生表達意見","逃生通道只在地震時才重要","公共安全不需要法律或規範"],
          "自由可以表達，但需避免危及安全，這是合理限制的概念。",
          "看規定是否針對安全目的，而非任意禁止。"))
      ],
      hard: [
        factory("國際公約與政策", () => capQ("社會","hard","全球議題與國際公約","氣候變遷政策比較",`某國承諾減碳，但國內部分產業擔心成本上升。政府提出：補助節能設備、逐年提高排放標準、協助勞工轉職。下列評估何者最周延？`,"政策嘗試在國際責任、產業調適與勞工權益間取得平衡",["只要簽了國際公約就不需考慮國內影響","產業成本上升就代表不應減碳","減碳政策只和自然環境有關，與勞工無關"],
          "精熟題要兼顧多方價值：環境、經濟、工作權與國際責任。",
          "不要只站在單一立場，找能整合多面向的選項。")),
        factory("地理圖網與災害", () => capQ("社會","hard","地理圖網與防災判讀","防災地圖",`防災地圖顯示：A3 為低窪淹水區，A4 為學校，B4 為臨時避難所，C4 為主要道路。若豪雨時 A3 已封閉，下列安排何者較合理？`,"從學校往 B4 避難所移動，避開 A3 低窪區",["先前往 A3 查看積水再決定","所有人往低窪區集合","因為 A4 和 A3 相鄰，所以避難所不存在"],
          "地圖判讀需結合座標位置與災害資訊，避開封閉低窪區。",
          "先找危險格，再找相對安全的移動方向。")),
        factory("公民法律界線", () => capQ("社會","hard","公民：權利與法律界線","社群平台與隱私",`學生在社群公開同學照片並加上嘲笑文字，主張自己有言論自由。若從權利界線判斷，下列何者合理？`,"言論自由不代表可以侵害他人隱私與人格權",["只要是自己的帳號就能發布任何內容","被拍者沒有任何權利","嘲笑文字只要有趣就不需負責"],
          "權利行使不得侵害他人權利。照片與嘲笑文字涉及隱私、名譽與人格尊重。",
          "把自己的自由和他人的權利放在一起衡量。")),
        factory("歷史變遷多因", () => capQ("社會","hard","歷史變遷因果","城市產業轉型",`某城市早期因煤礦興盛而發展，後來因能源政策、礦源枯竭與交通改變，轉向觀光與文化產業。下列分析何者較合理？`,"產業轉型通常由資源、政策與交通等多重因素共同造成",["只要礦源枯竭，城市一定消失","觀光發展和歷史記憶完全無關","能源政策不可能影響地方產業"],
          "歷史變遷常由多種因素交互作用，不宜只用單一原因解釋。",
          "找出題幹列出的多個變因，判斷它們如何共同影響。"))
      ]
    }
  };


  const V48_MATH_EXTRA = {
    easy: [
      factory("整數四則", () => {
        const a = rnd(12, 35), b = rnd(6, 18), c = rnd(2, 6);
        return q("數學","easy","整數四則",
          `計算 ${a} + ${b} × ${c} 的值為何？`,
          a + b*c,
          [(a+b)*c, a*b+c, a+b+c],
          "先乘除後加減，所以先算乘法，再加上前面的數。");
      }),
      factory("分數基礎", () => {
        const d = rnd(4, 9), n = rnd(1, d-1);
        return q("數學","easy","分數基礎",
          `一條繩子平均分成 ${d} 等分，取其中 ${n} 等分，佔全長多少？`,
          `${n}/${d}`,
          [`${d}/${n}`, `${n}/${d-n}`, `${d-n}/${d}`],
          "分母表示總等分數，分子表示取走的等分數。");
      }),
      factory("簡單方程", () => {
        const x = rnd(3, 12), a = rnd(2, 5), b = rnd(5, 20);
        return q("數學","easy","簡單方程",
          `若 ${a}x + ${b} = ${a*x+b}，則 x = ?`,
          x,
          [x+1, x-1, a*x],
          `先移項得 ${a}x=${a*x}，再除以 ${a}，所以 x=${x}。`);
      }),
      factory("百分比基礎", () => {
        const p = rnd(200, 900), r = [10,20,25,50][rnd(0,3)];
        return q("數學","easy","百分比基礎",
          `${p} 元的 ${r}% 是多少元？`,
          Math.round(p*r/100),
          [Math.round(p/r), p+r, Math.round(p*(100-r)/100)],
          `${r}% 表示除以 100 後乘以 ${r}。`);
      })
    ],
    normal: [
      factory("二步方程式", () => {
        const x = rnd(4, 15), a = rnd(2, 6), b = rnd(3, 12), c = a*x-b;
        return q("數學","normal","二步方程式",
          `若 ${a}x - ${b} = ${c}，則 x = ?`,
          x,
          [x+b, Math.round(c/a), x-1],
          `移項得 ${a}x=${c+b}，所以 x=${x}。`);
      }),
      factory("比例應用", () => {
        const a = rnd(3, 7), b = rnd(5, 11), k = rnd(6, 14);
        return q("數學","normal","比例應用",
          `甲、乙兩數比為 ${a}:${b}，且兩數和為 ${(a+b)*k}，甲數為何？`,
          a*k,
          [b*k, (a+b)*k, Math.round((a+b)*k/a)],
          `總共 ${a+b} 份，每份 ${k}，甲為 ${a} 份，所以是 ${a*k}。`);
      }),
      factory("折扣與加價", () => {
        const price = rnd(500, 1800), off = [10,15,20][rnd(0,2)], fee = rnd(20,80);
        return q("數學","normal","折扣與加價",
          `一件商品 ${price} 元，打 ${100-off} 折後再加運費 ${fee} 元，總共要付多少？`,
          Math.round(price*(100-off)/100 + fee),
          [Math.round((price+fee)*(100-off)/100), Math.round(price*(100-off)/100), price-off+fee],
          "要先算商品折扣後價格，再加上運費。");
      }),
      factory("平均數變化", () => {
        const avg = rnd(65, 85), n = rnd(4, 8), newScore = rnd(80, 100);
        return q("數學","normal","平均數變化",
          `${n} 次測驗平均 ${avg} 分，若第 ${n+1} 次得 ${newScore} 分，新的平均為何？`,
          Math.round((avg*n+newScore)/(n+1)*10)/10,
          [Math.round((avg+newScore)/2*10)/10, avg+newScore, Math.round((avg*n)/(n+1)*10)/10],
          `原本總分是 ${avg}×${n}，加上新分數後再除以 ${n+1}。`);
      }),
      factory("機率補集", () => {
        const red = rnd(3, 8), blue = rnd(4, 10), green = rnd(2, 7);
        const total = red + blue + green;
        return q("數學","normal","機率補集",
          `袋中有紅球 ${red} 顆、藍球 ${blue} 顆、綠球 ${green} 顆。隨機抽 1 顆，不是紅球的機率為何？`,
          frac(blue+green, total),
          [frac(red,total), frac(red+blue,total), frac(green,total)],
          "不是紅球包含藍球和綠球，所以有利情形是藍球加綠球。");
      })
    ],
    hard: [
      factory("多步建模", () => {
        const people = rnd(6, 12), ticket = rnd(180, 320), drink = rnd(25, 55), budget = rnd(1800, 4200);
        const maxSnack = Math.max(0, Math.floor((budget - people*(ticket+drink))/60));
        return q("數學","hard","多步建模",
          `${people} 人看電影，每人都買 ${ticket} 元票與 ${drink} 元飲料，剩下預算最多可買每份 60 元點心幾份？總預算 ${budget} 元。`,
          maxSnack,
          [maxSnack+1, Math.max(0,maxSnack-1), Math.floor(budget/60)],
          "先扣除每人的票與飲料，再用剩餘預算除以點心單價並取整數。");
      }),
      factory("函數判讀", () => {
        const m = rnd(3, 8), b = rnd(10, 30), x = rnd(5, 12);
        return q("數學","hard","函數判讀",
          `某計程車費用可用 y=${m}x+${b} 表示，其中 x 為公里數。若實付 ${m*x+b} 元，搭乘距離為多少公里？`,
          x,
          [x+1, Math.round((m*x+b)/m), m*x],
          `代入費用後解方程：${m}x+${b}=${m*x+b}，所以 x=${x}。`);
      }),
      factory("反向百分比", () => {
        const original = rnd(400, 1200), rate = [10,20,25][rnd(0,2)];
        const sale = Math.round(original*(100-rate)/100);
        return q("數學","hard","反向百分比",
          `某商品打 ${100-rate} 折後為 ${sale} 元，原價為何？`,
          original,
          [Math.round(sale*(100-rate)/100), sale+rate, Math.round(sale/(rate/100))],
          `打 ${100-rate} 折表示乘以 ${(100-rate)/100}，所以原價 = 售價 ÷ ${(100-rate)/100}。`);
      }),
      factory("幾何綜合", () => {
        const l = rnd(10, 20), w = rnd(5, 12), add = rnd(2, 6);
        return q("數學","hard","幾何綜合",
          `長方形長 ${l}、寬 ${w}。若長增加 ${add}、寬減少 ${add-1}，新面積比原面積多多少？`,
          (l+add)*(w-(add-1)) - l*w,
          [(l+add)*(w-(add-1)), l*w, 2*(l+w)],
          "先算新面積，再減去原面積；不能只比較周長。");
      }),
      factory("數列推理", () => {
        const a = rnd(2, 8), d1 = rnd(2, 5), d2 = rnd(1, 4);
        const terms = [a];
        let diff = d1;
        for(let i=1;i<5;i++){ terms.push(terms[i-1]+diff); diff += d2; }
        return q("數學","hard","數列推理",
          `觀察數列 ${terms.slice(0,4).join("，")}，若相鄰兩項的差每次增加 ${d2}，下一項為何？`,
          terms[4],
          [terms[3]+d1, terms[4]+d2, terms[3]*2],
          "先看相鄰差，再發現差值每次增加固定數。");
      })
    ]
  };

  if(typeof EXTRA_GEN !== "undefined"){
    EXTRA_GEN["數學"].easy = V48_MATH_EXTRA.easy.concat(EXTRA_GEN["數學"].easy || []);
    EXTRA_GEN["數學"].normal = V48_MATH_EXTRA.normal.concat(EXTRA_GEN["數學"].normal || []);
    EXTRA_GEN["數學"].hard = V48_MATH_EXTRA.hard.concat(EXTRA_GEN["數學"].hard || []);
  }


  // v59 CEEC-style expanded question bank.
  // These are original, dynamic questions modeled on common Comprehensive Assessment Program question types:
  // reading inference, evidence selection, data interpretation, experiment variables, math modeling, civic/map reasoning.
  const V59_CEEC_EXTRA = {
    "國文": {
      easy: [
        factory("詞義語境", () => {
          const item = pick([
            ["他聽完解釋後，終於「釋懷」了。", "不再放在心上", ["把東西放進懷裡", "立刻感到害怕", "開始責怪別人"]],
            ["她做事一向「謹慎」，很少匆忙決定。", "小心仔細", ["非常吵鬧", "故意拖延", "完全不在意"]],
            ["這場比賽雖然輸了，大家仍互相「鼓舞」。", "給彼此信心", ["互相責罵", "一起沉默", "故意逃避"]]
          ]);
          return q("國文","easy","詞義語境",`句子：「${item[0]}」其中加引號的詞語意思最接近何者？`,item[1],item[2],"先看前後文，判斷詞語在句中的意思。");
        }),
        factory("句意直接理解", () => {
          const item = pick([
            ["阿哲把雨衣借給忘記帶傘的同學，自己冒雨跑回教室。", "阿哲把雨衣借給同學", ["阿哲向同學借雨衣", "同學把雨衣丟掉", "老師要求大家回家"]],
            ["校工把操場積水掃開，讓低年級學生能安全通過。", "校工清除積水", ["學生把操場弄濕", "校工停止上班", "低年級學生打掃教室"]],
            ["奶奶把舊衣改成袋子，讓它繼續被使用。", "奶奶把舊衣再利用", ["奶奶買了新衣", "袋子被丟掉", "衣服不能再用"]]
          ]);
          return q("國文","easy","句意直接理解",`短文：「${item[0]}」下列何者符合文意？`,item[1],item[2],"簡單閱讀題可直接從句子中找答案。");
        }),
        factory("連接詞判斷", () => {
          const item = pick([
            ["天色越來越暗，＿＿大家加快腳步下山。", "所以", ["然而", "如果", "雖然"], "前句是原因，後句是結果。"],
            ["他已經很累，＿＿仍把最後一題完成。", "但是", ["因為", "所以", "並且"], "前後意思有轉折。"],
            ["＿＿明天颱風來襲，活動就會延期。", "如果", ["因此", "不過", "此外"], "句子表示假設條件。"]
          ]);
          return q("國文","easy","連接詞判斷",item[0],item[1],item[2],item[3]);
        }),
        factory("修辭辨識", () => {
          const item = pick([
            ["午後的陽光像金色的河流，流進教室。", "譬喻", ["排比", "引用", "頂真"]],
            ["風一遍又一遍地敲著窗，好像在催人出門。", "擬人", ["對偶", "設問", "層遞"]],
            ["他跑得比兔子還快。", "誇飾", ["引用", "映襯", "倒裝"]]
          ]);
          return q("國文","easy","修辭辨識",`句子：「${item[0]}」主要使用哪一種修辭？`,item[1],item[2],"先判斷句子是比喻、把物當人寫，或故意放大程度。");
        }),
        factory("成語語境", () => {
          const item = pick([
            ["班長原本做錯決定，後來立刻修正並補救。", "亡羊補牢", ["畫蛇添足", "守株待兔", "杯弓蛇影"]],
            ["報告已經很完整，他又硬加一段無關內容，反而讓重點模糊。", "畫蛇添足", ["雪中送炭", "刻舟求劍", "水落石出"]],
            ["他只想等好運自己上門，卻不願練習。", "守株待兔", ["聞雞起舞", "雪上加霜", "一石二鳥"]]
          ]);
          return q("國文","easy","成語語境",`情境：「${item[0]}」最適合用哪個成語形容？`,item[1],item[2],"成語題要把情境和成語核心意思對起來。");
        }),
        factory("標點功能", () => q("國文","easy","標點功能","句子：「他說：『這次換我來試試看。』」其中冒號的主要功能是？","引出後面說的話",["表示句子結束", "表示反問語氣", "表示省略內容"],"冒號常用來引出說話、說明或列舉內容。"))
      ],
      normal: [
        factory("短文主旨", () => {
          const item = pick([
            ["社區原本只有一片荒地，居民一起整理、種菜、設置長椅。幾個月後，原本互不熟悉的人開始聊天，也有人主動照顧菜園。", "共同參與能凝聚社區情感", ["種菜一定能賺很多錢", "荒地不應該被整理", "長椅是社區唯一重點"]],
            ["小安每天只背答案，遇到變化題就慌張；後來他改成整理錯因，反而進步更快。", "理解錯因比死背答案更能幫助學習", ["只要背答案就能應付所有題目", "遇到變化題一定要放棄", "成績進步和方法無關"]],
            ["手機讓聯絡變得快速，但也讓人習慣立即回覆。作者提醒，方便之餘仍需要保留獨處與思考的時間。", "科技便利需要搭配自我節制", ["作者完全反對手機", "作者主張永遠不能回訊息", "科技只帶來好處"]]
          ]);
          return q("國文","normal","短文主旨",`短文：「${item[0]}」最適合的主旨是？`,item[1],item[2],"主旨題要找全文共同指向，不要只抓單一細節。");
        }),
        factory("語氣與態度", () => {
          const item = pick([
            ["他說自己最重視環保，卻每天買三杯一次性飲料。作者寫這句話主要帶有何種語氣？", "反諷", ["真誠讚美", "客觀列舉", "單純道歉"]],
            ["『你當然可以繼續把鬧鐘按掉，然後再說時間不夠。』這句話的語氣最接近？", "帶有提醒與諷刺", ["完全同意對方", "單純描述天氣", "誠懇邀請出遊"]],
            ["作者說：『一座城市的美，不只在高樓，也在願意停下來等人的紅綠燈。』其態度較接近？", "重視生活中的體貼與秩序", ["只稱讚高樓高度", "反對所有交通規則", "認為城市不需要人情"]]
          ]);
          return q("國文","normal","語氣與態度",item[0],item[1],item[2],"語氣題要看言外之意，特別注意言行矛盾、誇張或提醒。");
        }),
        factory("文句排序", () => {
          const item = pick([
            [["甲、於是他開始每天記下錯題原因。","乙、第一次模擬考後，他發現自己不是不會，而是常漏看條件。","丙、幾週後，他看到題目時會先圈出關鍵字。","丁、這個小習慣讓他的失誤慢慢減少。"], "乙甲丙丁"],
            [["甲、這條老街曾因商店歇業而冷清。","乙、青年回鄉後，把空屋改成展覽與工作坊。","丙、遊客開始因活動而停留。","丁、老街也重新有了人聲。"], "甲乙丙丁"],
            [["甲、他原本害怕在眾人面前說話。","乙、老師讓他先從小組分享開始。","丙、幾次練習後，他能完整說出自己的想法。","丁、舞臺並沒有變小，是他的勇氣變大了。"], "甲乙丙丁"]
          ]);
          const lines = item[0].join("\n");
          return q("國文","normal","文句排序",`下列句子組成一段通順短文，最適合的順序為何？\n${lines}`,item[1],["甲丙乙丁","乙丙甲丁","丁甲乙丙"],"排序題要先找起點，再看因果、時間或總結句。");
        }),
        factory("證據選擇", () => {
          const item = pick([
            ["運動能幫助學生調節壓力", "研究顯示規律運動的學生自評壓力較低", ["操場跑道是紅色的", "有些運動鞋價格很高", "下雨時不能打籃球"]],
            ["閱讀不同觀點能培養判斷力", "學生比較兩篇立場不同的文章後，更能說明理由", ["圖書館有很多桌椅", "書本的封面顏色不同", "閱讀時間都安排在下午"]],
            ["共同討論能改善方案品質", "小組修改報告後，原本遺漏的資料被補上", ["討論室有冷氣", "報告字體大小一致", "大家都使用同一種筆"]]
          ]);
          return q("國文","normal","論點與證據",`若要支持「${item[0]}」這個論點，下列何者最適合作為證據？`,item[1],item[2],"證據必須直接支持論點，不能只是相關但無法證明。");
        }),
        factory("語境詞義", () => {
          const item = pick([
            ["那句批評在他心中「沉澱」幾天後，反而變成修正自己的力量。", "想法逐漸整理清楚", ["水中的泥沙真的下沉", "心情立刻完全消失", "聲音變得更大"]],
            ["這座城市的記憶，藏在巷口的招牌與老人家的閒談裡。", "地方文化與過去經驗", ["電腦硬碟容量", "只有招牌的價格", "老人家的年齡"]],
            ["他把失敗「拆開」來看，才發現問題不只在答案，而在讀題方式。", "分析失敗的原因", ["把紙張撕碎", "把桌子拆掉", "拒絕再學習"]]
          ]);
          return q("國文","normal","語境詞義",`句子：「${item[0]}」其中加引號或關鍵語意最接近何者？`,item[1],item[2],"語境詞義要看抽象用法，不能只用字面意思判斷。");
        }),
        factory("文言句意", () => {
          const item = pick([
            ["知不足而後能自反也", "知道自己的不足，才會反省改進", ["知道很多就不用學習", "反省只會造成退步", "不足表示不能吃飽"]],
            ["學而不思則罔，思而不學則殆", "學習與思考應互相配合", ["只要背書不用思考", "只思考就能懂一切", "學習一定危險"]],
            ["良藥苦口利於病，忠言逆耳利於行", "有益的勸告可能聽來不順耳", ["藥越苦越不能喝", "所有批評都沒有幫助", "耳朵痛就不能行動"]]
          ]);
          return q("國文","normal","文言句意",`「${item[0]}」大意最接近何者？`,item[1],item[2],"文言題先抓關鍵詞，再轉成現代語意。");
        })
      ],
      hard: [
        factory("雙文本統整", () => {
          const item = pick([
            ["甲文認為網路讓知識取得更方便；乙文提醒，快速取得資料不等於真正理解。", "資訊取得容易，但仍需判斷與消化", ["兩文都主張不要使用網路", "乙文認為資料越多理解越深", "甲文完全否定學習"]],
            ["甲文說旅行能拓展視野；乙文說若只忙著拍照打卡，反而可能錯過體驗。", "旅行的價值在於真正觀察與感受", ["旅行一定沒有意義", "拍照永遠是錯的", "視野只靠照片拓展"]],
            ["甲文強調規則維持秩序；乙文提醒，規則也應隨情境調整。", "規則需要兼顧秩序與彈性", ["規則完全不需要存在", "秩序與彈性必然衝突", "所有規則都不能改"]]
          ]);
          return q("國文","hard","雙文本統整",`閱讀兩段文字：「${item[0]}」綜合兩文，最恰當的觀點是？`,item[1],item[2],"雙文本題要找兩文互補或衝突後的共同結論。");
        }),
        factory("論證缺口", () => {
          const item = pick([
            ["某校三位學生使用平板後成績進步，因此有人主張所有學生只要使用平板，成績一定會進步。", "樣本過少且忽略其他可能因素", ["完全沒有提出任何例子", "結論比前提更保守", "平板不能用來閱讀"]],
            ["某人說：『這家店排隊很長，所以食物一定最健康。』", "把人氣直接等同於健康，推論不足", ["排隊代表完全沒有人買", "健康一定與食物無關", "店家不能販售食物"]],
            ["某文章說：『我不喜歡這位作者，所以他的所有觀點都錯。』", "以個人好惡否定論點，未檢驗內容", ["作者一定沒有寫文章", "觀點已被充分證明", "文章沒有任何立場"]]
          ]);
          return q("國文","hard","論證缺口",`下列推論有何主要問題？「${item[0]}」`,item[1],item[2],"論證題要檢查前提能不能充分推出結論。");
        }),
        factory("敘事觀點", () => q("國文","hard","敘事觀點","小說以主角第一人稱敘述，但其他角色的反應常顯示主角誤解情況。閱讀時最應注意什麼？","敘事者觀點有限，需綜合其他線索",["第一人稱必定完全客觀", "其他角色的反應都可忽略", "只要看主角說法就能確定真相"],"第一人稱敘事可能帶有偏見或資訊不足。")),
        factory("象徵與意象", () => {
          const item = pick([
            ["文章結尾寫：『窗外的雨停了，但桌上的信仍沒有寄出。』若前文寫人物猶豫道歉，這封信最可能象徵？", "尚未說出口的歉意與猶豫", ["郵局一定關門", "天氣變好就沒事", "信紙品質不好"]],
            ["人物離鄉多年後回到老屋，發現門前小樹已長成濃蔭。這棵樹較可能象徵？", "時間累積與故鄉記憶", ["樹木價格上升", "老屋必須拆除", "人物討厭植物"]],
            ["詩中反覆出現『未熄的燈』，若內容寫人在困境中等待消息，燈較可能象徵？", "仍未放棄的希望", ["電費增加", "白天太亮", "燈泡壞掉"]]
          ]);
          return q("國文","hard","象徵判讀",item[0],item[1],item[2],"象徵題要連結前文情境與物象的抽象意義。");
        }),
        factory("文言推論", () => q("國文","hard","文言推論","「求木之長者，必固其根本；欲流之遠者，必浚其泉源。」最可延伸為何種觀點？","想要長遠發展，必須先打好根基",["只要樹很高就不需根", "水流越遠越不需要源頭", "做事只看結果不看基礎"],"由樹根與水源比喻基礎的重要。")),
        factory("寫作手法", () => q("國文","hard","寫作手法","某文前段寫城市夜晚燈火明亮，後段寫行人各自低頭滑手機，彼此無話。作者這樣安排最可能是為了？","以外在熱鬧對比人際疏離",["證明燈越亮人越快樂", "單純介紹照明設備", "表示行人都迷路"],"前後景象形成對比，凸顯主題。"))
      ]
    },

    "英文": {
      easy: [
        factory("Basic vocabulary", () => {
          const item = pick([
            ["I forgot my umbrella, so I got ____ in the rain.", "wet", ["early","quiet","round"], "Rain makes people wet."],
            ["The room is dark. Please turn on the ____.", "light", ["pencil","river","bread"], "A light makes a dark room brighter."],
            ["Amy is hungry. She wants to ____ something.", "eat", ["sleep","draw","throw"], "Hungry means wanting food."]
          ]);
          return q("英文","easy","Basic vocabulary",item[0],item[1],item[2],item[3]);
        }),
        factory("Pronoun", () => q("英文","easy","Pronoun","Kevin lost his notebook. Lisa found it and gave it back to ____.", "him", ["her","them","it"], "Kevin is male and receives the notebook, so use him.")),
        factory("Verb form", () => q("英文","easy","Verb form","My sister usually ____ milk before school.", "drinks", ["drink","drinking","to drink"], "A third-person singular subject in the present tense takes -s.")),
        factory("Preposition", () => q("英文","easy","Preposition","The keys are ____ the table, not under it.", "on", ["in","after","with"], "Keys can be on a table; the sentence contrasts with under.")),
        factory("Plural noun", () => q("英文","easy","Plural noun","There are five ____ in the classroom.", "chairs", ["chair","chairing","chaired"], "Five means plural, so use chairs."))
      ],
      normal: [
        factory("Notice reading", () => {
          const item = pick([
            ["Library Notice: Please return books by Friday. Books returned late will have a small fine.", "Students should return books on time.", ["Students can keep books forever.", "The library is closed on Friday.", "Late books are free."]],
            ["Science Camp: Bring lunch and a notebook. Water will be provided.", "Students do not need to bring water.", ["Students must bring water.", "Lunch will be provided.", "Notebooks are not allowed."]],
            ["Club Meeting: The meeting is moved from Room 204 to Room 302 because the projector in Room 204 is broken.", "The room changes because of equipment trouble.", ["Room 302 has no projector.", "The meeting is canceled.", "Students broke their notebooks."]]
          ]);
          return q("英文","normal","Notice reading",item[0] + " What does the notice mean?", item[1], item[2], "Read the purpose and details of the notice, not just one keyword.");
        }),
        factory("Dialogue inference", () => {
          const item = pick([
            ["Mia: I thought the bus would come at 7:20.\nBen: It did, but you arrived at 7:25.", "Mia missed the bus.", ["Ben arrived late.", "The bus never came.", "Mia drove the bus."]],
            ["Clerk: This ticket is for tomorrow, not today.\nCustomer: Oh, I checked the date too quickly.", "The customer made a mistake about the date.", ["The clerk changed the date.", "The ticket is free.", "The customer cannot read time."]],
            ["Teacher: Your answer is correct, but you need to show how you got it.\nStudent: I see. I only wrote the number.", "The teacher wants the student to explain the steps.", ["The number is wrong.", "The student wrote too much.", "The teacher lost the paper."]]
          ]);
          return q("英文","normal","Dialogue inference",`Read the dialogue:\n${item[0]}\nWhat can we infer?`,item[1],item[2],"Inference questions require understanding what happened between the lines.");
        }),
        factory("Cloze context", () => {
          const item = pick([
            ["The road was closed after the heavy rain, so we had to take another ____.", "route", ["price","sound","ticket"], "A route is a way to go somewhere."],
            ["Jack practiced every day. ____, he was able to play the song well.", "Finally", ["However","Before","Never"], "The second sentence is the result after practice."],
            ["The museum asks visitors not to take photos. This rule is used to ____ the paintings.", "protect", ["borrow","forget","hide"], "Museums protect paintings by limiting photos."]
          ]);
          return q("英文","normal","Cloze context",`Choose the best word: ${item[0]}`, item[1], item[2], "Use the whole sentence to decide the missing word.");
        }),
        factory("Main idea", () => q("英文","normal","Main idea","Many students use phones to study words. However, if they check messages every few minutes, they may remember less. The paragraph mainly says that ____.", "phones can help learning, but distractions should be controlled", ["phones are never useful for learning", "students should only read paper books", "messages always improve memory"], "The paragraph gives both the benefit and the problem.")),
        factory("Purpose", () => q("英文","normal","Purpose","A poster says: 'Bring your own cup. Get NT$5 off each drink. Help reduce waste.' What is the main purpose of the poster?", "to encourage people to use reusable cups", ["to sell more plastic cups", "to ask people to stop drinking", "to announce a school test"], "The discount and waste reduction point to reusable cups."))
      ],
      hard: [
        factory("Tone and irony", () => q("英文","hard","Tone and irony","A student says, 'Great, the app saved me so much time that I spent the whole night learning how to use it.' What is the tone?", "ironic", ["deeply thankful without complaint", "scientific and neutral", "romantic"], "The statement contrasts saving time with spending the whole night, creating irony.")),
        factory("Two-step inference", () => q("英文","hard","Two-step inference","Notice: 'The 3:30 train will not stop at Green Station today. Passengers for Green Station should get off at Lake Station and take Bus 12.' Which passenger needs to change plans?", "a passenger taking the 3:30 train to Green Station", ["a passenger going to Lake Station", "a passenger taking Bus 12 from home", "a passenger on a train tomorrow"], "The notice only affects the 3:30 train and Green Station passengers today.")),
        factory("Paragraph organization", () => q("英文","hard","Paragraph organization","Sentence A: 'First, they collect food waste from restaurants.' Sentence B: 'Then, the waste is turned into compost for farms.' Sentence C: 'This system reduces trash and helps grow vegetables.' Which order is best?", "A-B-C", ["C-A-B","B-C-A","A-C-B"], "The process starts with collection, then treatment, then result.")),
        factory("Author's attitude", () => q("英文","hard","Author's attitude","The writer says, 'A city is not smart simply because it has many screens; it is smart when technology helps people live better.' What is the writer's attitude?", "Technology should serve people's needs.", ["Screens are the only sign of progress.", "Cities should avoid all technology.", "People should live only online."], "The writer values the purpose of technology, not technology itself.")),
        factory("Conditional reasoning", () => q("英文","hard","Conditional reasoning","Rule: Students who finish the reading task may join the game. Students who do not finish it must stay for review. Alex joined the game. What is most likely true?", "Alex finished the reading task.", ["Alex skipped the task.", "Alex must stay for review.", "The game was canceled."], "Joining the game is allowed after finishing the reading task."))
      ]
    },

    "數學": {
      easy: [
        factory("整數與運算順序", () => {
          const a=rnd(8,30), b=rnd(3,9), c=rnd(2,7);
          return q("數學","easy","整數與運算順序",`計算 ${a} - ${b} × ${c} 的值為何？`, a-b*c, [(a-b)*c, a*b-c, a-b+c], "先算乘法，再做減法。");
        }),
        factory("分數與比例", () => {
          const d=rnd(5,12), n=rnd(1,4);
          return q("數學","easy","分數與比例",`一盒餅乾平均分成 ${d} 份，小安吃了 ${n} 份，剩下多少比例？`, frac(d-n,d), [frac(n,d), frac(d,d-n), frac(n,d-n)], "剩下份數是總份數減掉吃掉的份數。");
        }),
        factory("周長基礎", () => {
          const l=rnd(6,16), w=rnd(3,10);
          return q("數學","easy","周長基礎",`長方形長 ${l} 公分、寬 ${w} 公分，周長是多少公分？`, 2*(l+w), [l*w, l+w, 2*l+w], "長方形周長 = 2×(長+寬)。");
        }),
        factory("一元一次式", () => {
          const x=rnd(2,12), a=rnd(2,6), b=rnd(1,10);
          return q("數學","easy","一元一次式",`若 ${a}x + ${b} = ${a*x+b}，則 x = ?`, x, [x+1, x-1, a*x+b], "移項後再除以係數。");
        }),
        factory("資料判讀入門", () => {
          const a=rnd(12,24), b=a+rnd(3,12), c=b-rnd(1,5);
          return q("數學","easy","資料判讀入門",`甲班三天回收量分別為 ${a}、${b}、${c} 公斤，哪一天最多？`, "第二天", ["第一天","第三天","三天一樣"], "比較三個數字大小即可。");
        })
      ],
      normal: [
        factory("生活折扣", () => {
          const price=rnd(600,1800), off=pick([10,15,20,25]), fee=rnd(30,90);
          return q("數學","normal","生活折扣",`商品原價 ${price} 元，打 ${100-off} 折後再加運費 ${fee} 元，總價為何？`, Math.round(price*(100-off)/100+fee), [Math.round((price+fee)*(100-off)/100), Math.round(price*(100-off)/100), price-off+fee], "常見錯法是先加運費再打折，或忘記加運費。");
        }),
        factory("比例分配", () => {
          const a=rnd(2,5), b=rnd(3,7), k=rnd(8,20);
          return q("數學","normal","比例分配",`甲、乙兩人分配獎金，比例為 ${a}:${b}，若總金額為 ${(a+b)*k} 元，乙可得多少元？`, b*k, [a*k, (a+b)*k, Math.round((a+b)*k/b)], "總份數為甲乙份數和，先求每一份金額。");
        }),
        factory("平均數變化", () => {
          const n=rnd(4,8), avg=rnd(60,85), score=rnd(80,100);
          return q("數學","normal","平均數變化",`${n} 次小考平均 ${avg} 分，下一次得 ${score} 分，新的平均為何？`, Math.round((n*avg+score)/(n+1)*10)/10, [Math.round((avg+score)/2*10)/10, avg+score, Math.round(n*avg/(n+1)*10)/10], "平均數變化要先還原原本總分。");
        }),
        factory("機率補集", () => {
          const r=rnd(3,8), b=rnd(4,10), g=rnd(2,6), total=r+b+g;
          return q("數學","normal","機率補集",`袋中有紅球 ${r} 顆、藍球 ${b} 顆、綠球 ${g} 顆。任取一球，不是紅球的機率為何？`, frac(b+g,total), [frac(r,total), frac(r+b,total), frac(g,total)], "不是紅球包含藍球與綠球。");
        }),
        factory("座標距離", () => {
          const x1=rnd(-5,2), x2=x1+rnd(3,9);
          return q("數學","normal","座標距離",`數線上 A 點座標為 ${x1}，B 點座標為 ${x2}，AB 距離為何？`, x2-x1, [x1+x2, Math.abs(x1), Math.abs(x2)], "數線距離是兩座標差的絕對值。");
        }),
        factory("幾何面積", () => {
          const base=rnd(8,18), h=rnd(5,14);
          return q("數學","normal","幾何面積",`三角形底為 ${base} 公分，高為 ${h} 公分，面積為何？`, base*h/2, [base*h, base+h, 2*(base+h)], "三角形面積 = 底×高÷2。");
        }),
        factory("函數代入", () => {
          const m=rnd(2,6), b=rnd(3,12), x=rnd(3,10);
          return q("數學","normal","函數代入",`若 y=${m}x+${b}，當 x=${x} 時，y 為何？`, m*x+b, [m*(x+b), m+x+b, x+b], "把 x 的值代入後先乘再加。");
        })
      ],
      hard: [
        factory("多步情境建模", () => {
          const people=rnd(5,12), ticket=rnd(160,320), drink=rnd(25,60), budget=rnd(1800,5200);
          const left=budget-people*(ticket+drink);
          const ans=Math.max(0,Math.floor(left/70));
          return q("數學","hard","多步情境建模",`${people} 人看展，每人門票 ${ticket} 元、飲料 ${drink} 元。總預算 ${budget} 元，剩下最多可買每份 70 元點心幾份？`, ans, [ans+1, Math.max(0,ans-1), Math.floor(budget/70)], "先扣掉每人固定花費，再用剩餘預算除以點心單價並取整數。");
        }),
        factory("反向百分比", () => {
          const original=rnd(400,1600), rate=pick([10,20,25,30]), sale=Math.round(original*(100-rate)/100);
          return q("數學","hard","反向百分比",`某商品打 ${100-rate} 折後售價為 ${sale} 元，原價為何？`, original, [Math.round(sale*(100-rate)/100), sale+rate, Math.round(sale/(rate/100))], "打折後價格 = 原價×折扣比例，因此原價要用售價除以折扣比例。");
        }),
        factory("線型函數反推", () => {
          const m=rnd(3,8), b=rnd(10,40), x=rnd(5,16);
          return q("數學","hard","線型函數反推",`某方案費用 y=${m}x+${b}。若實付 ${m*x+b} 元，x 為多少？`, x, [Math.round((m*x+b)/m), x+1, m*x], "將費用代入方程式後解出 x。");
        }),
        factory("幾何變化", () => {
          const l=rnd(10,24), w=rnd(6,14), a=rnd(2,6), b=rnd(1,4);
          return q("數學","hard","幾何變化",`長方形長 ${l}、寬 ${w}。若長增加 ${a}、寬減少 ${b}，新面積比原面積多多少？`, (l+a)*(w-b)-l*w, [(l+a)*(w-b), l*w, 2*(l+w)], "要比較新舊面積，不能只算新面積或周長。");
        }),
        factory("數列規律", () => {
          const a=rnd(1,8), d1=rnd(2,5), inc=rnd(1,4);
          const arr=[a]; let d=d1;
          for(let i=1;i<5;i++){ arr.push(arr[i-1]+d); d += inc; }
          return q("數學","hard","數列規律",`觀察數列 ${arr.slice(0,4).join("、")}，若相鄰兩項的差每次增加 ${inc}，下一項為何？`, arr[4], [arr[3]+d1, arr[4]+inc, arr[3]*2], "先觀察相鄰差，再用差的規律推下一項。");
        }),
        factory("表格推論", () => {
          const a=rnd(20,40), b=a+rnd(5,15), c=b+rnd(5,15);
          return q("數學","hard","表格推論",`某校三週閱讀頁數為 ${a}、${b}、${c} 頁。若成長量維持相同，第四週預估為多少頁？`, c+(c-b), [c+(b-a), c, a+b+c], "先找最近兩週的成長量，再延伸到下一週。");
        }),
        factory("條件機率感", () => {
          const total=rnd(24,40), club=rnd(8,15), pass=rnd(12,20), both=rnd(4,Math.min(club,pass));
          return q("數學","hard","集合計數",`班上 ${total} 人，參加科學社 ${club} 人，通過檢定 ${pass} 人，兩者都有 ${both} 人。至少具備其中一項的人數為何？`, club+pass-both, [club+pass, total-both, pass-both], "使用包含排除：兩集合人數相加後，要扣掉重複計算的人。");
        })
      ]
    },

    "自然": {
      easy: [
        factory("物質狀態", () => q("自然","easy","物質狀態","冰塊放在室溫下一段時間後變成水，主要屬於何種變化？", "物理變化", ["化學變化","核反應","生物繁殖"], "只是狀態改變，物質仍是水。")),
        factory("力與運動", () => q("自然","easy","力與運動","推車時若用力方向和車子前進方向相同，通常會使車子如何？", "速度增加或開始前進", ["立刻消失","溫度降到零下","變成另一種物質"], "力可以改變物體的運動狀態。")),
        factory("電路基礎", () => q("自然","easy","電路基礎","簡單電路中，若開關未閉合，燈泡通常會如何？", "不亮", ["變得更亮","立刻燃燒","變成電池"], "開關未閉合時電路不通，電流無法形成完整迴路。")),
        factory("生物構造", () => q("自然","easy","生物構造","植物葉片主要進行光合作用，需要下列哪一項？", "光", ["沙子","鐵釘","塑膠袋"], "光合作用需要光能。")),
        factory("天氣觀察", () => q("自然","easy","天氣觀察","氣溫計主要用來測量什麼？", "溫度", ["風向","雨量","地震規模"], "氣溫計測量空氣溫度。"))
      ],
      normal: [
        factory("控制變因", () => q("自然","normal","控制變因","研究不同光照時間對豆苗高度的影響時，水量、土壤種類與溫度最好如何處理？", "保持相同", ["每組都故意不同","完全不記錄","只改變土壤顏色"], "要比較光照時間，就需控制其他可能影響生長的因素。")),
        factory("密度判斷", () => q("自然","normal","密度判斷","甲物體質量 40g、體積 20cm³；乙物體質量 45g、體積 15cm³。何者密度較大？", "乙", ["甲","兩者相同","資料不足"], "密度=質量÷體積，甲=2，乙=3。")),
        factory("酸鹼判斷", () => q("自然","normal","酸鹼判斷","某溶液 pH=3，另一溶液 pH=9。下列判斷何者正確？", "pH=3 的溶液較酸", ["pH=9 的溶液較酸","兩者酸鹼性相同","pH 數字越小越鹼"], "pH 小於 7 偏酸，大於 7 偏鹼。")),
        factory("能量轉換", () => q("自然","normal","能量轉換","手搖發電手電筒發亮時，主要能量轉換為何？", "動能轉成電能再轉成光能", ["光能直接變成食物","聲音變成質量","電能直接變成水"], "手搖提供運動能量，發電後讓燈泡發光。")),
        factory("生態關係", () => q("自然","normal","生態關係","若某地區昆蟲大量減少，主要以昆蟲為食的小鳥最可能受到什麼影響？", "食物來源減少，數量可能下降", ["立刻全部變成植物","完全不受影響","小鳥不再需要能量"], "食物鏈中一個族群改變會影響捕食者。")),
        factory("圖表趨勢", () => q("自然","normal","圖表趨勢","若圖表顯示水溫從 20°C 升到 60°C 時，某物質溶解量逐漸增加，最合理的敘述是？", "在此範圍內溫度越高，溶解量越大", ["溫度越高溶解量一定變小","20°C 與 60°C 完全相同","不能從圖表看出趨勢"], "依題目描述，溶解量隨溫度上升而增加。"))
      ],
      hard: [
        factory("實驗設計缺陷", () => q("自然","hard","實驗設計缺陷","某組想研究肥料對植物生長的影響，卻讓 A 組每天澆水、B 組三天澆一次，且肥料也不同。此實驗最大問題是？", "同時改變肥料與水量，無法判斷主要原因", ["沒有幫植物取名字","植物一定不會生長","肥料不能用在植物上"], "操作變因應盡量只有一個，其他條件要控制。")),
        factory("資料限制", () => q("自然","hard","資料限制","某實驗只在同一天、同一地點測三次，就宣稱結果適用全臺所有季節。此結論的問題是？", "資料範圍太小，推論過度", ["測量三次一定不能平均","同一天資料必定造假","全臺沒有季節差異"], "結論不能超出資料支持的範圍太多。")),
        factory("酵素趨勢", () => q("自然","hard","酵素趨勢","某酵素反應速率隨溫度升高先增加，超過某溫度後快速下降。最合理原因是？", "高溫可能破壞酵素構造", ["溫度越高反應永遠越快","酵素只在低溫存在","反應速率和構造無關"], "酵素有適合溫度，過高可能變性。")),
        factory("電路推理", () => q("自然","hard","電路推理","兩個燈泡串聯時，其中一個燈泡燒壞斷路，另一個燈泡通常會如何？", "也不亮", ["變得更亮","發出聲音","變成並聯"], "串聯電路只要一處斷路，整個迴路電流中斷。")),
        factory("熱傳與材料", () => q("自然","hard","熱傳與材料","同樣放入熱水中，金屬湯匙握把比木筷更快變熱，主要因為金屬？", "導熱較快", ["密度一定較小","不能傳熱","會進行光合作用"], "金屬通常比木材更容易傳導熱。")),
        factory("地科判讀", () => q("自然","hard","地科判讀","若等高線非常密集，通常代表該地坡度如何？", "坡度較陡", ["坡度較平緩","一定是海洋","沒有高度差"], "等高線越密，表示短距離內高度變化越大。"))
      ]
    },

    "社會": {
      easy: [
        factory("地圖比例尺", () => q("社會","easy","地圖比例尺","甲地圖顯示整個臺灣，乙地圖顯示一個校園且細節很多。通常哪張比例尺較大？", "乙地圖", ["甲地圖","兩者一定相同","無法由範圍判斷"], "比例尺越大，通常範圍越小、細節越多。")),
        factory("權利義務", () => q("社會","easy","權利義務","學生可以表達意見，但不能故意散布不實訊息傷害他人。這表示？", "權利行使也需尊重他人權益", ["言論自由完全不存在","只有老師能表達意見","不實訊息一定沒有影響"], "自由受到保障，但仍有法律與他人權益的限制。")),
        factory("經濟選擇", () => q("社會","easy","經濟選擇","同樣商品在不同店家價格不同，消費者先比價再購買，最接近哪一概念？", "理性選擇", ["司法審判","地形作用","歷史分期"], "比價是在有限資源下做較有利的選擇。")),
        factory("歷史時間", () => q("社會","easy","歷史時間","若事件甲發生在 1895 年，事件乙發生在 1945 年，哪個事件較早？", "事件甲", ["事件乙","兩者同時","無法比較"], "西元年份數字較小者較早。")),
        factory("家庭功能", () => q("社會","easy","家庭功能","家人照顧生病的成員，主要展現家庭哪一種功能？", "照顧與情感支持", ["國防外交","司法審判","市場壟斷"], "照顧與支持是家庭的重要功能之一。"))
      ],
      normal: [
        factory("供需價格", () => q("社會","normal","供需價格","某演唱會門票數量固定，但想買的人大幅增加，票價上升最能用何概念解釋？", "需求增加造成價格上升", ["供給增加造成價格下降","司法權擴張","氣候型態改變"], "供給固定而需求上升，價格通常上升。")),
        factory("權力制衡", () => q("社會","normal","權力制衡","立法機關可審查預算，行政機關負責執行政策。這反映民主政治中的哪一概念？", "權力分立與制衡", ["君主專制","市場壟斷","人口遷移"], "不同機關分工並互相監督，以避免權力集中。")),
        factory("歷史因果", () => q("社會","normal","歷史因果","港口城市因貿易興盛而吸引外國商人、商品與新觀念，較可能造成什麼影響？", "文化交流與社會變遷增加", ["完全隔絕外來影響","農業立即消失","所有制度不再改變"], "貿易帶來人群與資訊流動，容易促進交流。")),
        factory("媒體識讀", () => q("社會","normal","媒體識讀","看到網路貼文宣稱某政策『一定讓所有人受害』，最適合的判斷方式是？", "查證來源並比較不同資料", ["立刻轉傳給所有人","只看標題就相信","只相信最誇張的說法"], "媒體識讀需要查證來源與多方比較。")),
        factory("氣候生活", () => q("社會","normal","氣候生活","某地夏季高溫多雨、冬季較乾，居民農作與生活方式會受影響。這說明自然環境與人類活動有何關係？", "自然條件會影響生活與產業選擇", ["氣候與人類活動完全無關","所有地方都種同一種作物","降雨越多越不需規劃"], "氣候會影響農作、用水與生活安排。")),
        factory("公民責任", () => q("社會","normal","公民責任","社區居民參加公聽會，表達對交通改善方案的意見。這屬於何種參與？", "公共事務參與", ["家庭照顧","私人消費","自然作用"], "公聽會是居民參與公共決策的方式之一。"))
      ],
      hard: [
        factory("政策權衡", () => q("社會","hard","政策權衡","政府補助大眾運輸並要求業者增加無障礙服務。此政策最可能同時考量哪些面向？", "效率、社會公平與公共利益", ["只考量業者利潤","只考量單一乘客方便","完全不需財源規劃"], "補助、服務品質與無障礙都涉及公平與公共利益。")),
        factory("史料判讀", () => q("社會","hard","史料判讀","研究某歷史事件時，若只採用單一當事人的回憶錄，最需要注意什麼？", "可能有立場或記憶偏差，需與其他史料比對", ["回憶錄一定完全錯誤","只要有文字就不需查證","其他史料都不能使用"], "史料需要比較來源、立場與可信度。")),
        factory("地圖推論", () => q("社會","hard","地圖推論","某聚落多分布在河川下游平原，較少在陡峭山區。最合理原因是？", "平原交通與耕作條件通常較有利", ["山區一定沒有人居住","河川會阻止所有交通","聚落分布與地形無關"], "聚落常受地形、水源與交通影響。")),
        factory("外部成本", () => q("社會","hard","外部成本","工廠生產商品獲利，但排放污染使附近居民健康受損。此現象最能說明什麼？", "生產活動可能產生由他人承擔的外部成本", ["所有工廠都不能生產","居民一定得到商品利潤","污染不需治理"], "外部成本是交易之外由第三者承擔的成本。")),
        factory("法治與自由", () => q("社會","hard","法治與自由","人民享有集會自由，但政府可依法律限制明顯危害公共安全的行為。這最能說明？", "自由受保障，但可依法作合理限制", ["自由完全不存在","法律不能規範任何行為","公共安全不重要"], "民主社會保障自由，也透過法律維護公共利益。")),
        factory("全球議題", () => q("社會","hard","全球議題","某國大量出口商品帶動經濟，但也因能源使用增加造成碳排上升。討論此議題時最需兼顧？", "經濟發展與環境永續", ["只看出口數量","只看單一企業利潤","完全不用考慮環境"], "公共議題常需要在多種價值間取得平衡。"))
      ]
    }
  };



  // v59_additional_dynamic_hard_templates
  V59_CEEC_EXTRA["國文"].hard.push(
    factory("雙文本比較動態", () => {
      const pair = pick([
        ["甲文主張學生應多參加社團累積合作經驗；乙文提醒活動過多也可能壓縮休息時間。", "參與活動有價值，但仍需適度安排時間", ["社團活動完全沒有價值","休息時間越少越好","兩文都反對學生規畫時間"]],
        ["甲文認為閱讀能拓展視野；乙文指出若只追求閱讀數量而不思考，收穫有限。", "閱讀需要數量與思考並重", ["只要讀很多本就一定理解","閱讀完全不需要反思","乙文否定所有閱讀"]],
        ["甲文稱讚城市更新帶來便利；乙文提醒老街記憶也應被保存。", "發展與保存可共同納入考量", ["城市不能改變任何建物","保存記憶必定排斥便利","兩文都主張拆除老街"]]
      ]);
      return q("國文","hard","雙文本比較動態",`閱讀兩文：「${pair[0]}」最適合的綜合判斷是？`,pair[1],pair[2],"先抓兩文各自重點，再找能兼顧雙方的選項。");
    }),
    factory("論證評估動態", () => {
      const item = pick([
        ["只因某班使用某種讀書方法後有兩人成績進步，就宣稱全校都應使用此方法。", "樣本不足，且沒有排除其他影響因素"],
        ["因為某篇文章點閱率高，就判定內容一定正確。", "把受歡迎程度誤當成真實性證據"],
        ["某人因不喜歡演講者的聲音，就否定他的全部論點。", "攻擊個人特徵，沒有檢驗論點內容"]
      ]);
      return q("國文","hard","論證評估動態",`下列推論問題何在？「${item[0]}」`,item[1],["結論比前提更保守","完全沒有任何立場","所有推論都已被充分證明"],"評估論證時要看理由是否足以支持結論。");
    })
  );

  V59_CEEC_EXTRA["英文"].hard.push(
    factory("Long notice inference", () => {
      const place = pick(["Green Station","River Museum","Room 305"]);
      return q("英文","hard","Long notice inference",
        `Notice: The afternoon activity will start 30 minutes later because the speaker is delayed. Students who need to leave before 4:00 should tell the teacher before lunch. Which student should talk to the teacher?`,
        "a student who must leave before 4:00",
        ["a student who can stay all afternoon","a student who already ate lunch","a student who is not joining the activity"],
        "The condition is leaving before 4:00, not whether the student likes the activity.");
    }),
    factory("Comparing views", () => q("英文","hard","Comparing views",
      "Text A says online classes save travel time. Text B says students may lose focus if they study at home without a plan. What do both texts suggest?",
      "Online classes can be useful, but learning habits still matter.",
      ["Online classes are always worse than school.","Travel time is the only problem in learning.","Students never need a study plan."],
      "The best answer combines the advantage from Text A and the caution from Text B."))
  );

  V59_CEEC_EXTRA["社會"].hard.push(
    factory("資料與政策判斷", () => {
      const item = pick([
        ["某市公車使用率低，但老人與學生仍高度依賴。若只因使用率低就全面停駛", "可能忽略弱勢或特定族群的交通需求"],
        ["政府為降低空汙限制高污染車輛，但也補助業者汰換車輛", "兼顧環境治理與業者調適成本"],
        ["學校禁止所有手機進校，卻未討論學生緊急聯絡需求", "政策可能過度簡化，未考量不同情境"]
      ]);
      return q("社會","hard","資料與政策判斷",`情境：「${item[0]}」，最合理的評估是？`,item[1],["只要成本最低就是最佳政策","所有限制都不需要理由","公共政策不需考慮受影響者"],"政策題要兼顧不同群體、成本與公共利益。");
    })
  );

  window.CSQ_FORCE_UNIQUE_QUESTION = function(subject,difficulty,stageSigs){
    if(subject === "國文" && window.CSQ_GENERATE_CHINESE_QUESTION){
      return window.CSQ_GENERATE_CHINESE_QUESTION(9, true, stageSigs, difficulty);
    }
    if(subject === "英文" && window.CSQ_GENERATE_ENGLISH_QUESTION){
      const q = window.CSQ_GENERATE_ENGLISH_QUESTION(9, true, stageSigs, difficulty);
      if(q) return q;
    }
    if(subject === "數學" && window.CSQ_GENERATE_MATH_QUESTION){
      const q = window.CSQ_GENERATE_MATH_QUESTION(9, true, stageSigs, difficulty);
      if(q) return q;
    }
    if(subject === "自然" && window.CSQ_GENERATE_SCIENCE_QUESTION){
      const q = window.CSQ_GENERATE_SCIENCE_QUESTION(9, true, stageSigs, difficulty);
      if(q) return q;
    }
    if(subject === "社會" && window.CSQ_GENERATE_SOCIAL_QUESTION){
      const q = window.CSQ_GENERATE_SOCIAL_QUESTION(9, true, stageSigs, difficulty);
      if(q) return q;
    }
    for(let i=0;i<200;i++){
      const qq=generate(subject,difficulty);
      const appSig=`${subject}|${String(qq.topic).replace(/\s+/g,'')}|${String(qq.question).replace(/[Ａ-Ｚａ-ｚ０-９]/g, ch => String.fromCharCode(ch.charCodeAt(0)-0xFEE0)).replace(/\s+/g,'').replace(/[，。！？、；：「」『』（）()【】\[\]《》〈〉,.!?;:'"“”‘’]/g,'').replace(/[ABCDＡＢＣＤ][\.．、)]/g,'').trim()}`;
      if(!stageSigs || !stageSigs.has(appSig)) return qq;
    }
    return generate(subject,difficulty);
  };
})();


