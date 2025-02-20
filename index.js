const express = require("express");
const { scrapeLogic } = require("./scrapeLogic");
const fs = require("fs");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 4000;

app.get("/scrape", (req, res) => {
  scrapeLogic(res);
});

app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!");
});

app.use("/screenshots", express.static(path.join(__dirname, "screenshots")));

app.get("/latest-screenshot", (req, res) => {
  const files = fs.readdirSync(path.join(__dirname, "screenshots"));
  if (files.length === 0) {
    return res.send("<h1>No screenshots captured yet.</h1>");
  }

  const latestScreenshot = files.sort().pop(); // Получаем последний скриншот
  const imageUrl = `/screenshots/${latestScreenshot}`; // URL для картинки

  res.send(`
    <h1>Latest Screenshot</h1>
    <img src="${imageUrl}" style="max-width: 100%; border: 1px solid #ddd;">
  `);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
  console.log('/scrape')
  console.log('/latest-screenshot')
});

