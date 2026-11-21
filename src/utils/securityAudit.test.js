import { describe, it, expect } from 'vitest';

describe('Security & Validation Audit Unit Tests', () => {
  // 1. Email format validation test (aligned with updated User model)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  it('validates standard and modern TLD email addresses', () => {
    expect(emailRegex.test('shivamthakur12012@gmail.com')).toBe(true);
    expect(emailRegex.test('admin@arthovista.com')).toBe(true);
    expect(emailRegex.test('founder@startup.online')).toBe(true);
    expect(emailRegex.test('advisory@consulting.finance')).toBe(true);
    expect(emailRegex.test('support@org.co.in')).toBe(true);
  });

  it('rejects invalid email formats', () => {
    expect(emailRegex.test('invalid-email')).toBe(false);
    expect(emailRegex.test('user@')).toBe(false);
    expect(emailRegex.test('@domain.com')).toBe(false);
    expect(emailRegex.test('user@domain')).toBe(false);
    expect(emailRegex.test('user@domain.c')).toBe(false);
  });

  // 2. Month format validator for attendance queries (prevents ReDoS)
  const monthRegex = /^\d{4}-\d{2}$/;

  it('validates YYYY-MM month parameter format', () => {
    expect(monthRegex.test('2026-11')).toBe(true);
    expect(monthRegex.test('2025-01')).toBe(true);
    expect(monthRegex.test('2026/11')).toBe(false);
    expect(monthRegex.test('^((a+)+)+$')).toBe(false);
    expect(monthRegex.test('2026-11-21')).toBe(false);
    expect(monthRegex.test('')).toBe(false);
  });

  // 3. Regex special character sanitizer for search queries
  const sanitizeRegex = (input) => String(input).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').trim();

  it('escapes regex meta-characters to prevent ReDoS attacks', () => {
    const maliciousInput = '.*+?^${}()|[]\\test';
    const sanitized = sanitizeRegex(maliciousInput);
    expect(sanitized).toBe('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\test');
    expect(() => new RegExp(sanitized, 'i')).not.toThrow();
  });

  // 4. Safe Reports fallback logic when an employee record is null
  const formatReportRow = (row) => [
    row.employee?.fullName || 'Former Employee',
    row.employee?.employeeId || 'N/A',
    row.employee?.email || 'N/A',
    row.employee?.department?.name || row.employee?.department || 'N/A',
    row.employee?.designation || 'N/A',
    row.punchInTime || 'Not Punched In',
    row.punchOutTime || 'Not Punched Out',
    row.totalWorkHours !== undefined ? row.totalWorkHours : 0,
    row.presentDays || 0,
    row.absentDays || 0,
    row.lateDays || 0,
    row.halfDays || 0,
    row.leaveDays || 0,
    `${row.attendancePercentage || 0}%`
  ];

  it('safely formats attendance report row without crashing on deleted/null employee', () => {
    const corruptRow = {
      employee: null,
      punchInTime: '10:00 AM',
      punchOutTime: '06:00 PM',
      totalWorkHours: 8,
      presentDays: 1,
      attendancePercentage: 100
    };

    expect(() => formatReportRow(corruptRow)).not.toThrow();
    const formatted = formatReportRow(corruptRow);
    expect(formatted[0]).toBe('Former Employee');
    expect(formatted[1]).toBe('N/A');
    expect(formatted[2]).toBe('N/A');
    expect(formatted[7]).toBe(8);
    expect(formatted[13]).toBe('100%');
  });
});
