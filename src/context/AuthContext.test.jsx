import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth, api } from './AuthContext';

describe('AuthContext login unit tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

  // Helper to generate a valid base64url JWT with a future expiration
  const createValidMockToken = () => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      id: 'u1',
      exp: Math.floor(Date.now() / 1000) + 86400 // 1 day in future
    }));
    const sig = 'mockSignature';
    return `${header}.${payload}.${sig}`;
  };

  it('returns success and sets user & token on valid credentials', async () => {
    const mockUser = { id: 'u1', fullName: 'Shivam Kumar', role: 'Admin' };
    const mockToken = createValidMockToken();

    vi.spyOn(api, 'post').mockResolvedValueOnce({
      data: {
        success: true,
        accessToken: mockToken,
        user: mockUser
      }
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    let response;
    await act(async () => {
      response = await result.current.login('shivamthakur12012@gmail.com', 'Shivam@123321');
    });

    expect(response).toBeDefined();
    expect(response.success).toBe(true);
    expect(response.user).toEqual(mockUser);
    expect(result.current.user).toEqual(mockUser);
    expect(localStorage.getItem('accessToken')).toBe(mockToken);
  });

  it('returns error object when server returns HTML or non-success data instead of crashing with undefined', async () => {
    // Simulating when production server returns index.html (200 OK string)
    vi.spyOn(api, 'post').mockResolvedValueOnce({
      data: '<!DOCTYPE html><html><body>Static Page</body></html>'
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    let response;
    await act(async () => {
      response = await result.current.login('shivamthakur12012@gmail.com', 'wrongpass');
    });

    expect(response).toBeDefined();
    expect(response.success).toBe(false);
    expect(response.message).toContain('Backend authentication server unavailable');
  });

  it('handles 401 invalid credentials error from backend gracefully', async () => {
    const errorResponse = {
      response: {
        status: 401,
        data: {
          success: false,
          message: 'Invalid credentials'
        }
      }
    };
    vi.spyOn(api, 'post').mockRejectedValueOnce(errorResponse);

    const { result } = renderHook(() => useAuth(), { wrapper });

    let response;
    await act(async () => {
      response = await result.current.login('test@example.com', 'wrongpass');
    });

    expect(response).toBeDefined();
    expect(response.success).toBe(false);
    expect(response.message).toBe('Invalid credentials');
  });

  it('handles network failure or 500 error gracefully', async () => {
    const networkError = {
      code: 'ERR_NETWORK',
      message: 'Network Error'
    };
    vi.spyOn(api, 'post').mockRejectedValueOnce(networkError);

    const { result } = renderHook(() => useAuth(), { wrapper });

    let response;
    await act(async () => {
      response = await result.current.login('test@example.com', 'pass');
    });

    expect(response).toBeDefined();
    expect(response.success).toBe(false);
    expect(response.message).toContain('Unable to connect to backend server');
  });
});
