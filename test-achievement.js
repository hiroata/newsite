/**
 * achievement フォルダのファイルをテストするスクリプト
 * コンソールエラーがないかを確認
 */

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // ログ収集
  const logs = [];
  page.on('console', message => {
    logs.push({
      type: message.type(),
      text: message.text()
    });
  });
  
  // エラー収集
  const errors = [];
  page.on('pageerror', error => {
    errors.push(error.message);
  });
  
  try {
    // ページ読み込み
    console.log('ページをテスト中: http://localhost:8080/achievement/index.html');
    await page.goto('http://localhost:8080/achievement/index.html', { waitUntil: 'networkidle0' });
    
    // 画像の最適化をチェック
    const images = await page.$$eval('.achievement-image img', imgs => {
      return imgs.map(img => ({
        src: img.src,
        alt: img.alt,
        hasWidth: img.hasAttribute('width'),
        hasHeight: img.hasAttribute('height'),
        width: img.width,
        height: img.height,
      }));
    });
      // フィルターボタンをテスト
    await page.click('.filter-button:nth-child(2)');
    await new Promise(r => setTimeout(r, 1000));
    
    // 結果の出力
    console.log('=====================');
    console.log('テスト結果:');
    console.log('=====================');
    
    if (errors.length === 0) {
      console.log('✅ JavaScriptエラーはありません');
    } else {
      console.log('❌ JavaScriptエラーが検出されました:');
      errors.forEach(error => console.log(` - ${error}`));
    }
    
    console.log('\n画像最適化チェック:');
    const optimizedImages = images.filter(img => img.hasWidth && img.hasHeight);
    console.log(`✅ 最適化済み画像: ${optimizedImages.length}/${images.length}`);
    
    if (optimizedImages.length < images.length) {
      console.log('⚠️ 最適化されていない画像があります:');
      images
        .filter(img => !img.hasWidth || !img.hasHeight)
        .forEach(img => console.log(` - ${img.src} (${img.alt})`));
    }
    
    console.log('\nコンソールログ:');
    if (logs.length === 0) {
      console.log('コンソールログはありません');
    } else {
      logs.forEach(log => {
        const icon = log.type === 'error' ? '❌' : 
                    log.type === 'warning' ? '⚠️' : 'ℹ️';
        console.log(`${icon} [${log.type}] ${log.text}`);
      });
    }
    
  } catch (error) {
    console.error('テスト実行中にエラーが発生しました:', error);
  } finally {
    await browser.close();
  }
})();
