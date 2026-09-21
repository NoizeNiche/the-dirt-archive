#!/usr/bin/env node

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(process.cwd());
const PORT = Number(process.env.PORT || 4173);

const MIME_TYPES = Object.freeze({
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
});

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

function resolveRequestPath(requestUrl) {
  const pathname = new URL(requestUrl, `http://127.0.0.1:${PORT}`).pathname;
  let relative = decodeURIComponent(pathname.replace(/^\/+/, ''));
  if (!relative) relative = 'index.html';

  const filePath = path.resolve(ROOT, relative);
  const rootPrefix = ROOT.endsWith(path.sep) ? ROOT : ROOT + path.sep;

  if (filePath !== ROOT && !filePath.startsWith(rootPrefix)) {
    const error = new Error('Forbidden path');
    error.code = 'FORBIDDEN';
    throw error;
  }

  return filePath;
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    send(res, 405, 'Method Not Allowed', { Allow: 'GET, HEAD' });
    return;
  }

  let filePath;
  try {
    filePath = resolveRequestPath(req.url || '/');
  } catch (error) {
    const status = error.code === 'FORBIDDEN' ? 403 : 400;
    send(res, status, status === 403 ? 'Forbidden' : 'Bad request');
    return;
  }

  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) {
      send(res, 404, 'Not found');
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[extension] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': 'no-store',
      'Connection': 'close'
    });

    if (req.method === 'HEAD') {
      res.end();
      return;
    }

    fs.createReadStream(filePath).on('error', () => {
      if (!res.headersSent) {
        send(res, 500, 'Internal server error');
      } else {
        res.destroy();
      }
    }).pipe(res);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Static archive server listening on http://127.0.0.1:${PORT}`);
});

function shutdown() {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5000).unref();
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
