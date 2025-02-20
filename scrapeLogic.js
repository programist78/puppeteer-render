const puppeteer = require("puppeteer");
const fs = require("fs");
require("dotenv").config();

const scrapeLogic = async (res) => {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });

  try {
    const page = await browser.newPage();
    await page.goto("https://developer.chrome.com/");

    // Устанавливаем размеры экрана
    await page.setViewport({ width: 1080, height: 1024 });

    if (!fs.existsSync("screenshots")) {
      fs.mkdirSync("screenshots");
    }

    // Запускаем интервал для создания скриншотов каждую секунду
    let screenshotCount = 0;
    const screenshotInterval = setInterval(async () => {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `screenshots/screenshot-${timestamp}.png`;
      await page.screenshot({ path: filename, fullPage: true });
      console.log(`📸 Screenshot saved: ${filename}`);

      screenshotCount++;

      // Остановить скриншоты через 10 секунд (если нужно)
      if (screenshotCount >= 10) {
        clearInterval(screenshotInterval);
        console.log("📸 Screenshot capturing stopped.");
        await browser.close(); // Закрываем браузер после 10 скриншотов
      }
    }, 1000);

    res.send(`Scraping started. Screenshots will be saved every second.`);
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  }
};

module.exports = { scrapeLogic };