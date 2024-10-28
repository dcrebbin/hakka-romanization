// Chinese Hakka Bible: https://www.bible.com/bible/3620/GEN.1.TTVH
// Pha̍k-fa-sṳ (romanized) Hakka Bible: https://www.bible.com/bible/2408/GEN.1.THV12RDB

const fs = require('fs');
const puppeteer = require('puppeteer');
const maxPages = 3;

const chineseBook = 3620;
const romanizedBook = 2408;
const romanizedVersion = 'THV12RDB';
const chineseVersion = 'TTVH';

// Retrieve and process text from bible.com website
async function retrieveBiblePage(book, chapter, version, isChinese) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = `https://www.bible.com/bible/${isChinese ? chineseBook : romanizedBook}/${book}.${chapter}.${version}`;
    
    await page.goto(url);

    // Wait for content to load
    await page.waitForSelector('.ChapterContent_chapter__uvbXo');

    // Remove verse number labels
    await page.evaluate(() => {
        const labels = document.getElementsByClassName('ChapterContent_label__R2PLt');
        for (const label of labels) {
            label.remove();
        }
    });

    // Get text content
    const text = await page.evaluate(() => {
        return document.getElementsByClassName('ChapterContent_chapter__uvbXo')[0].textContent;
    });

    await browser.close();

    console.log(`Retrieved page ${chapter}`);

    // Save to file
    fs.writeFileSync(`./content/${isChinese ? 'chinese' : 'romanized'}/bible_text_${chapter}.txt`, text);
    console.log(`Saved page ${chapter} to file`);

    return text;
}

async function retrieveBiblePages(){
    for(let i = 1; i <= maxPages; i++){
        await retrieveBiblePage('GEN', i, romanizedVersion, false);
        await retrieveBiblePage('GEN', i, chineseVersion, true);
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}

retrieveBiblePages();