/**
 * 画像処理に関連する共通関数
 * 
 * 各画像処理ツールで使用する処理のヘルパー関数をまとめたファイル
 */

/**
 * 画像をリサイズする関数
 * @param {File} file - リサイズする画像ファイル
 * @param {Number} maxWidth - 最大幅
 * @param {Number} maxHeight - 最大高さ
 * @param {Number} quality - 画質（0-100）
 * @returns {Promise<Blob>} リサイズされた画像のBlob
 */
function resizeImage(file, maxWidth, maxHeight, quality) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function() {
      // 元のサイズ
      const origWidth = img.width;
      const origHeight = img.height;
      
      // リサイズ後のサイズを計算
      let newWidth = origWidth;
      let newHeight = origHeight;
      
      // アスペクト比を保ったままリサイズ
      const aspectRatio = origWidth / origHeight;
      
      // 最大幅に合わせてリサイズ
      if (origWidth > maxWidth) {
        newWidth = maxWidth;
        newHeight = newWidth / aspectRatio;
      }
      
      // 最大高さに合わせてリサイズ
      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = newHeight * aspectRatio;
      }
      
      // 小数点以下を切り捨て
      newWidth = Math.floor(newWidth);
      newHeight = Math.floor(newHeight);
      
      // リサイズの必要がなければ元の画像を返す
      if (newWidth >= origWidth && newHeight >= origHeight) {
        file.arrayBuffer().then(buffer => {
          resolve(new Blob([buffer], { type: file.type }));
        }).catch(reject);
        return;
      }
      
      // キャンバスでリサイズ
      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      
      // 出力
      const mimeType = file.type;
      
      canvas.toBlob(blob => {
        resolve(blob);
      }, mimeType, quality / 100);
    };
    
    img.onerror = reject;
    
    // 画像読み込み
    const reader = new FileReader();
    reader.onload = function(e) {
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * PNG画像をJPEG形式に変換する関数
 * @param {File} file - 変換する画像ファイル
 * @param {Number} quality - 画質（0-100）
 * @param {String} bgColor - 背景色（HEXカラー）
 * @returns {Promise<Blob>} JPEG画像のBlob
 */
function convertPngToJpeg(file, quality, bgColor) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      
      // 背景色を設定して塗りつぶし
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 画像を描画
      ctx.drawImage(img, 0, 0);
      
      // JPEGに変換
      canvas.toBlob(blob => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('JPEG変換に失敗しました'));
        }
      }, 'image/jpeg', quality / 100);
    };
    
    img.onerror = () => reject(new Error('画像の読み込みに失敗しました'));
    
    // 画像読み込み
    const reader = new FileReader();
    reader.onload = e => {
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'));
    reader.readAsDataURL(file);
  });
}

/**
 * 画像をWebP形式に変換する関数
 * @param {File} file - 変換する画像ファイル 
 * @param {Number} quality - 画質（0-100）
 * @returns {Promise<Blob>} WebP画像のBlob
 */
function convertToWebP(file, quality) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      // WebPに変換
      canvas.toBlob(blob => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('WebP変換に失敗しました'));
        }
      }, 'image/webp', quality / 100);
    };
    
    img.onerror = () => reject(new Error('画像の読み込みに失敗しました'));
    
    // 画像読み込み
    const reader = new FileReader();
    reader.onload = e => {
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'));
    reader.readAsDataURL(file);
  });
}

/**
 * WebPサポート確認関数
 * @returns {Boolean} WebPサポート状況
 */
function checkWebPSupport() {
  const canvas = document.createElement('canvas');
  if (!canvas.getContext || !canvas.getContext('2d')) {
    return false;
  }
  
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
}
