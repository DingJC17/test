import { describe, expect, test } from 'vitest';
import {
  assertFileSize,
  assertDocumentExtractFileType,
  assertSummaryFileType,
  assertTextLimit,
  assertReviewInput,
  assertSummaryMode,
  parseFieldLines,
} from '../validators';

describe('assertFileSize', () => {
  test('passes for files under 5MB', () => {
    expect(() => assertFileSize(1024)).not.toThrow();
  });

  test('throws for files over 5MB', () => {
    const over = 5 * 1024 * 1024 + 1;
    expect(() => assertFileSize(over)).toThrow('文件过大');
  });
});

describe('assertDocumentExtractFileType', () => {
  test.each(['application/pdf', 'image/png', 'image/jpeg'])('accepts %s', (type) => {
    expect(() => assertDocumentExtractFileType(type)).not.toThrow();
  });

  test('rejects invalid types', () => {
    expect(() => assertDocumentExtractFileType('video/mp4')).toThrow('仅支持 PDF、PNG、JPG、JPEG');
  });
});

describe('assertSummaryFileType', () => {
  test.each(['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'text/plain'])('accepts %s', (type) => {
    expect(() => assertSummaryFileType(type)).not.toThrow();
  });

  test('rejects invalid types', () => {
    expect(() => assertSummaryFileType('image/png')).toThrow('仅支持 PDF、DOCX、PPTX');
  });
});

describe('assertTextLimit', () => {
  test('throws for empty input', () => {
    expect(() => assertTextLimit('  ')).toThrow('请输入内容后再试');
  });

  test('throws for over-limit text', () => {
    expect(() => assertTextLimit('a'.repeat(12001))).toThrow('请控制在');
  });

  test('passes for valid input', () => {
    expect(() => assertTextLimit('hello')).not.toThrow();
  });
});

describe('assertReviewInput', () => {
  test('throws for over 20 lines', () => {
    const lines = Array.from({ length: 21 }, (_, i) => `line ${i}`).join('\n');
    expect(() => assertReviewInput(lines)).toThrow('最多提交 20 条评论');
  });

  test('throws for over 5000 chars', () => {
    expect(() => assertReviewInput('a'.repeat(5001))).toThrow('请控制在');
  });

  test('passes for valid input', () => {
    expect(() => assertReviewInput('line1\nline2')).not.toThrow();
  });
});

describe('assertSummaryMode', () => {
  test('returns valid mode unchanged', () => {
    expect(assertSummaryMode('meeting')).toBe('meeting');
  });

  test('falls back to general for unknown', () => {
    expect(assertSummaryMode('invalid')).toBe('general');
  });
});

describe('parseFieldLines', () => {
  test('caps at 8 fields', () => {
    const input = 'a\nb\nc\nd\ne\nf\ng\nh\ni\nj';
    expect(parseFieldLines(input)).toHaveLength(8);
  });

  test('trims whitespace', () => {
    expect(parseFieldLines('  f1  \n  f2  ')).toEqual(['f1', 'f2']);
  });
});
