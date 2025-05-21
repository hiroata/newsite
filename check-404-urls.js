/**
 * 404エラーのURLを特定するためのチェックスクリプト
 */

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  let failedUrls = [];
  
  // ネットワークリクエストの監視
  page.on('response', response => {
    if (response.status() === 404) {
      failedUrls.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
    }
  });
  
  try {
    await page.goto('http://localhost:8080/achievement/index.html', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2000));
    
    console.log('\n404エラーが発生したURL:');
    if (failedUrls.length === 0) {
      console.log('404エラーは発生していません');
    } else {
      failedUrls.forEach((url, index) => {
        console.log(`${index + 1}. ${url.url}`);
      });
    }
  } catch (error) {
    console.error('テスト実行中にエラーが発生しました:', error);
  } finally {
    await browser.close();
  }
})();
