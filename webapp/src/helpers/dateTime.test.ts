import { formatDateTime } from './dateTime';

describe('formatDateTime function', () => {
  describe('Timezones', () => {
    it('should always be UTC', () => {
      expect(new Date().getTimezoneOffset()).toBe(0);
    });
  });

  it('should return a string containing journal entry date and time in en-CA format', () => {
    const result = formatDateTime('2021-11-04T10:00:00.000Z', 'en-CA');

    expect(result).toBe('November 4, 2021, 10:00 a.m.');
  });

  it('should return a string containing journal entry date and time in en-US format', () => {
    const result = formatDateTime('2021-11-04T10:00:00.000Z', 'en-US');

    expect(result).toBe('November 4, 2021, 10:00 AM');
  });

  it('should return a string containing journal entry date and time in fr-CA format', () => {
    const result = formatDateTime('2021-11-04T10:00:00.000Z', 'fr-CA');

    expect(result).toBe('4 novembre 2021, 10 h 00');
  });
});
