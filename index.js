// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");
const fs = require('fs');
const csvWriter = require('fast-csv').write;
const express = require('express');
const app = express();
const port = 3000;


async function saveHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com");

  // Get the top 10 articles
  const articles = await page.$$eval('a.storylink', links => links.map(link => ({
    title: link.textContent,
    url: link.href
  }))).then(articles => articles.slice(0, 10));

  // Write to CSV
  const ws = fs.createWriteStream('articles.csv');
  console.log(ws);
  csvWriter(articles, { headers: true }).pipe(ws);

  await browser.close();
}

(async () => {
  await saveHackerNewsArticles();
})();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
