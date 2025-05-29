/* =============================================================================
   INDEX PAGE APPLE STYLE GUIDE
   トップページ専用のAppleスタイルガイド
   
   このファイルの使用ガイドライン：
   - index.htmlでのみ使用
   - bodyタグにindex-pageクラスを追加必須
   - 他のページには適用しない
   - ダークモードは自動適用されない
   
   HTML構造例：
   <body class="index-page">
     <section class="apple-hero">
       <div class="apple-hero-container">
         <h1 class="apple-hero-title">タイトル</h1>
         <p class="apple-hero-subtitle">サブタイトル</p>
         <div class="apple-hero-cta">
           <a href="#" class="apple-btn-primary">メインボタン</a>
           <a href="#" class="apple-btn-secondary">サブボタン</a>
         </div>
         <div class="apple-hero-benefits">
           <div class="apple-benefit-item">特徴1</div>
           <div class="apple-benefit-item">特徴2</div>
         </div>
         <div class="apple-hero-visual">
           <img src="..." alt="..." class="apple-hero-image">
         </div>
       </div>
       <div class="scroll-indicator"></div>
     </section>
   </body>
   
   クラス命名規則：
   - .index-page (ルートクラス)
   - .apple-hero* (ヒーローセクション)
   - .apple-btn* (ボタン)
   - .apple-benefit* (特徴リスト)
   - .scroll-indicator (スクロール案内)
   
   注意事項：
   - 全てのスタイルは.index-pageでスコープされている
   - 他のページには一切影響しない
   - ダークモードの強制適用なし
   
============================================================================= */
