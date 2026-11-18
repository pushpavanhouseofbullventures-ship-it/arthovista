import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';
import { ConsultationProvider } from '../context/ConsultationContext';

const renderHome = () => {
  return render(
    <ConsultationProvider>
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    </ConsultationProvider>
  );
};

describe('Homepage Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders hero title, consultation buttons, and the boy & girl animation in hero', () => {
    renderHome();

    // Verify Hero Headings
    expect(screen.getByText(/Accelerate Your/i)).toBeDefined();
    expect(screen.getByText(/Business Growth/i)).toBeDefined();

    // Verify Free Consultation Buttons
    const consultationButtons = screen.getAllByRole('button', { name: /Free Consultation/i });
    expect(consultationButtons.length).toBeGreaterThanOrEqual(1);

    // Verify Animated Marketing Conversation is rendered in Hero
    const conversationContainer = screen.getByTestId('marketing-conversation-container');
    expect(conversationContainer).toBeDefined();

    // Verify Characters exist within the container
    const boyImg = screen.getByAltText('Aman - MSME Funding Consultant');
    const girlImg = screen.getByAltText('Priya - Growth & Subsidy Specialist');
    expect(conversationContainer.contains(boyImg)).toBe(true);
    expect(conversationContainer.contains(girlImg)).toBe(true);
  });

  it('allows user to interact with the consultation CTAs while character animation runs', () => {
    renderHome();

    // Verify the character animation container remains intact and responsive
    expect(screen.getByTestId('marketing-conversation-container')).toBeDefined();

    // Verify CTA button triggers
    const freeConsultBtn = screen.getAllByRole('button', { name: /Free Consultation/i })[0];
    expect(freeConsultBtn).toBeDefined();
    fireEvent.click(freeConsultBtn);
  });
});
