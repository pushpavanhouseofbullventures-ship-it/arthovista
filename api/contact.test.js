import { describe, it, expect, vi } from 'vitest';
import handler from './contact.js';

describe('Vercel Contact API Handler (/api/contact)', () => {
  const createMockRes = () => {
    const res = {
      statusCode: 200,
      headers: {},
      setHeader: vi.fn((k, v) => { res.headers[k] = v; return res; }),
      status: vi.fn((code) => { res.statusCode = code; return res; }),
      json: vi.fn((data) => { res.data = data; return res; }),
      end: vi.fn(() => res),
    };
    return res;
  };

  it('handles OPTIONS request with status 200 for CORS preflight', async () => {
    const req = { method: 'OPTIONS' };
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*');
    expect(res.end).toHaveBeenCalled();
  });

  it('handles GET health check request with status 200', async () => {
    const req = { method: 'GET' };
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.json).toHaveBeenCalledWith({ status: 'ok' });
  });

  it('rejects unsupported HTTP methods (e.g., PUT) with 405 Method Not Allowed', async () => {
    const req = { method: 'PUT', body: {} };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: 'Method not allowed.',
    }));
  });

  it('validates required fields: returns 400 if name is missing', async () => {
    const req = {
      method: 'POST',
      body: { phone: '9899902568' },
    };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: 'Name and phone are required.',
    }));
  });

  it('validates required fields: returns 400 if phone is missing', async () => {
    const req = {
      method: 'POST',
      body: { name: 'John Doe' },
    };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: 'Name and phone are required.',
    }));
  });
});
