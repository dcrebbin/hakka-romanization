const fs = require('fs');
const path = require('path');
const obj = {};
const maxPages = 3;


for(let i = 1; i <= maxPages; i++){

const romanizedFile = path.join(__dirname, `content/romanized/bible_text_${i}.txt`);
const chineseFile = path.join(__dirname, `content/chinese/bible_text_${i}.txt`);
const romanized = fs.readFileSync(romanizedFile, 'utf8');
const chineseText = fs.readFileSync(chineseFile, 'utf8');

const romanizedArray = [];
const words = romanized
  .replace(/[.,!?;:'"']/g, '').replace(/^\d+|\s\d+/g, '') // Remove punctuation and numbers at start of words
  .split(/[\s\n-]+/) // Split on spaces, newlines and dashes
  .filter(word => word.length > 0);

// Add each word to array  
for (const word of words) {
    if(word === ' ' || word === '\\n'){
        continue;
    }
  romanizedArray.push(word.toLowerCase());
}

const chineseArray = [];

const chineseWords = chineseText
  .replace(/[^\u4e00-\u9fa5]/g, '') // Remove everything except Chinese characters
  .split('') // Split into individual characters
  .filter(char => char.length > 0);

for (const char of chineseWords) {
  chineseArray.push(char);
}

for(let i = 0; i < chineseArray.length; i++){
    obj[chineseArray[i]] = romanizedArray[i];
}

}

fs.writeFileSync('obj.json', JSON.stringify(obj));
