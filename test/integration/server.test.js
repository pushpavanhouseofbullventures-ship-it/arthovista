import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { Duplex } from 'node:stream';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

process.env.NODE_ENV = 'test';

function dispatchRequest(server, { method = 'GET', url = '/', headers = {}, body = null }) {
  return new Promise((resolve) => {
    let rawOutput = '';
    const socket = new Duplex({
      read() {},
      write(chunk, enc, cb) {
        rawOutput += chunk.toString();
        cb();
      },
    });
    socket.cork = () => {};
    socket.uncork = () => {};
    socket.destroy = () => {};

    const req = new http.IncomingMessage(socket);
    req.method = method;
    req.url = url;
    req.headers = { host: 'localhost', ...headers };

    const res = new http.ServerResponse(req);
    res.assignSocket(socket);

    res.on('finish', () => {
      const headerEndIndex = rawOutput.indexOf('\r\n\r\n');
      const headerPart = headerEndIndex !== -1 ? rawOutput.slice(0, headerEndIndex) : '';
      const bodyPart = headerEndIndex !== -1 ? rawOutput.slice(headerEndIndex + 4) : rawOutput;

      const [statusLine, ...headerLines] = headerPart.split('\r\n');
      const statusCode = Number(statusLine.split(' ')[1]) || res.statusCode;

      const parsedHeaders = {};
      for (const line of headerLines) {
        const [k, ...v] = line.split(': ');
        if (k) parsedHeaders[k.toLowerCase()] = v.join(': ');
      }

      resolve({
        statusCode,
        headers: parsedHeaders,
        body: bodyPart,
      });
    });

    server.emit('request', req, res);

    if (body) {
      req.emit('data', Buffer.from(typeof body === 'object' ? JSON.stringify(body) : body));
    }
    req.emit('end');
  });
}

describe('Server & Routing Integration Tests', () => {
  let server;

  before(async () => {
    const serverModule = await import('../../server.mjs');
    server = serverModule.server;
  });

  after(async () => {
    try {
      const mongoose = (await import('mongoose')).default;
      await mongoose.disconnect();
    } catch (_) {}
  });

  test('Vite production build dist directory exists', () => {
    const indexPath = join(process.cwd(), 'dist', 'index.html');
    assert.ok(existsSync(indexPath), 'dist/index.html should exist');
  });

  test('GET / returns 200 OK and serves index.html with ArthoVista title', async () => {
    const res = await dispatchRequest(server, { method: 'GET', url: '/' });
    assert.equal(res.statusCode, 200);
    assert.ok(res.body.includes('ArthoVista'), 'Response should include ArthoVista');
  });

  test('GET /about falls back to index.html for Single Page Application routing', async () => {
    const res = await dispatchRequest(server, { method: 'GET', url: '/about' });
    assert.equal(res.statusCode, 200);
    assert.ok(res.body.includes('id="root"'), 'SPA fallback should render root div');
  });

  test('OPTIONS /api/contact responds with CORS headers', async () => {
    const res = await dispatchRequest(server, { method: 'OPTIONS', url: '/api/contact' });
    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['access-control-allow-origin'], '*');
  });

  test('GET nonexistent static file with extension returns 404 File Not Found', async () => {
    const res = await dispatchRequest(server, { method: 'GET', url: '/missing-asset-image.png' });
    assert.equal(res.statusCode, 404);
  });
});
