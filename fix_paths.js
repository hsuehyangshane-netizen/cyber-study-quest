const fs = require("fs");

function replaceInFile(filePath, replacements) {
    try {
        let content = fs.readFileSync(filePath, "utf8");
        let newContent = content;
        for (const [regex, replacement] of replacements) {
            newContent = newContent.replace(regex, replacement);
        }
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, "utf8");
            console.log("Updated " + filePath);
        }
    } catch (e) {
        console.log("Skipped " + filePath + ": " + e.message);
    }
}

const jsReplacements = [
    [/(\"|\'|\`)\.\/assets\/skins\//g, "$1./assets/img/skins/"],
    [/(\"|\'|\`)\.\/assets\/bosses\//g, "$1./assets/img/bosses/"],
    [/(\"|\'|\`)\.\/assets\/math\//g, "$1./assets/img/math/"],
    [/(\"|\'|\`)\.\/assets\/science\//g, "$1./assets/img/science/"],
    [/(\"|\'|\`)\.\/assets\/social\//g, "$1./assets/img/social/"],
    [/(\"|\'|\`)\.\/assets\/([^\/]+\.mp3)/g, "$1./assets/audio/$2"],
    [/(\"|\'|\`)\.\/assets\/([^\/]+\.(png|gif|svg))/g, "$1./assets/img/$2"]
];

const cssReplacements = [
    [/url\([\"']?\.\/assets\/([^\/]+\.(png|gif|svg))[\"']?\)/g, "url(\"../assets/img/$1\")"]
];

replaceInFile("index.html", jsReplacements);

const jsFiles = [
    "js/app.js", 
    "js/data.js", 
    "js/core/game-content-config.js", 
    "js/core/progression-system.js",
    "js/core/hidden-boss-system.js",
    "js/core/external-bank-adapters.js",
    "js/core/question-engine-bootstrap.js"
];
jsFiles.forEach(f => replaceInFile(f, jsReplacements));

const dataFiles = [
    "data/question_bank_chinese.js",
    "data/question_bank_english.js",
    "data/question_bank_math.js",
    "data/question_bank_science.js",
    "data/question_bank_social.js",
    "data/question_bank_chinese.json",
    "data/question_bank_english.json",
    "data/question_bank_math.json",
    "data/question_bank_science.json",
    "data/question_bank_social.json"
];
dataFiles.forEach(f => replaceInFile(f, jsReplacements));

replaceInFile("css/style.css", cssReplacements);

console.log("Done.");
