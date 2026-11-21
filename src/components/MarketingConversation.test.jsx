import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import MarketingConversation from './MarketingConversation';
import { ConsultationProvider } from '../context/ConsultationContext';

const mockOpenModal = vi.fn();

vi.mock('../context/ConsultationContext', async () => {
  const actual = await vi.importActual('../context/ConsultationContext');
  return {
    ...actual,
    useConsultation: () => ({
      openConsultationModal: mockOpenModal,
      isModalOpen: false,
      closeConsultationModal: vi.fn(),
      defaultService: 'General',
    }),
  };
});

describe('MarketingConversation Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders both 3D character avatars with correct sources and alt attributes', () => {
    render(
      <ConsultationProvider>
        <MarketingConversation />
      </ConsultationProvider>
    );

    const boyImg = screen.getByAltText('Aman - MSME Funding Consultant');
    const girlImg = screen.getByAltText('Priya - Growth & Subsidy Specialist');

    expect(boyImg).toBeDefined();
    expect(girlImg).toBeDefined();
    expect(boyImg.getAttribute('src')).toBe('/marketing-boy.png');
    expect(girlImg.getAttribute('src')).toBe('/marketing-girl.png');
  });

  it('generates text incrementally via typewriter animation and triggers girl answer on answer time', () => {
    render(
      <ConsultationProvider>
        <MarketingConversation />
      </ConsultationProvider>
    );

    expect(screen.getByText(/Aman/i)).toBeDefined();

    // Step through Boy's typewriter animation tick-by-tick
    for (let i = 0; i < 35; i++) {
      act(() => {
        vi.advanceTimersByTime(40);
      });
    }

    // Boy's question should be fully written
    expect(screen.getByText(/Looking for Business Funding\?/i)).toBeDefined();

    // Advance through the pause between boy and girl
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Step through Girl's typewriter response generation
    for (let i = 0; i < 55; i++) {
      act(() => {
        vi.advanceTimersByTime(35);
      });
    }

    expect(screen.getByText(/Priya/i)).toBeDefined();
    expect(screen.getByText(/Let's help grow your business/i)).toBeDefined();
  });

  it('triggers consultation modal when clicking the action CTA button', () => {
    render(
      <ConsultationProvider>
        <MarketingConversation />
      </ConsultationProvider>
    );

    // Fast-forward through boy typing, pause, and girl typing to the HOLD phase
    for (let i = 0; i < 100; i++) {
      act(() => {
        vi.advanceTimersByTime(50);
      });
    }

    const ctaBtn = screen.getByRole('button', { name: /Check Eligibility/i });
    expect(ctaBtn).toBeDefined();

    fireEvent.click(ctaBtn);
    expect(mockOpenModal).toHaveBeenCalledTimes(1);
    expect(mockOpenModal).toHaveBeenCalledWith(
      expect.stringContaining('Hero Advisor Lead')
    );
  });

  it('respects prefers-reduced-motion by displaying complete text without animation delay', () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(
      <ConsultationProvider>
        <MarketingConversation />
      </ConsultationProvider>
    );

    expect(screen.getByText(/Looking for Business Funding\?/i)).toBeDefined();
    expect(screen.getByText(/Let's help grow your business/i)).toBeDefined();
  });
});
