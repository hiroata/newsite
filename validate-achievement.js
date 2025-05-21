/**
 * HTML検証レポートを作成
 */
const puppeteer = require('puppeteer');
const fs = require('fs').promises;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  try {
    // ページ読み込み
    await page.goto('http://localhost:8080/achievement/index.html');
    
    // HTML構造をチェック
    const htmlValidation = await page.evaluate(() => {
      const issues = [];
      
      // タグが正しく閉じられているか確認
      const unclosedTags = document.querySelectorAll('script:not([src]):empty');
      if (unclosedTags.length > 0) {
        issues.push(`閉じられていないscriptタグが${unclosedTags.length}個検出されました`);
      }
      
      // CSS参照の確認
      const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
      const cssIssues = [];
      
      stylesheets.forEach(link => {
        if (!link.href) {
          cssIssues.push(`CSSファイルのパスがありません: ${link.outerHTML}`);
        }
      });
      
      if (cssIssues.length > 0) {
        issues.push(`CSS参照の問題: ${cssIssues.join(', ')}`);
      }
      
      return {
        title: document.title,
        stylesheetsCount: stylesheets.length,
        scriptsCount: document.scripts.length,
        issues: issues
      };
    });
    
    // フィルターボタンの動作をテスト
    const filterResult = await page.evaluate(() => {
      try {
        const filterButtons = document.querySelectorAll('.filter-button');
        if (filterButtons.length === 0) return { error: 'フィルターボタンが見つかりません' };
        
        // 「コンサルタント」ボタンをクリック
        const consultantButton = Array.from(filterButtons)
          .find(button => button.textContent.trim() === 'コンサルタント');
        
        if (!consultantButton) return { error: 'コンサルタントボタンが見つかりません' };
        
        consultantButton.click();
        
        // 表示されているカードをカウント
        const visibleCards = Array.from(document.querySelectorAll('.achievement-card'))
          .filter(card => card.style.display !== 'none' && card.style.opacity !== '0');
        
        return {
          success: true,
          filteredBy: 'コンサルタント',
          visibleCardsCount: visibleCards.length,
          totalCards: document.querySelectorAll('.achievement-card').length
        };
      } catch (error) {
        return { error: error.toString() };
      }
    });
    
    // レポート作成
    const report = {
      timestamp: new Date().toISOString(),
      page: 'achievement/index.html',
      htmlValidation,
      filterFunctionality: filterResult
    };
    
    console.log('検証レポート:');
    console.log(JSON.stringify(report, null, 2));
    
    // レポートをファイルに保存
    await fs.writeFile('achievement-validation-report.json', JSON.stringify(report, null, 2));
    console.log('レポートが achievement-validation-report.json に保存されました');
    
  } catch (error) {
    console.error('テスト実行中にエラーが発生しました:', error);
  } finally {
    await browser.close();
  }
})();
