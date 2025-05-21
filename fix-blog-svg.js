// SVGデータを読み込む関数とファイルを修正する関数

const fs = require('fs');
const path = require('path');
const BLOG_DIR = path.join(__dirname, 'blog');
const COMMON_DIR = path.join(__dirname, 'common');

// SVGデータの読み込み
function loadSvgDefs() {
  try {
    const svgDefsPath = path.join(COMMON_DIR, 'svg-defs.html');
    if (fs.existsSync(svgDefsPath)) {
      return fs.readFileSync(svgDefsPath, 'utf8');
    } else {
      console.error('SVG-defs.html が見つかりません。');
      return '';
    }
  } catch (err) {
    console.error(`SVG定義の読み込みエラー: ${err}`);
    return '';
  }
}

// SVGプレースホルダーを置換する関数
function replaceSvgPlaceholder(filePath) {
  try {
    const svgDefs = loadSvgDefs();
    if (!svgDefs) return false;
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // SVGプレースホルダーを検出して置換
    const svgPlaceholder = /<div id="svg-defs-placeholder"><\/div>/;
    if (svgPlaceholder.test(content)) {
      const modified = content.replace(svgPlaceholder, svgDefs);
      fs.writeFileSync(filePath, modified, 'utf8');
      return true;
    }
    return false;
  } catch (err) {
    console.error(`Error processing ${filePath}: ${err}`);
    return false;
  }
}

// メイン処理
function main() {
  const files = fs.readdirSync(BLOG_DIR)
    .filter(file => file.endsWith('.html'))
    .map(file => path.join(BLOG_DIR, file));
    
  console.log(`HTMLファイルが${files.length}件見つかりました。`);
  
  let successCount = 0;
  for (const file of files) {
    if (replaceSvgPlaceholder(file)) {
      successCount++;
      console.log(`SVG定義を組み込み: ${file}`);
    }
  }
  
  console.log(`\n===== 処理結果 =====`);
  console.log(`合計ファイル数: ${files.length}`);
  console.log(`SVG定義を組み込んだファイル数: ${successCount}`);
}

// common/svg-defs.htmlが存在しない場合は作成する
function createSvgDefsIfNeeded() {
  const svgDefsPath = path.join(COMMON_DIR, 'svg-defs.html');
  if (!fs.existsSync(COMMON_DIR)) {
    fs.mkdirSync(COMMON_DIR, { recursive: true });
  }
  
  if (!fs.existsSync(svgDefsPath)) {
    const svgDefs = `<!-- SVG 定義ファイル -->
<!-- ソーシャルメディアアイコン -->
<svg aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <!-- X (Twitter) -->
        <symbol id="icon-x" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
        </symbol>
        
        <!-- Facebook -->
        <symbol id="icon-facebook" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </symbol>
        
        <!-- Instagram -->
        <symbol id="icon-instagram" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </symbol>
        
        <!-- LINE -->
        <symbol id="icon-line" viewBox="0 0 24 24">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.348 0 .63.285.63.63 0 .349-.282.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.428.596-.075.021-.15.031-.226.031-.177 0-.351-.09-.453-.25l-2.18-3.006v2.629c0 .345-.282.63-.631.63-.345 0-.63-.285-.63-.63V8.108c0-.272.174-.513.428-.595.075-.023.149-.033.226-.033.176 0 .35.09.451.25l2.184 3.01V8.108c0-.345.282-.63.63-.63.346 0 .629.285.629.63v4.771zm-7.633.614c.344 0 .63.283.63.629 0 .344-.286.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.348 0 .63.285.63.63 0 .349-.282.63-.63.63H7.36v1.125h1.756c.348 0 .629.285.629.63 0 .344-.282.629-.629.629H7.36v1.125h1.756zm-3.35-4.771c0-.346-.283-.63-.629-.63-.345 0-.627.284-.627.63v2.094c0 .42-.297 1.095-.936 1.095-.639 0-.935-.675-.935-1.095V8.108c0-.346-.282-.63-.63-.63-.345 0-.627.284-.627.63v2.094c0 1.471 1.103 2.356 2.192 2.356 1.09 0 2.192-.885 2.192-2.356V8.108zM24 10.748c0-4.942-4.963-8.962-11.06-8.962C6.844 1.785 1.88 5.805 1.88 10.748c0 4.419 3.921 8.123 9.216 8.824.358.082.847.252.971.578.112.31.72.797.54.981-.24.2-.163 1.34-1.584 2.1 3.454-.641 6.142-2.071 7.977-3.894 1.185-1.177 2.576-2.851 2.246-6.589z"/>
        </symbol>
    </defs>
</svg>`;
    fs.writeFileSync(svgDefsPath, svgDefs, 'utf8');
    console.log(`SVG定義ファイルを作成しました: ${svgDefsPath}`);
  }
}

createSvgDefsIfNeeded();
main();
