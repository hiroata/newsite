/**
 * 記事レイアウトトラブルシューティングスクリプト
 * 
 * このスクリプトは縦1行問題など、ブログ記事のレイアウト問題を修正するために使用します
 */

document.addEventListener('DOMContentLoaded', function() {
  // デバッグ情報を表示
  console.log('レイアウト修正ツールを起動します');
  
  // スタイルを検証
  const articleContainer = document.querySelector('.article-container');
  const articleMain = document.querySelector('.article-main');
  const leftSidebar = document.querySelector('.article-left-sidebar');
  const rightSidebar = document.querySelector('.article-right-sidebar');
  const articleContent = document.querySelector('.article-content');
    // グリッドレイアウトの修正を適用
  if (articleContainer) {
    console.log('記事コンテナのグリッドレイアウトを修正します');
    
    // CSS変数でレイアウト比率を設定 - 1:7:2の比率
    document.documentElement.style.setProperty('--left-col-width', '1fr');
    document.documentElement.style.setProperty('--main-col-width', '7fr');
    document.documentElement.style.setProperty('--right-col-width', '2fr');
    
    // 直接スタイルを適用
    articleContainer.style.display = 'grid';
    articleContainer.style.gridTemplateColumns = 'var(--left-col-width) var(--main-col-width) var(--right-col-width)';
    articleContainer.style.gap = '30px';
    articleContainer.style.width = '100%';
    articleContainer.style.maxWidth = '1200px';
    articleContainer.style.margin = '0 auto';
    articleContainer.style.overflow = 'visible';
    
    console.log('グリッドテンプレート設定:', articleContainer.style.gridTemplateColumns);
  }
  
  // サイドバーの表示を強制
  if (leftSidebar) {
    leftSidebar.style.display = 'block';
    leftSidebar.style.width = '100%';
    leftSidebar.style.minWidth = '60px';
  }
  
  if (rightSidebar) {
    rightSidebar.style.display = 'block';
    rightSidebar.style.width = '100%';
  }
  
  // メインコンテンツエリアの修正
  if (articleMain) {
    articleMain.style.width = '100%';
    articleMain.style.maxWidth = 'none';
    articleMain.style.overflow = 'visible';
  }
  
  // コンテンツ部分の修正
  if (articleContent) {
    articleContent.style.width = '100%';
    articleContent.style.maxWidth = 'none';
    articleContent.style.overflow = 'visible';
    
    // 画像のはみ出し防止
    const images = articleContent.querySelectorAll('img');
    images.forEach(img => {
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
    });
    
    // テキストの最大幅設定
    const paragraphs = articleContent.querySelectorAll('p');
    paragraphs.forEach(p => {
      p.style.maxWidth = '100%';
      p.style.wordBreak = 'break-word';
    });
  }
  
  // シェアボックスを非表示
  const shareBox = document.querySelector('.share-box');
  if (shareBox) {
    shareBox.style.display = 'none';
  }
    // レスポンシブ対応
  function adjustLayout() {
    const windowWidth = window.innerWidth;
    
    if (windowWidth <= 768) {
      // モバイル表示
      if (articleContainer) {
        articleContainer.style.gridTemplateColumns = '0.5fr 9fr 0.5fr';
        articleContainer.style.gap = '10px';
      }
    } else if (windowWidth <= 992) {
      // タブレット表示
      if (articleContainer) {
        articleContainer.style.gridTemplateColumns = '0.8fr 7.5fr 1.7fr';
        articleContainer.style.gap = '20px';
      }
    } else {
      // デスクトップ表示
      if (articleContainer) {
        articleContainer.style.gridTemplateColumns = 'var(--left-col-width) var(--main-col-width) var(--right-col-width)';
        articleContainer.style.gap = '30px';
      }
    }
  }
  
  // 初期調整
  adjustLayout();
  
  // リサイズ時に再調整
  window.addEventListener('resize', adjustLayout);
  
  console.log('レイアウト修正完了');
});
