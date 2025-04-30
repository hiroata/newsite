/**
 * オートファネル大学 JavaScriptファイル
 * 各種インタラクティブ機能を実装
 */
document.addEventListener('DOMContentLoaded', function() {

    // common.js にハンバーガーメニュー機能が移動したため、このブロックは削除 (前回削除済み)

    // --- ハンバーガーメニュートグル機能 (手動管理に合わせて修正) ---
    const hamburgerButton = document.querySelector('.hamburger-button');
    // モバイルメニューのDOMはHTMLにあらかじめ存在することを想定
    const mobileMenu = document.querySelector('.mobile-menu'); // index.html に追加した .mobile-menu 要素

    if (hamburgerButton && mobileMenu) {
        hamburgerButton.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            // bodyのoverflow制御（メニュー開閉で背景スクロールを止める）
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
             // WAI-ARIA属性を切り替え
            this.setAttribute('aria-expanded', this.classList.contains('active'));
        });

        // メニュー内のリンクをクリックしたらメニューを閉じる（任意）
        mobileMenu.querySelectorAll('a').forEach(link => {
             link.addEventListener('click', () => {
                 if (hamburgerButton && mobileMenu) { // 要素が存在するかチェック
                     hamburgerButton.classList.remove('active');
                     mobileMenu.classList.remove('active');
                     document.body.style.overflow = '';
                     hamburgerButton.setAttribute('aria-expanded', 'false');
                 }
             });
        });
    } else {
         if (!hamburgerButton) console.warn('Hamburger button not found.'); // 開発時の警告
         if (!mobileMenu) console.warn('Mobile menu element not found.'); // 開発時の警告
    }
    // -----------------------------------------------------------


    // コーススライダー機能 (必要であれば残す)
    // ... (前回の script.js アップデート案のコードを貼り付け) ...

    // アコーディオントグル機能 (実績タブ用 - 必要であれば残す)
    // ... (前回の script.js アップデート案のコードを貼り付け) ...

    // 実績タブ切り替え機能 (必要であれば残す)
    // ... (前回の script.js アップデート案のコードを貼り付け) ...

    // FAQ切り替え機能 (必要であれば残す)
    // ... (前回の script.js アップデート案のコードを貼り付け) ...

    // フィルターボタン機能（書籍、セミナーページなど - 必要であれば残す)
    // ... (前回の script.js アップデート案のコードを貼り付け) ...

    // ページネーション機能 (必要であれば残す)
    // ... (前回の script.js アップデート案のコードを貼り付け) ...

    // 画像ギャラリー機能 (ライトボックス - 必要であれば残す)
    // ... (前回の script.js アップデート案のコードを貼り付け) ...

    // スライドショー機能（トップページなど - 必要であれば残す)
    // ... (前回の script.js アップデート案のコードを貼り付け) ...

    // スムーススクロール機能 (必要であれば残す)
    // ... (前回の script.js アップデート案のコードを貼り付け) ...

    // スクロールアニメーション効果 (必要であれば残す)
    // ... (前回の script.js アップデート案のコードを貼り付け) ...

    // フォーム検証機能 (必要であれば残す)
    // ... (前回の script.js アップデート案のコードを貼り付け) ...

});