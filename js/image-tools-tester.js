// image-tools-tester.js
/**
 * 画像ツール共通ユーティリティのテスト
 * 新しいツールを作成する際や、共通ユーティリティを更新した後のテスト用スクリプト
 */

// テスト結果を保存する配列
const testResults = [];

// テスト実行
async function runTests() {
  // テスト開始
  console.log('=== 画像ツール共通ユーティリティテスト開始 ===');
  
  try {
    // 1. 共通ユーティリティファイルの存在確認
    await testFileExistence('/js/image-tools-utils.js', 'image-tools-utils.js');
    await testFileExistence('/css/image-tools-styles.css', 'image-tools-styles.css');
    await testFileExistence('/js/tools-cache.js', 'tools-cache.js');
    
    // 2. 共通関数テスト
    await testImageToolsUtils();
    
    // 3. キャッシュ機能テスト
    await testCachingUtils();
    
    // 4. ツールテンプレートテスト
    await testToolTemplate();
    
    // テスト結果の集計と表示
    const passedTests = testResults.filter(r => r.passed).length;
    const failedTests = testResults.length - passedTests;
    
    console.log(`\n=== テスト完了: ${passedTests}/${testResults.length} 成功 ===`);
    
    if (failedTests > 0) {
      console.log('\n=== 失敗したテスト ===');
      testResults.filter(r => !r.passed).forEach(r => {
        console.error(`- ${r.name}: ${r.error}`);
      });
    }
  } catch (error) {
    console.error('テスト実行中にエラーが発生しました:', error);
  }
}

// ファイルの存在確認テスト
async function testFileExistence(path, name) {
  try {
    const response = await fetch(path, { method: 'HEAD' });
    const passed = response.ok;
    const size = response.headers.get('content-length') || 'unknown';
    
    testResults.push({
      name: `${name} の存在確認`,
      passed,
      error: passed ? '' : `${path} が見つかりません`,
      details: passed ? `サイズ: ${formatBytes(size)}` : ''
    });
    
    logTestResult(`${name} の存在確認`, passed, passed ? `サイズ: ${formatBytes(size)}` : '');
  } catch (error) {
    testResults.push({
      name: `${name} の存在確認`,
      passed: false,
      error: error.message
    });
    logTestResult(`${name} の存在確認`, false, error.message);
  }
}

// 画像ユーティリティ関数テスト
async function testImageToolsUtils() {
  try {
    // ダミー画像ファイルを作成
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 100, 100);
    
    const blob = await new Promise(resolve => {
      canvas.toBlob(resolve, 'image/png');
    });
    
    const file = new File([blob], 'test.png', { type: 'image/png' });
    
    // 必須関数の存在確認
    const requiredFunctions = [
      'setupFileDropAndSelection',
      'resizeImage',
      'convertToJPEG',
      'convertToWebP',
      'getImageAspectRatio',
      'generateImagePreview',
      'updateUI',
      'createFileItem',
      'downloadProcessedImages',
      'downloadAsZip'
    ];
    
    requiredFunctions.forEach(funcName => {
      const exists = typeof window[funcName] === 'function';
      testResults.push({
        name: `関数 ${funcName} の存在確認`,
        passed: exists,
        error: exists ? '' : `${funcName} 関数が定義されていません`
      });
      
      logTestResult(`関数 ${funcName} の存在確認`, exists);
    });
    
    // リサイズ関数のテスト（実際に呼び出さない）
    if (typeof resizeImage === 'function') {
      try {
        // 関数の引数の確認のみ
        const funcStr = resizeImage.toString();
        const hasCorrectParams = funcStr.includes('file') && 
                               funcStr.includes('maxWidth') && 
                               funcStr.includes('maxHeight') && 
                               funcStr.includes('quality');
        
        testResults.push({
          name: 'resizeImage 関数の引数確認',
          passed: hasCorrectParams,
          error: hasCorrectParams ? '' : '引数が不足しているか誤っています'
        });
        
        logTestResult('resizeImage 関数の引数確認', hasCorrectParams);
      } catch (error) {
        testResults.push({
          name: 'resizeImage 関数の引数確認',
          passed: false,
          error: error.message
        });
        
        logTestResult('resizeImage 関数の引数確認', false, error.message);
      }
    }
    
    // アスペクト比取得関数のテスト（実際に実行）
    if (typeof getImageAspectRatio === 'function') {
      try {
        const aspectRatio = await getImageAspectRatio(file);
        const passed = aspectRatio === 1; // 100x100なので1になるはず
        
        testResults.push({
          name: 'getImageAspectRatio 関数のテスト',
          passed,
          error: passed ? '' : `予期しないアスペクト比: ${aspectRatio}`
        });
        
        logTestResult('getImageAspectRatio 関数のテスト', passed, passed ? `アスペクト比: ${aspectRatio}` : '');
      } catch (error) {
        testResults.push({
          name: 'getImageAspectRatio 関数のテスト',
          passed: false,
          error: error.message
        });
        
        logTestResult('getImageAspectRatio 関数のテスト', false, error.message);
      }
    }
  } catch (error) {
    console.error('画像ユーティリティテストエラー:', error);
  }
}

// キャッシュ機能テスト
async function testCachingUtils() {
  try {
    // tools-cache.js からの関数のロードを試行
    let hasCachingModule = false;
    try {
      const module = await import('/js/tools-cache.js');
      hasCachingModule = typeof module === 'object' && module !== null;
      
      testResults.push({
        name: 'キャッシュモジュールのインポート',
        passed: hasCachingModule,
        error: hasCachingModule ? '' : 'キャッシュモジュールが正しく読み込めません'
      });
      
      logTestResult('キャッシュモジュールのインポート', hasCachingModule);
      
      if (hasCachingModule) {
        // 必須キャッシュ関数の存在確認
        const requiredCacheFunctions = [
          'registerServiceWorker',
          'optimizeCache',
          'cacheAssets',
          'fetchFromCache'
        ];
        
        requiredCacheFunctions.forEach(funcName => {
          const exists = typeof module[funcName] === 'function';
          testResults.push({
            name: `キャッシュ関数 ${funcName} の存在確認`,
            passed: exists,
            error: exists ? '' : `${funcName} 関数が定義されていません`
          });
          
          logTestResult(`キャッシュ関数 ${funcName} の存在確認`, exists);
        });
      }
    } catch (error) {
      testResults.push({
        name: 'キャッシュモジュールのインポート',
        passed: false,
        error: error.message
      });
      
      logTestResult('キャッシュモジュールのインポート', false, error.message);
    }
    
    // サービスワーカーの登録確認
    let swRegistration = null;
    try {
      if ('serviceWorker' in navigator) {
        swRegistration = await navigator.serviceWorker.getRegistration('/service-worker.js');
        const swExists = swRegistration !== undefined;
        
        testResults.push({
          name: 'サービスワーカーの登録状態確認',
          passed: true,
          details: swExists ? 'サービスワーカー登録済み' : 'サービスワーカー未登録'
        });
        
        logTestResult('サービスワーカーの登録状態確認', true, swExists ? 'サービスワーカー登録済み' : 'サービスワーカー未登録');
      } else {
        testResults.push({
          name: 'サービスワーカーの登録状態確認',
          passed: true,
          details: 'サービスワーカーAPIがサポートされていません'
        });
        
        logTestResult('サービスワーカーの登録状態確認', true, 'サービスワーカーAPIがサポートされていません');
      }
    } catch (error) {
      testResults.push({
        name: 'サービスワーカーの登録状態確認',
        passed: false,
        error: error.message
      });
      
      logTestResult('サービスワーカーの登録状態確認', false, error.message);
    }
  } catch (error) {
    console.error('キャッシュ機能テストエラー:', error);
  }
}

// ツールテンプレートテスト
async function testToolTemplate() {
  try {
    // テンプレートの存在確認
    const response = await fetch('/tools/image-tool-template.html', { method: 'HEAD' });
    const templateExists = response.ok;
    
    testResults.push({
      name: 'ツールテンプレートの存在確認',
      passed: templateExists,
      error: templateExists ? '' : 'image-tool-template.html が見つかりません'
    });
    
    logTestResult('ツールテンプレートの存在確認', templateExists);
    
    if (templateExists) {
      // テンプレートの内容検証
      const templateContent = await (await fetch('/tools/image-tool-template.html')).text();
      
      // 必須要素の確認
      const requiredElements = [
        { name: '画像ツールCSS参照', pattern: '/css/image-tools-styles.css' },
        { name: '共通ユーティリティJS参照', pattern: '/js/image-tools-utils.js' },
        { name: 'JSZipライブラリ参照', pattern: 'jszip' },
        { name: 'ドロップエリア', pattern: 'dropArea' },
        { name: 'ファイル処理関数', pattern: 'handleFiles' },
        { name: 'ダウンロード処理', pattern: 'downloadProcessedImages' }
      ];
      
      requiredElements.forEach(elem => {
        const exists = templateContent.includes(elem.pattern);
        testResults.push({
          name: `テンプレートの ${elem.name} 確認`,
          passed: exists,
          error: exists ? '' : `${elem.pattern} が見つかりません`
        });
        
        logTestResult(`テンプレートの ${elem.name} 確認`, exists);
      });
    }
  } catch (error) {
    console.error('ツールテンプレートテストエラー:', error);
  }
}

// テスト結果をコンソールに表示
function logTestResult(name, passed, details = '') {
  const status = passed ? '✓ 成功' : '× 失敗';
  const color = passed ? 'color: green;' : 'color: red;';
  
  console.log(`%c${status}%c ${name}${details ? ': ' + details : ''}`,
    `font-weight: bold; ${color}`, 'font-weight: normal;');
}

// バイト表示整形
function formatBytes(bytes, decimals = 2) {
  if (bytes === 'unknown') return '不明';
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// テスト実行
runTests();
