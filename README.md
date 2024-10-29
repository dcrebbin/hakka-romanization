# Hakka Pha̍k-fa-sṳ Romanization

This project aims to correctly produce a Chinese character to romanization mapping for the Hakka language using the Pha̍k-fa-sṳ style of romanization.
It aims to does this by scraping bible.com for both the Chinese Hakka & Pha̍k-fa-sṳ versions of the bible.

In theory, these 2 are complete identical in content which with the correct sanitization code should produce an accurate mapping of the romanization.

### Side by Side Chinese Hakka vs Pha̍k-fa-sṳ bible

![](/assets/bible-comparison.png)

#### Sources:

[Chinese Hakka](https://www.bible.com/bible/1806/GEN.1.THV12HDB)

[Pha̍k-fa-sṳ Romanization](https://www.bible.com/bible/2408/GEN.2.THV12RDB)

### Sanitized Data

Data that has gone through a process of removing punctuation, obscure unicode characters etc.

![](/assets/sanitized.png)

### Example Output

![](/assets/test-map.png)

## Setup

1. Install Nodejs or Bun

2. `npm install` (or pnpm/bun etc)

3. Specify the amount of pages to retrieval (currently only made to work for genesis)

4. `node retrieval.js`

5. Specify amount of pages to convert

6. `node main.js`

7. See the completed data structure at `/output/hakka_romanization_mapping.json`
