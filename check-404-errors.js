/**
 * 404エラーの詳細を調査するスクリプト
 */

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // ネットワークリクエストを監視
  page.on('requestfailed', request => {
    console.log(`❌ ${request.url()} - ${request.failure().errorText}`);
  });
  
  try {
    await page.goto('http://localhost:8080/achievement/index.html', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 3000));
  } catch (error) {
    console.error('エラーが発生しました:', error);
  } finally {
    await browser.close();
  }
})();
