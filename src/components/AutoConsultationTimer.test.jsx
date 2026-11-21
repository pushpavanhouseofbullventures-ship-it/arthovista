import { render, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AutoConsultationTimer from './AutoConsultationTimer';

const mockOpenConsultationModal = vi.fn();
let mockIsOpen = false;

vi.mock('../context/ConsultationContext', () => ({
  useConsultation: () => ({
    openConsultationModal: mockOpenConsultationModal,
    isOpen: mockIsOpen,
  }),
}));

describe('AutoConsultationTimer Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    sessionStorage.clear();
    mockIsOpen = false;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('automatically opens consultation modal after 12 seconds on first website visit', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AutoConsultationTimer />
      </MemoryRouter>
    );

    // After 5 seconds, should not have opened yet
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(mockOpenConsultationModal).not.toHaveBeenCalled();

    // After reaching 12 seconds (7000ms more)
    act(() => {
      vi.advanceTimersByTime(7000);
    });

    expect(mockOpenConsultationModal).toHaveBeenCalledTimes(1);
    expect(mockOpenConsultationModal).toHaveBeenCalledWith(
      expect.stringContaining('Welcome Visitor')
    );
    expect(sessionStorage.getItem('arthovista_auto_consult_shown')).toBe('true');
  });

  it('does NOT open consultation modal if client has already seen it in the session', () => {
    sessionStorage.setItem('arthovista_auto_consult_shown', 'true');

    render(
      <MemoryRouter initialEntries={['/services']}>
        <AutoConsultationTimer />
      </MemoryRouter>
    );

    act(() => {
      vi.advanceTimersByTime(15000);
    });

    expect(mockOpenConsultationModal).not.toHaveBeenCalled();
  });

  it('does NOT open consultation modal on attendance/admin portal routes', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AutoConsultationTimer />
      </MemoryRouter>
    );

    act(() => {
      vi.advanceTimersByTime(15000);
    });

    expect(mockOpenConsultationModal).not.toHaveBeenCalled();
    expect(sessionStorage.getItem('arthovista_auto_consult_shown')).toBeNull();
  });

  it('sets sessionStorage flag when modal is opened manually', () => {
    mockIsOpen = true;

    render(
      <MemoryRouter initialEntries={['/about']}>
        <AutoConsultationTimer />
      </MemoryRouter>
    );

    expect(sessionStorage.getItem('arthovista_auto_consult_shown')).toBe('true');
  });
});
