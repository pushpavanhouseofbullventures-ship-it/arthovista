import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import useDocumentMetadata from './useDocumentMetadata';

describe('useDocumentMetadata hook', () => {
  beforeEach(() => {
    document.title = '';
    const metas = document.head.querySelectorAll('meta, link[rel="canonical"]');
    metas.forEach(el => el.remove());
  });

  it('updates document.title and meta description', () => {
    renderHook(() => useDocumentMetadata('Test Page Title', 'Test page meta description'));

    expect(document.title).toBe('Test Page Title');

    const descMeta = document.head.querySelector('meta[name="description"]');
    expect(descMeta).not.toBeNull();
    expect(descMeta.getAttribute('content')).toBe('Test page meta description');
  });

  it('sets Open Graph and Twitter tags', () => {
    renderHook(() => useDocumentMetadata('OG Test Title', 'OG Test Description'));

    const ogTitle = document.head.querySelector('meta[property="og:title"]');
    const ogDesc = document.head.querySelector('meta[property="og:description"]');
    const ogSite = document.head.querySelector('meta[property="og:site_name"]');
    const twTitle = document.head.querySelector('meta[name="twitter:title"]');

    expect(ogTitle?.getAttribute('content')).toBe('OG Test Title');
    expect(ogDesc?.getAttribute('content')).toBe('OG Test Description');
    expect(ogSite?.getAttribute('content')).toBe('ArthoVista');
    expect(twTitle?.getAttribute('content')).toBe('OG Test Title');
  });

  it('sets canonical link tag with default domain', () => {
    renderHook(() => useDocumentMetadata('Canonical Test', 'Testing canonical'));

    const canonical = document.head.querySelector('link[rel="canonical"]');
    expect(canonical).not.toBeNull();
    expect(canonical.getAttribute('href')).toContain('https://www.arthovista.com');
  });
});
