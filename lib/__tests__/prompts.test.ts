import { describe, expect, test } from 'vitest';
import {
  getDocumentExtractSystemPrompt,
  getDocumentSummarySystemPrompt,
  getReviewAnalysisSystemPrompt,
  getDocumentExtractPrompt,
  getDocumentSummaryPrompt,
  getReviewAnalysisPrompt,
} from '../prompts';

describe('getDocumentExtractSystemPrompt', () => {
  test('returns instruction with JSON requirement', () => {
    const prompt = getDocumentExtractSystemPrompt();
    expect(prompt).toContain('文档信息结构化助手');
    expect(prompt).toContain('JSON');
  });
});

describe('getDocumentSummarySystemPrompt', () => {
  test('returns instruction with JSON requirement', () => {
    const prompt = getDocumentSummarySystemPrompt();
    expect(prompt).toContain('办公文档摘要助手');
    expect(prompt).toContain('JSON');
  });
});

describe('getReviewAnalysisSystemPrompt', () => {
  test('returns instruction with JSON requirement', () => {
    const prompt = getReviewAnalysisSystemPrompt();
    expect(prompt).toContain('电商评论分析');
    expect(prompt).toContain('JSON');
  });
});

describe('getDocumentExtractPrompt', () => {
  test('includes document type, fields and content', () => {
    const prompt = getDocumentExtractPrompt('发票', ['号码', '金额'], 'content');
    expect(prompt).toContain('发票');
    expect(prompt).toContain('号码');
    expect(prompt).toContain('content');
    expect(prompt).toContain('JSON');
  });
});

describe('getDocumentSummaryPrompt', () => {
  test('includes mode label and content', () => {
    const prompt = getDocumentSummaryPrompt('meeting', 'notes');
    expect(prompt).toContain('会议纪要');
    expect(prompt).toContain('notes');
  });

  test('falls back to general', () => {
    expect(getDocumentSummaryPrompt('general', 'doc')).toContain('通用摘要');
  });
});

describe('getReviewAnalysisPrompt', () => {
  test('includes platform, product type and reviews', () => {
    const prompt = getReviewAnalysisPrompt('淘宝', '手机壳', '评论');
    expect(prompt).toContain('淘宝');
    expect(prompt).toContain('手机壳');
    expect(prompt).toContain('评论');
  });
});
