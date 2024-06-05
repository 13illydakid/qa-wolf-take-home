// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");
const fs = require('fs');
const csvWriter = require('fast-csv').write;
// const express = require('express');
// const app = express();
// const port = 3000;


async function saveHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/");

  // Get the top 10 articles
  const articles = await page.$$eval('a.storylink', links => links.map(link => ({
    title: link.textContent,
    url: link.href
  }))).then(articles => articles.slice(0, 10));
  console.log(articles);

  // Write to CSV
  const ws = fs.createWriteStream('articles.csv');
  csvWriter(articles, { headers: true }).pipe(ws);
  console.log(ws);

  await browser.close();
}

(async () => {
  await saveHackerNewsArticles();
})();

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// app.listen(port, () => {
//   console.log(`App listening at http://localhost:${port}`);
// });

/*
const playwright = require('playwright');

(async () => {

  // Launch browser
  const browser = await playwright.chromium.launch();

  // Create a new page
  const page = await browser.newPage();

  // Navigate to Hacker News
  await page.goto('https://news.ycombinator.com/');

  // Wait for title to be loaded (optional)
  await page.waitForSelector('title');

  // Print title to console
  console.log(await page.title());

  // Get all titles of the listed stories (simple example)
  const storyTitles = await page.$$eval('.athing__title', elements => elements.map(a => a.textContent));
  console.log(storyTitles);

  // Close browser
  await browser.close();

})();

*/
