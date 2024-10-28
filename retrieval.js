// Chinese Hakka Bible: https://www.bible.com/bible/3620/GEN.1.TTVH
// Pha̍k-fa-sṳ (romanized) Hakka Bible: https://www.bible.com/bible/2408/GEN.1.THV12RDB

const fs = require('fs');
const puppeteer = require('puppeteer');
const maxPages = 1;

const chineseBook = 1806;
const romanizedBook = 2408;
const romanizedVersion = 'THV12RDB';
const chineseVersion = 'THV12HDB';

// Retrieve and process text from bible.com website
async function retrieveBiblePage(book, chapter, version, isChinese) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    //save html to file
   
    const url = `https://www.bible.com/bible/${isChinese ? chineseBook : romanizedBook}/${book}.${chapter}.${version}`;
    
    await page.goto(url);

    // Wait for content to load
    await page.waitForSelector('.ChapterContent_chapter__uvbXo');

    // Remove verse number labels and notes
    await page.evaluate(() => {
        const labels = document.getElementsByClassName('ChapterContent_label__R2PLt');
        const notes = document.getElementsByClassName('ChapterContent_note__YlDW0');
        
        // Convert HTMLCollection to Array since it's live and elements get removed
        Array.from(labels).forEach(label => label.remove());
        Array.from(notes).forEach(note => note.remove());
    });

    // Get text content
    const text = await page.evaluate(() => {
        return document.getElementsByClassName('ChapterContent_chapter__uvbXo')[0].textContent;
    });

    await browser.close();

    console.log(`Retrieved page ${chapter}`);

    // Create directories if they don't exist
    const dir = `./content/${isChinese ? 'chinese' : 'romanized'}`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // Save to file
    fs.writeFileSync(`${dir}/bible_text_${chapter}.txt`, text);
    console.log(`Saved page ${chapter} to file`);

    return text;
}

async function retrieveBiblePages() {
    for (let i = 1; i <= maxPages; i++) {
        await retrieveBiblePage('GEN', i, romanizedVersion, false);
        await retrieveBiblePage('GEN', i, chineseVersion, true);
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}

retrieveBiblePages();