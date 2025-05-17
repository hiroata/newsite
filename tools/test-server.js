/**
 * まえゆきツールのローカルテストサーバー
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// サーバーのポート
const PORT = 3000;

// MIMEタイプのマッピング
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf',
};

// ルートディレクトリ（サーバーを実行するディレクトリの親ディレクトリ）
const ROOT_DIR = path.join(__dirname, '..');

/**
 * リクエストハンドラ
 */
const requestHandler = (req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  // URLをパース
  const parsedUrl = url.parse(req.url);
  
  // パスを取得（デコードする）
  let pathname = decodeURIComponent(parsedUrl.pathname);
  
  // インデックスファイルのリダイレクト
  if (pathname.endsWith('/')) {
    pathname += 'index.html';
  }
  
  // ファイルパスを構築
  const filePath = path.join(ROOT_DIR, pathname);
  
  // ファイルが存在するか確認
  fs.exists(filePath, (exists) => {
    if (!exists) {
      // 404 Not Found
      console.log(`ファイルが見つかりません: ${filePath}`);
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    
    // ディレクトリの場合
    if (fs.statSync(filePath).isDirectory()) {
      // リダイレクト
      const redirectPath = path.join(pathname, 'index.html');
      res.writeHead(302, {
        'Location': redirectPath
      });
      res.end();
      return;
    }
    
    // ファイル拡張子からMIMEタイプを特定
    const ext = path.parse(filePath).ext;
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    
    // ファイルを読み込んでレスポンスを返す
    fs.readFile(filePath, (err, content) => {
      if (err) {
        // 500 Internal Server Error
        console.error(`ファイル読み込みエラー: ${err}`);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`サーバーエラー: ${err.code}`);
        return;
      }
      
      // 200 OK
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
};

// サーバーを作成
const server = http.createServer(requestHandler);

// サーバーを起動
server.listen(PORT, () => {
  console.log(`サーバーが http://localhost:${PORT} で起動しました`);
  console.log(`まえゆきツールを表示するには http://localhost:${PORT}/tools/ にアクセスしてください`);
  console.log(`終了するには Ctrl+C を押してください`);
});
