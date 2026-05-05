import { describe, expect, test } from 'vitest';
import { cn, safeJsonParse, trimLines } from '../utils';

describe('safeJsonParse', () => {
  test('parses valid JSON directly', () => {
    const result = safeJsonParse<{ name: string }>('{"name":"test"}');
    expect(result).toEqual({ name: 'test' });
  });

  test('returns null for malformed input', () => {
    const result = safeJsonParse('not json at all');
    expect(result).toBeNull();
  });

  test('extracts JSON from markdown code block', () => {
    const result = safeJsonParse<{ value: number }>('```json\n{"value":42}\n```');
    expect(result).toEqual({ value: 42 });
  });

  test('extracts JSON from code block without language', () => {
    const result = safeJsonParse<{ ok: boolean }>('```\n{"ok":true}\n```');
    expect(result).toEqual({ ok: true });
  });

  test('finds JSON starting from first brace', () => {
    const result = safeJsonParse<{ x: string }>('Some text\n{"x":"y"}\nMore text');
    expect(result).toEqual({ x: 'y' });
  });

  test('finds JSON array from first bracket', () => {
    const result = safeJsonParse<string[]>('output: [1, 2, 3]');
    expect(result).toEqual([1, 2, 3]);
  });

  test('handles empty string', () => {
    expect(safeJsonParse('')).toBeNull();
  });
});

describe('trimLines', () => {
  test('splits and trims lines, removing empty ones', () => {
    expect(trimLines('  hello  \n\n  world  ')).toEqual(['hello', 'world']);
  });

  test('handles Windows line endings', () => {
    expect(trimLines('line1\r\n  line2  \r\n')).toEqual(['line1', 'line2']);
  });

  test('returns empty array for blank input', () => {
    expect(trimLines('')).toEqual([]);
    expect(trimLines('  \n  \n  ')).toEqual([]);
  });
});

describe('cn', () => {
  test('joins class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  test('filters falsy values', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b');
  });

  test('returns empty string for no args', () => {
    expect(cn()).toBe('');
  });
});
