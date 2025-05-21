/**
 * フィルタリング機能のテストスクリプト
 */

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // ブラウザのコンソールログを取得
  page.on('console', msg => console.log('ブラウザログ:', msg.text()));
  
  try {
    // ページ読み込み
    await page.goto('http://localhost:8080/achievement/index.html', { waitUntil: 'networkidle0' });
    
    // 現在のタグの内容を確認
    const tags = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.achievement-tag')).map(tag => tag.textContent.trim());
    });
    
    console.log('現在の実績タグ一覧:', tags);
    
    // フィルタリングテスト：コンサルタント
    await page.click('.filter-button[data-filter="コンサルタント"]');
    await new Promise(r => setTimeout(r, 1000));
    
    const filteredResult = await page.evaluate(() => {
      const visibleCards = Array.from(document.querySelectorAll('.achievement-card'))
        .filter(card => window.getComputedStyle(card).display !== 'none');
      
      return {
        filter: document.querySelector('.filter-button.active').getAttribute('data-filter'),
        visibleCount: visibleCards.length,
        visibleTags: visibleCards.map(card => card.querySelector('.achievement-tag').textContent.trim())
      };
    });
    
    console.log('\nコンサルタントフィルターでの結果:', filteredResult);
    
    // すべてに戻す
    await page.click('.filter-button[data-filter="すべて"]');
    await new Promise(r => setTimeout(r, 1000));
    
    const allResult = await page.evaluate(() => {
      return {
        filter: document.querySelector('.filter-button.active').getAttribute('data-filter'),
        visibleCount: Array.from(document.querySelectorAll('.achievement-card'))
          .filter(card => window.getComputedStyle(card).display !== 'none').length
      };
    });
    
    console.log('\nすべて表示での結果:', allResult);
    
  } catch (error) {
    console.error('テスト実行中にエラーが発生しました:', error);
  } finally {
    await browser.close();
  }
})();
