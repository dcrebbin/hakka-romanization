const fs = require('fs');
const path = require('path');
const obj = {};
const maxPages = 3;

let romanizedArray = [];
let chineseArray = [];

for(let i = 3; i <= maxPages; i++){
    const romanizedFile = path.join(__dirname, `content/romanized/bible_text_${i}.txt`);
    const chineseFile = path.join(__dirname, `content/chinese/bible_text_${i}.txt`);
    const romanized = fs.readFileSync(romanizedFile, 'utf8');
    const chineseText = fs.readFileSync(chineseFile, 'utf8');

    const sanitizedRomanization = romanized
        .replace(/[.,!?;:'"'“‘’”]/g, ' ')
        .replace(/^\d+|\s\d+/g, '')
        .replace(/[-""]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();

    const words = sanitizedRomanization.split(/[\s\n-]+/).filter(word => word.length > 0);

    for (const word of words) {
        if(word === ' ' || word === '\\n'){
            continue;
        }
    romanizedArray.push(word.toLowerCase());
    }

    // Improved Chinese text sanitization
    const sanitizedChineseText = chineseText
        .replaceAll(/[.,!?;:'"'"\s\n，。、：「」『』；！]/g, '')
        .match(/[\u4E00-\u9FFF\u{20000}-\u{2A6DF}\u{2A700}-\u{2B73F}\u{2B740}-\u{2B81F}\u{2B820}-\u{2CEAF}\u3400-\u4DBF\u{2B820}-\u{2CEAF}𠊎𡟓𡜵]/gu)
        ?.join('') || '';

    // Debugging for character counts
    console.log('Original Chinese length:', chineseText.length);
    console.log('Sanitized Chinese length:', sanitizedChineseText.length);
    console.log('Special characters found:', chineseText.match(/[^\u4E00-\u9FFF]/gu));

    const chineseWords = sanitizedChineseText.split('');

    console.log(`${chineseWords.length == romanizedArray.length ? "Pass" : "Fail"}`);
    console.log("Pushing characters for page", i);
    for (const char of chineseWords) {
        chineseArray.push(char);
    }

    console.log(`=== Page ${i} Processing ===`);
    console.log('Original romanized length:', words.length);
    console.log('Original Chinese length:', chineseWords.length);

    // Log the first few mappings to check alignment
    console.log('First 10 mappings:');
    for(let j = 0; j < Math.min(10, words.length, chineseWords.length); j++) {
        console.log(`${chineseWords[j]} -> ${words[j]}`);
    }

    // Log any potential problematic characters
    const problematicChars = chineseText.match(/[^\u4E00-\u9FFF\u{20000}-\u{2A6DF}\u{2A700}-\u{2B73F}\u{2B740}-\u{2B81F}\u{2B820}-\u{2CEAF}\u3400-\u4DBF\u{2B820}-\u{2CEAF}𠊎𡟓𡜵]/gu);
    if (problematicChars) {
        console.log('Problematic characters found:', problematicChars);

        fs.writeFileSync(`./output/problematic_chars_${i}.txt`, problematicChars.join(''), 'utf8');
    }
}

const logs = [];

for(let chineseIndex = 0, romanizedIndex = 0; romanizedIndex < romanizedArray.length;){
    const char = chineseArray[chineseIndex];

    if(!char){
        console.log("Found empty character at index", chineseIndex);
        console.log("Character", char);
        chineseIndex++;
        romanizedIndex++;
        continue;
    }
    
    // Handle extended Unicode characters (including 𠊎, 𡟓, 𡜵)
    if (char && char.length > 1) {
        console.log(`Found extended character: ${char} at index ${chineseIndex}`);
        chineseIndex++;
        romanizedIndex++;
        continue;
    }

    const unicode = char.charCodeAt(0).toString(16).padStart(4, '0').toUpperCase();
    if(unicode.startsWith('D8') || unicode.startsWith('D9') || unicode.startsWith('DA') || unicode.startsWith('DB') || 
       unicode.startsWith('DC') || unicode.startsWith('DD') || unicode.startsWith('DE') || unicode.startsWith('DF')){
        console.log("Removed surrogate", unicode);
        chineseArray.splice(chineseIndex, 1);
        if(unicode.startsWith('D8') || unicode.startsWith('D9') || unicode.startsWith('DA') || unicode.startsWith('DB')){
            console.log("Removed romanized", romanizedArray[romanizedIndex]);
            romanizedArray.splice(romanizedIndex, 1);
        }
        continue;
    }

    chineseIndex++;
    romanizedIndex++;
    const log = `Index: ${chineseIndex} Character: ${chineseArray[chineseIndex]} Unicode: U+${unicode}`;
    logs.push(log);
}
fs.writeFileSync("./output/chinese_array.txt", `${chineseArray.join(' ')}`, 'utf8');
fs.writeFileSync("./output/romanized_array.txt", `${romanizedArray.join(' ')}`, 'utf8');


console.log("chineseArray", chineseArray.length, "romanizedArray", romanizedArray.length);

if (chineseArray.length !== romanizedArray.length) {
    console.log('Warning: Arrays have different lengths!', {
        chinese: chineseArray.length,
        romanized: romanizedArray.length
    });

    console.log(`There is a difference of ${chineseArray.length - romanizedArray.length} characters between the two arrays`);
}

let removedSurrogates = [];

for(let chineseIndex = 0, romanizedIndex = 0; romanizedIndex < romanizedArray.length; romanizedIndex++, chineseIndex++){
    if (!obj[chineseArray[chineseIndex]]) {
      obj[chineseArray[chineseIndex]] = [];
    }
    if (!obj[chineseArray[chineseIndex]].includes(romanizedArray[romanizedIndex])) {
      obj[chineseArray[chineseIndex]].push(romanizedArray[romanizedIndex]);
    }
}

fs.writeFileSync('./output/logs.txt', logs.join('\n'), 'utf8');
console.log(`Completed Hakka Romanisation mapping for ${maxPages > 1 ? maxPages+" pages" : "1 page"}`);

fs.writeFileSync('./output/hakka_romanization_mapping.json', JSON.stringify(obj));
