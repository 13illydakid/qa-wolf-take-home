// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");
const fs = require('fs'); // Import file system module

const express = require('express');
const app = express();
const port = 3000;


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});


async function saveHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/");

  // Get top 10 story titles and links
  const stories = await page.$$eval('.titleline', async (elements) => {
    const titles = [];
    const links = [];
    for (let i = 0; i < Math.min(10, elements.length); i++) {
      const titleElement = elements[i];
      if (titleElement) {
        // console.log(titleElement);
        titles.push(titleElement.textContent.trim());
        const linkElement = titleElement.querySelector('a');
        if (linkElement) {
          links.push(linkElement.getAttribute('href'));
        }
      }
    }
    return { titles, links };
  });

  // Prepare CSV data string
  const csvData = stories.titles.map((title, index) => `${title},${stories.links[index]}`).join('\n');
  // console.log(csvData);
  // console.log(stories);

  // Write CSV data to file
  fs.writeFile('hackernews_top10.csv', csvData, (err) => {
    if (err) {
      console.error('Error writing CSV file:', err);
    } else {
      console.log('Top 10 articles saved to hackernews_top10.csv');
    }
  });

  // Close browser
  await browser.close();
}

(async () => {
  await saveHackerNewsArticles();
})();
