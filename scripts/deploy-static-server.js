const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(process.cwd());
const port = Number(process.argv[2] || 4173);

const MIME = Object.freeze({
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon'
});

function resolveRequestPath(requestUrl) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(requestUrl, 'http://127.0.0.1').pathname);
  } catch {
    const error = new Error('Malformed URL');
    error.statusCode = 400;
    throw error;
  }

  const relative = pathname.replace(/^\/+/, '');
  const filePath = path.resolve(root, relative || 'index.html');
  const rootPrefix = root.endsWith(path.sep) ? root : root + path.sep;

  if (filePath !== root && !filePath.startsWith(rootPrefix)) {
    const error = new Error('Forbidden path');
    error.statusCode = 403;
    throw error;
  }

  return filePath;
}

function sendText(response, statusCode, message) {
  const body = message + '\n';
  response.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store'
  });
  response.end(body);
}

const server = http.createServer(async (request, response) => {
  const method = request.method || 'GET';
  if (method !== 'GET' && method !== 'HEAD') {
    response.writeHead(405, {'Allow': 'GET, HEAD'});
    response.end();
    return;
  }

  let filePath;
  try {
    filePath = resolveRequestPath(request.url || '/');
  } catch (error) {
    sendText(response, error.statusCode || 400, error.message);
    return;
  }

  try {
    let stat = await fs.promises.stat(filePath);
    if (stat.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
      stat = await fs.promises.stat(filePath);
    }

    const headers = {
      'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Content-Length': stat.size,
      'Cache-Control': 'no-store'
    };
    response.writeHead(200, headers);

    if (method === 'HEAD') {
      response.end();
      return;
    }

    fs.createReadStream(filePath).pipe(response);
  } catch (error) {
    sendText(response, error.code === 'ENOENT' ? 404 : 500, error.code === 'ENOENT' ? 'Not found' : 'Server error');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log('Dirt Archive concurrent static server listening on http://127.0.0.1:' + port);
});
