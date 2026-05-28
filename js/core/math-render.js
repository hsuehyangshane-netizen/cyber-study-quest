function escapeHtmlLocal(text){
  return String(text ?? "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");
}

function stripLatexTextCommands(expr){
  return String(expr || "").replace(/\\text\{([^{}]*)\}/g, "$1");
}

function renderLatexLite(expr, display=false){
  const rawExpr = stripLatexTextCommands(String(expr || "").trim());
  if(!rawExpr) return "";

  try{
    const k = window.katex || (typeof katex !== "undefined" ? katex : null);
    if(k && typeof k.renderToString === "function"){
      return k.renderToString(rawExpr, {
        throwOnError:false,
        strict:false,
        trust:false,
        output:"html",
        displayMode: !!display,
        macros: {"\\dfrac":"\\frac"}
      });
    }
  }catch(e){
    console.warn("KaTeX render failed:", rawExpr, e);
  }

  return escapeHtmlLocal(rawExpr);
}

function isLikelyLatexExpr(expr, display=false){
  const s = String(expr || "").trim();
  if(!s) return false;
  if(display) return true;

  // Keep ordinary English currency text normal:
  // "$300 per month and $50 ..." should not be parsed as one LaTeX block.
  // Prose-like lowercase words separated by spaces are a strong signal of text rather than math.
  if(/\s/.test(s) && /[a-z]{2,}/.test(s) && !/\\[A-Za-z]+/.test(s)) return false;

  if(/\\[A-Za-z]+/.test(s)) return true;
  if(/\\[%#$&_]/.test(s)) return true;
  if(/[{}^_]/.test(s)) return true;
  if(/^\s*[-+]?[\d.]+\s*$/.test(s)) return true;
  if(/^[=+\-*/÷<>]+$/.test(s)) return true;
  if(/^[A-Za-z]+$/.test(s)) return true; // variables and geometry labels such as x, P, AB, CD
  if(/[A-Za-z0-9)\]}]\s*[+\-*/÷=<>:]\s*[-+A-Za-z0-9({\[]/.test(s)) return true;
  if(/^[(),.\d\s:+\-]+$/.test(s) && /\d/.test(s)) return true; // ratios, ordered pairs, number lists
  if(/%/.test(s) && /\d/.test(s)) return true;
  if(/[+\-*/÷=<>^_]/.test(s) && /[A-Za-z0-9\u4e00-\u9fff]/.test(s)) return true;

  // Fallback for compact algebra/geometry notation inside explicit $...$ delimiters.
  if(/^[A-Za-z0-9\\\s+\-*/÷=<>()[\]{}^_,.:|%]+$/.test(s) && /[A-Za-z0-9]/.test(s)) return true;

  return false;
}

function repairCommonLatexTypos(expr){
  let s = String(expr || "");

  // Common JS escape accidents from single backslashes:
  // "\frac" can become form-feed + "rac"; "\times" can become tab + "imes".
  s = s.replace(/\x0crac/g, "\\frac");
  s = s.replace(/\x09imes/g, "\\times");

  // Normalize dfrac to frac for KaTeX macro compatibility.
  s = s.replace(/\\dfrac/g, "\\frac");

  return s;
}

function findInlineMathClosingDollar(text, start){
  const s = String(text || "");
  for(let i = start; i < s.length; i++){
    if(s[i] === "\n") return -1;
    if(s[i] === "$" && s[i-1] !== "\\") return i;
  }
  return -1;
}

function renderDelimitedMath(expr, display){
  const fixed = repairCommonLatexTypos(expr);
  return `<span class="${display ? "math-display" : "math-inline"}">${renderLatexLite(fixed, display)}</span>`;
}

function renderMathText(text){
  const raw = String(text ?? "");
  if(!raw) return "";

  const appendPlain = (s) => escapeHtmlLocal(s).replace(/\n/g, "<br>");
  let out = "";
  let i = 0;

  while(i < raw.length){
    // Display math: $$ ... $$
    if(raw.startsWith("$$", i)){
      const end = raw.indexOf("$$", i + 2);
      if(end !== -1){
        const expr = raw.slice(i + 2, end);
        if(isLikelyLatexExpr(expr, true)){
          out += renderDelimitedMath(expr, true);
        }else{
          out += appendPlain(raw.slice(i, end + 2));
        }
        i = end + 2;
        continue;
      }
    }

    // Standard LaTeX delimiters are supported too, so future question banks can use \(...\) or \[...\].
    if(raw.startsWith("\\(", i)){
      const end = raw.indexOf("\\)", i + 2);
      if(end !== -1){
        out += renderDelimitedMath(raw.slice(i + 2, end), false);
        i = end + 2;
        continue;
      }
    }
    if(raw.startsWith("\\[", i)){
      const end = raw.indexOf("\\]", i + 2);
      if(end !== -1){
        out += renderDelimitedMath(raw.slice(i + 2, end), true);
        i = end + 2;
        continue;
      }
    }

    // Inline math: $ ... $
    // Important: do NOT blindly treat "$" followed by a digit as currency.
    // Math questions often contain values like $120$ or $\frac{2}{5}$.
    // If the paired content does not look like LaTeX, output it unchanged; this keeps English money text safe.
    if(raw[i] === "$" && raw[i-1] !== "\\"){
      const end = findInlineMathClosingDollar(raw, i + 1);
      if(end !== -1){
        const expr = raw.slice(i + 1, end);
        if(isLikelyLatexExpr(expr, false)){
          out += renderDelimitedMath(expr, false);
        }else{
          out += appendPlain(raw.slice(i, end + 1));
        }
        i = end + 1;
        continue;
      }
    }

    // Plain text run until the next possible delimiter.
    let next = raw.length;
    for(const marker of ["$$", "$", "\\(", "\\["]){
      const pos = raw.indexOf(marker, i + 1);
      if(pos !== -1 && pos < next) next = pos;
    }
    out += appendPlain(raw.slice(i, next));
    i = next;
  }

  return out;
}
function renderQuestionHtml(text){
  const raw = String(text || "").replace(/\r\n/g,"\n").trim();
  if(!raw) return "";

  const contextMatch = raw.match(/【情境】([\s\S]*?)(?=\n\s*【資料／題目】|\n\s*【命題方向】|$)/);
  const dataMatch = raw.match(/【資料／題目】([\s\S]*?)(?=\n\s*【命題方向】|$)/);
  const directionMatch = raw.match(/【命題方向】([\s\S]*)$/);

  if(contextMatch || dataMatch || directionMatch){
    const context = contextMatch ? contextMatch[1].trim() : "";
    const data = dataMatch ? dataMatch[1].trim() : "";
    const direction = directionMatch ? directionMatch[1].trim() : "";

    const contextHtml = context
      ? `<div class="cap-section-subtitle">情境</div><div class="cap-context-text">${renderMathText(context)}</div>`
      : "";
    const dataHtml = data
      ? `<div class="cap-section-subtitle">題目</div><div class="cap-question-body">${renderMathText(data)}</div>`
      : "";
    const directionHtml = direction
      ? `<div class="cap-direction-chip">${renderMathText(direction).replace(/<br>/g," ")}</div>`
      : "";

    return `<section class="cap-block combined-question-block">
      <div class="cap-block-label">閱讀題幹</div>
      <div class="cap-block-body">${contextHtml}${dataHtml}</div>
      ${directionHtml}
    </section>`;
  }

  const blocks = raw.split(/\n{2,}/);
  return blocks.map(block=>{
    const trimmed = block.trim();
    const rendered = renderMathText(trimmed);
    if(trimmed.includes("：") && /[0-9A-Za-z甲乙丙丁一二三四五六週]/.test(trimmed)){
      return `<section class="cap-block table-like-block"><div class="cap-block-body">${rendered}</div></section>`;
    }
    return `<p class="cap-paragraph">${rendered}</p>`;
  }).join("");
}
