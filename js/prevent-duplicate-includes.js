/**
 * include.jsの重複を防止するパッチ
 * 
 * このスクリプトをHTMLファイルに含めることで、include.jsが複数回ロードされるのを防ぎます。
 * これは一時的な修正であり、より根本的な解決策を実装するまでの暫定措置です。
 */

// スクリプトがすでにロードされているかをチェックする関数を定義
// このスクリプトはhead内で先に読み込まれることを想定しています
window.isScriptLoaded = function(src) {
  var scripts = document.getElementsByTagName('script');
  for (var i = 0; i < scripts.length; i++) {
    if (scripts[i].src.indexOf(src) !== -1) {
      return true;
    }
  }
  return false;
};

// インクルードスクリプトを安全にロードする関数
window.loadIncludeJsSafely = function() {
  if (!window.isScriptLoaded('/js/include.js')) {
    var script = document.createElement('script');
    script.src = '/js/include.js';
    document.head.appendChild(script);
    console.log('include.jsが安全にロードされました');
    return true;
  } else {
    console.log('include.jsは既にロード済みです');
    return false;
  }
};

// include.js重複参照を削除する関数
window.cleanupDuplicateIncludes = function() {
  var scripts = document.getElementsByTagName('script');
  var includeJsScripts = [];
  
  // include.jsスクリプト要素をすべて収集
  for (var i = 0; i < scripts.length; i++) {
    if (scripts[i].src.indexOf('/js/include.js') !== -1) {
      includeJsScripts.push(scripts[i]);
    }
  }
  
  // 最初の1つ以外を削除
  if (includeJsScripts.length > 1) {
    for (var j = 1; j < includeJsScripts.length; j++) {
      includeJsScripts[j].parentNode.removeChild(includeJsScripts[j]);
      console.log('重複するinclude.js参照を削除しました');
    }
  }
};

// ロード時の処理
window.addEventListener('DOMContentLoaded', function() {
  // include.js重複をクリーンアップ
  window.cleanupDuplicateIncludes();
});
