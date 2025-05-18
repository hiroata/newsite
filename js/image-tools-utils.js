/**
 * 画像ツール共通ユーティリティ関数
 * 画像処理関連のWebツールで使用する共通関数を集約したファイルです
 * 
 * 機能:
 * - ファイルドロップ・選択処理
 * - 画像変換・リサイズ共通処理
 * - UI表示・更新ユーティリティ
 * - ファイルダウンロード処理
 */

/**
 * ドラッグ＆ドロップとファイル選択の設定
 * @param {HTMLElement} dropArea - ドロップエリアのDOM要素
 * @param {HTMLElement} fileInput - ファイル入力DOM要素
 * @param {Function} processFunction - ファイル処理コールバック関数
 */
function setupFileDropAndSelection(dropArea, fileInput, processFunction) {
  // ドロップエリアの設定
  dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('active');
  });
  
  dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('active');
  });
  
  dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('active');
    processFunction(e.dataTransfer.files);
  });
  
  // ファイル選択の設定
  fileInput.addEventListener('change', () => {
    processFunction(fileInput.files);
  });
}

/**
 * UI状態の更新
 * @param {string} message - 表示するメッセージ
 * @param {boolean} isError - エラーメッセージかどうか
 */
function updateUI(message, isError = false) {
  const statusElement = document.getElementById('status');
  if (!statusElement) return;
  
  statusElement.textContent = message;
  statusElement.className = isError ? 'error' : 'success';
  
  // 3秒後にメッセージをクリア
  setTimeout(() => {
    statusElement.textContent = '';
    statusElement.className = '';
  }, 3000);
}

/**
 * ファイルサイズのフォーマット
 * @param {number} bytes - バイト単位のサイズ
 * @return {string} フォーマットされたサイズ文字列
 */
function formatFileSize(bytes) {
  if (bytes < 1024) {
    return bytes + ' B';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + ' KB';
  } else {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }
}

/**
 * ファイル項目の作成と表示
 * @param {File} file - ファイルオブジェクト
 * @param {string} previewSrc - プレビュー画像のソース
 * @param {Function} removeCallback - 削除ボタン用コールバック
 * @return {HTMLElement} 作成したDOM要素
 */
function createFileItem(file, previewSrc, removeCallback) {
  const fileItem = document.createElement('div');
  fileItem.className = 'file-item';
  
  const preview = document.createElement('img');
  preview.className = 'file-preview';
  preview.src = previewSrc;
  preview.alt = file.name;
  preview.loading = 'lazy';
  
  const fileName = document.createElement('div');
  fileName.className = 'file-name';
  fileName.textContent = file.name;
  
  const fileSize = document.createElement('div');
  fileSize.className = 'file-size';
  fileSize.textContent = formatFileSize(file.size);
  
  const removeButton = document.createElement('button');
  removeButton.className = 'file-remove';
  removeButton.textContent = '×';
  removeButton.onclick = () => removeCallback(file);
  
  fileItem.appendChild(preview);
  fileItem.appendChild(fileName);
  fileItem.appendChild(fileSize);
  fileItem.appendChild(removeButton);
  
  return fileItem;
}

/**
 * ファイルメタ情報更新
 * @param {FileList|Array} selectedFiles - 選択されたファイル
 * @param {HTMLElement} filesMetaElement - メタ情報表示要素
 */
function updateFilesMetaUI(selectedFiles, filesMetaElement) {
  if (!selectedFiles || selectedFiles.length === 0) {
    filesMetaElement.textContent = '';
    return;
  }
  
  let totalSize = 0;
  Array.from(selectedFiles).forEach(file => totalSize += file.size);
  
  const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
  filesMetaElement.textContent = `${selectedFiles.length}枚の画像（合計 ${sizeInMB} MB）`;
}

/**
 * 進捗バー更新
 * @param {number} progress - 進捗率（0-100）
 * @param {HTMLElement} progressBar - プログレスバー要素
 * @param {HTMLElement} progressText - プログレステキスト要素
 * @param {number} current - 現在の処理数
 * @param {number} total - 総処理数
 */
function updateProgressBar(progress, progressBar, progressText, current, total) {
  progressBar.style.width = progress + '%';
  progressText.textContent = `画像処理中 (${current}/${total})`;
}

/**
 * 画像リサイズ処理
 * @param {File} file - 画像ファイル
 * @param {number} maxWidth - 最大幅
 * @param {number} maxHeight - 最大高さ
 * @param {number} quality - 品質（1-100）
 * @param {boolean} [maintainAspectRatio=true] - アスペクト比を維持するか
 * @return {Promise<Blob>} リサイズされた画像
 */
function resizeImage(file, maxWidth, maxHeight, quality, maintainAspectRatio = true) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function() {
      // 元のサイズ
      const origWidth = img.width;
      const origHeight = img.height;
      
      // リサイズ後のサイズを計算
      let newWidth = origWidth;
      let newHeight = origHeight;
      
      if (maintainAspectRatio) {
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
      } else {
        // アスペクト比を無視して指定サイズに直接リサイズ
        newWidth = Math.min(maxWidth, origWidth);
        newHeight = Math.min(maxHeight, origHeight);
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
      
      // 元のMIMEタイプで出力
      const mimeType = file.type;
      
      canvas.toBlob(blob => {
        resolve(blob);
      }, mimeType, quality / 100);
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
 * PNG→JPEG変換
 * @param {File} file - PNG画像ファイル
 * @param {number} quality - JPEG品質（1-100）
 * @param {string} bgColor - 背景色（16進数カラーコード）
 * @return {Promise<Blob>} JPEG画像
 */
function convertToJPEG(file, quality, bgColor) {
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
 * WebP形式への変換
 * @param {File} file - 画像ファイル
 * @param {number} quality - WebP品質（1-100）
 * @return {Promise<Blob>} WebP画像
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
 * WebPサポートチェック
 * @return {boolean} WebPがサポートされているかどうか
 */
function checkWebPSupport() {
  const canvas = document.createElement('canvas');
  if (!canvas.getContext || !canvas.getContext('2d')) {
    return false;
  }
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
}

/**
 * 処理済み画像ダウンロード
 * @param {Array} images - 画像配列 [{name, blob}]
 * @param {string} prefix - ファイル名接頭辞（例：'resized_'）
 * @param {HTMLElement} progressText - 進捗テキスト要素（オプション）
 * @return {Promise<void>}
 */
async function downloadProcessedImages(images, prefix = '', progressText = null) {
  if (images.length === 0) return;
  
  // 単一画像の場合は直接ダウンロード
  if (images.length === 1) {
    const url = URL.createObjectURL(images[0].blob);
    const a = document.createElement('a');
    a.href = url;
    
    // 接頭辞がある場合は追加
    const fileName = prefix ? `${prefix}${images[0].name}` : images[0].name;
    a.download = fileName;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    if (progressText) progressText.textContent = 'ダウンロード完了！';
    return;
  }
  
  return downloadAsZip(images, `${prefix}images_${new Date().toISOString().slice(0, 10)}.zip`, progressText);
}

/**
 * ZIP形式でファイル一括ダウンロード
 * @param {Array} files - ファイル配列 [{name, blob}]
 * @param {string} zipName - ZIPファイル名
 * @param {HTMLElement} progressText - 進捗テキスト要素（オプション）
 * @return {Promise<void>}
 */
async function downloadAsZip(files, zipName, progressText = null) {
  if (files.length === 0) return;
  
  if (progressText) progressText.textContent = 'ZIPファイル作成中...';
  
  try {
    // 複数ファイルの場合はZIPでダウンロード
    const zip = new JSZip();
    
    // ファイルをZIPに追加
    files.forEach(file => {
      zip.file(file.name, file.blob);
    });
    
    // ZIPを生成してダウンロード
    const content = await zip.generateAsync({ 
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6 // バランスの取れた圧縮レベル
      }
    });
    
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = zipName || `files_${new Date().toISOString().slice(0, 10)}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    if (progressText) progressText.textContent = 'ダウンロード完了！';
  } catch (error) {
    console.error('ZIPファイル作成エラー:', error);
    if (progressText) progressText.textContent = 'ダウンロードエラー';
    throw error;
  }
}

/**
 * 画像からアスペクト比を取得
 * @param {File} file - 画像ファイル
 * @return {Promise<number>} アスペクト比（幅/高さ）
 */
function getImageAspectRatio(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    
    img.onload = function() {
      const aspectRatio = img.width / img.height;
      resolve(aspectRatio);
    };
    
    img.onerror = () => reject(new Error('画像の読み込みエラー'));
    
    reader.onload = function(e) {
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('ファイル読み込みエラー'));
    reader.readAsDataURL(file);
  });
}

/**
 * プレビュー画像生成
 * @param {File} file - 画像ファイル
 * @param {number} maxSize - プレビュー最大サイズ
 * @return {Promise<string>} 画像データURL
 */
function generateImagePreview(file, maxSize = 100) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        // サイズ計算
        const aspectRatio = img.width / img.height;
        let width, height;
        
        if (aspectRatio >= 1) {
          // 横長画像
          width = Math.min(maxSize, img.width);
          height = width / aspectRatio;
        } else {
          // 縦長画像
          height = Math.min(maxSize, img.height);
          width = height * aspectRatio;
        }
        
        // キャンバスにリサイズして描画
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // DataURLを返す
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = () => reject(new Error('プレビュー生成エラー'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('ファイル読み込みエラー'));
    reader.readAsDataURL(file);
  });
}
