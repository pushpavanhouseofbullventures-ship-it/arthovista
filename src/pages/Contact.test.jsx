import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Contact from './Contact';

describe('Contact Page Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.dataLayer = [];
  });

  it('renders contact channels, office info, and form fields', () => {
    render(<Contact />);

    // Check heading
    expect(screen.getByText("Let's")).toBeDefined();
    expect(screen.getByText("Talk Business")).toBeDefined();

    // Check channels
    expect(screen.getByText('Call Us Directly')).toBeDefined();
    expect(screen.getByText('WhatsApp Chat')).toBeDefined();
    expect(screen.getByText('Email Us')).toBeDefined();

    // Check inputs
    expect(screen.getByPlaceholderText('Ramesh Kumar')).toBeDefined();
    expect(screen.getByPlaceholderText('98999 02568')).toBeDefined();
    expect(screen.getByPlaceholderText('ramesh@example.com')).toBeDefined();
    expect(screen.getByRole('combobox')).toBeDefined();
    expect(screen.getByPlaceholderText(/Tell us what you need help with/i)).toBeDefined();

    // Submit button
    expect(screen.getByRole('button', { name: /Send Message/i })).toBeDefined();
  });

  it('updates input values when the user types', () => {
    render(<Contact />);

    const nameInput = screen.getByPlaceholderText('Ramesh Kumar');
    const phoneInput = screen.getByPlaceholderText('98999 02568');
    const emailInput = screen.getByPlaceholderText('ramesh@example.com');
    const select = screen.getByRole('combobox');
    const messageInput = screen.getByPlaceholderText(/Tell us what you need help with/i);

    fireEvent.change(nameInput, { target: { value: 'Aditya Sharma' } });
    fireEvent.change(phoneInput, { target: { value: '9876543210' } });
    fireEvent.change(emailInput, { target: { value: 'aditya@example.com' } });
    fireEvent.change(select, { target: { value: 'Business Registration' } });
    fireEvent.change(messageInput, { target: { value: 'Need help with Pvt Ltd registration' } });

    expect(nameInput.value).toBe('Aditya Sharma');
    expect(phoneInput.value).toBe('9876543210');
    expect(emailInput.value).toBe('aditya@example.com');
    expect(select.value).toBe('Business Registration');
    expect(messageInput.value).toBe('Need help with Pvt Ltd registration');
  });

  it('submits form successfully, calls /api/contact, and pushes GTM event', async () => {
    const mockResponse = { success: true, message: 'Thank you! Our expert will call you within 24 hours.' };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    render(<Contact />);

    fireEvent.change(screen.getByPlaceholderText('Ramesh Kumar'), { target: { value: 'Rohit Verma' } });
    fireEvent.change(screen.getByPlaceholderText('98999 02568'), { target: { value: '9988776655' } });
    fireEvent.change(screen.getByPlaceholderText('ramesh@example.com'), { target: { value: 'rohit@example.com' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Government Schemes' } });
    fireEvent.change(screen.getByPlaceholderText(/Tell us what you need help with/i), { target: { value: 'Interested in PMEGP' } });

    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Rohit Verma',
        phone: '9988776655',
        email: 'rohit@example.com',
        service: 'Government Schemes',
        message: 'Interested in PMEGP',
      }),
    });

    // Check GTM push
    expect(window.dataLayer).toContainEqual({
      event: 'lead_form_success',
      form_name: 'contact_page_form',
      service_name: 'Government Schemes',
    });

    // Check UI success message
    await waitFor(() => {
      expect(screen.getByText('Message Sent!')).toBeDefined();
      expect(screen.getByText('Our expert will call you within 24 hours.')).toBeDefined();
    });
  });

  it('falls back to "General Consultation" in GTM event if no service selected', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<Contact />);

    fireEvent.change(screen.getByPlaceholderText('Ramesh Kumar'), { target: { value: 'Anita Roy' } });
    fireEvent.change(screen.getByPlaceholderText('98999 02568'), { target: { value: '9123456780' } });

    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    expect(window.dataLayer).toContainEqual({
      event: 'lead_form_success',
      form_name: 'contact_page_form',
      service_name: 'General Consultation',
    });
  });

  it('displays error message when API responds with an error', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ success: false, message: 'Invalid phone number provided.' }),
    });

    render(<Contact />);

    fireEvent.change(screen.getByPlaceholderText('Ramesh Kumar'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('98999 02568'), { target: { value: '123' } });

    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid phone number provided.')).toBeDefined();
    });
  });

  it('displays fallback error message when network request fails', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network connection failed'));

    render(<Contact />);

    fireEvent.change(screen.getByPlaceholderText('Ramesh Kumar'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('98999 02568'), { target: { value: '9899902568' } });

    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));

    await waitFor(() => {
      expect(screen.getByText('Network connection failed')).toBeDefined();
    });
  });
});
