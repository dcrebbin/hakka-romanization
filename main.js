const fs = require('fs');
const path = require('path');
const obj = {};
const maxPages = 1;

const romanizedArray = [];
const chineseArray = [];

for(let i = 1; i <= maxPages; i++){
    const romanizedFile = path.join(__dirname, `content/romanized/bible_text_${i}.txt`);
    const chineseFile = path.join(__dirname, `content/chinese/bible_text_${i}.txt`);
    const romanized = fs.readFileSync(romanizedFile, 'utf8');
    const chineseText = fs.readFileSync(chineseFile, 'utf8');

    const sanitizedRomanization = romanized
    .replace(/[.,!?;:'"']/g, '').replace(/^\d+|\s\d+/g, '').replaceAll("-", " ").replaceAll("”", "").replaceAll("“", "").replaceAll("  "," ").toLowerCase();

    const words = sanitizedRomanization.split(/[\s\n-]+/).filter(word => word.length > 0);

    for (const word of words) {
        if(word === ' ' || word === '\\n'){
            continue;
        }
    romanizedArray.push(word.toLowerCase());
    }

    const sanitizedChineseText = chineseText.replace(/[。，、；：？！、…—·「」『』（）〔〕【】《》〈〉""''﹏\s\u2000-\u206F\u3000-\u303F\uFF00-\uFFEF\uD800-\uDBFF]/g, '')
    const chineseWords = sanitizedChineseText.split('').filter(char => char.length > 0);
    const correctlySanitized = words.length == chineseWords.length;

    if(!correctlySanitized){
        console.log(`Incorrectly sanitized on page ${i}`);
        break;
    }
    console.log("Pushing characters for page",i);
    for (const char of chineseWords) {
    chineseArray.push(char);
    }
}

for(let i = 0; i < chineseArray.length; i++){
    if (!obj[chineseArray[i]]) {
      obj[chineseArray[i]] = [];
    }
    if (!obj[chineseArray[i]].includes(romanizedArray[i])) {
      obj[chineseArray[i]].push(romanizedArray[i]);
    }
}
console.log(`Completed Hakka Romanisation mapping for ${maxPages > 1 ? maxPages+" pages" : "1 page"}`);

fs.writeFileSync('./output/hakka_romanization_mapping.json', JSON.stringify(obj));