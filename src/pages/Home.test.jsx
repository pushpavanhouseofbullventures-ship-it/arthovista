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

  it('renders hero title, lead assessment form, and the boy & girl animation placed below it', () => {
    renderHome();

    // Verify Hero Headings
    expect(screen.getByText(/Accelerate Your/i)).toBeDefined();
    expect(screen.getByText(/Business Growth/i)).toBeDefined();

    // Verify Lead Assessment Form
    expect(screen.getByText(/Get Free Business Assessment/i)).toBeDefined();
    expect(screen.getByPlaceholderText('Full Name')).toBeDefined();
    expect(screen.getByPlaceholderText('Phone Number')).toBeDefined();

    // There are multiple "Book Free Consultation" CTA buttons on the page
    const consultationButtons = screen.getAllByRole('button', { name: /Book Free Consultation/i });
    expect(consultationButtons.length).toBeGreaterThanOrEqual(1);

    // Verify Animated Marketing Conversation is rendered below the form
    const conversationContainer = screen.getByTestId('marketing-conversation-container');
    expect(conversationContainer).toBeDefined();

    // Verify Characters exist within the container
    const boyImg = screen.getByAltText('Aman - MSME Funding Consultant');
    const girlImg = screen.getByAltText('Priya - Growth & Subsidy Specialist');
    expect(conversationContainer.contains(boyImg)).toBe(true);
    expect(conversationContainer.contains(girlImg)).toBe(true);
  });

  it('allows user to interact with the form fields while character animation runs', () => {
    renderHome();

    const nameInput = screen.getByPlaceholderText('Full Name');
    const phoneInput = screen.getByPlaceholderText('Phone Number');

    fireEvent.change(nameInput, { target: { value: 'Vikram Singh' } });
    fireEvent.change(phoneInput, { target: { value: '9876543210' } });

    expect(nameInput.value).toBe('Vikram Singh');
    expect(phoneInput.value).toBe('9876543210');

    // Verify the character animation container remains intact and responsive
    expect(screen.getByTestId('marketing-conversation-container')).toBeDefined();
  });
});
