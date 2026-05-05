import OpenAI from 'openai';
import {
  ApiResponse,
  DocumentExtractResult,
  DocumentSummaryResult,
  ReviewAnalysisResult,
} from '@/types';
import { getDocumentExtractPrompt, getDocumentExtractSystemPrompt, getDocumentSummaryPrompt, getDocumentSummarySystemPrompt, getReviewAnalysisPrompt, getReviewAnalysisSystemPrompt } from '@/lib/prompts';
import { isMockAiEnabled } from '@/lib/env';
import { safeJsonParse } from '@/lib/utils';

function getClient(): OpenAI {
  const provider = (process.env.AI_PROVIDER || 'openai').toLowerCase();

  if (provider === 'deepseek') {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) throw new Error('缺少 DEEPSEEK_API_KEY 环境变量');
    return new OpenAI({ baseURL: 'https://api.deepseek.com/v1', apiKey });
  }

  // default: openai
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('缺少 OPENAI_API_KEY 环境变量');
  return new OpenAI({ apiKey });
}

function getModel(): string {
  const provider = (process.env.AI_PROVIDER || 'openai').toLowerCase();
  if (provider === 'deepseek') return process.env.DEEPSEEK_MODEL || 'deepseek-chat';
  return process.env.OPENAI_MODEL || 'gpt-4.1-mini';
}

async function askModel<T>(systemPrompt: string, userPrompt: string): Promise<T> {
  const client = getClient();
  const model = getModel();

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.1,
  });

  const text = response.choices[0]?.message?.content;
  if (!text) throw new Error('AI 返回为空，请稍后重试');

  const parsed = safeJsonParse<T>(text);
  if (!parsed) throw new Error('AI 返回格式异常，请稍后重试');
  return parsed;
}

export async function extractDocumentData(
  documentType: string,
  fields: string[],
  content: string,
): Promise<DocumentExtractResult> {
  if (isMockAiEnabled()) {
    return {
      documentType,
      fields: fields.map((name, i) => ({
        name,
        value: `示例结果 ${i + 1}`,
        note: 'Mock 演示结果，请接入真实模型后替换',
      })),
      rawTextPreview: content.slice(0, 240),
    };
  }

  const result = await askModel<{ fields: DocumentExtractResult['fields'] }>(
    getDocumentExtractSystemPrompt(),
    getDocumentExtractPrompt(documentType, fields, content),
  );

  return { documentType, fields: result.fields, rawTextPreview: content.slice(0, 240) };
}

export async function summarizeDocument(
  mode: Parameters<typeof getDocumentSummaryPrompt>[0],
  content: string,
): Promise<DocumentSummaryResult> {
  if (isMockAiEnabled()) {
    return {
      title: '示例文档主题',
      summary: '这是一个用于本地演示的摘要结果，说明系统已打通页面、接口和结果渲染流程。',
      keyPoints: ['文档核心目标已提炼', '重点信息已按条目整理', '适合快速转发给同事或客户'],
      actionItems: ['确认关键截止时间', '补充负责人和下一步动作'],
      risks: ['部分结论仍需人工复核'],
      shareableBrief: '这份文档的重点已经浓缩为可直接转发的简版结论。',
      outline: mode === 'briefing' ? ['背景说明', '当前进展', '风险与建议', '下一步安排'] : [],
    };
  }

  return askModel<DocumentSummaryResult>(
    getDocumentSummarySystemPrompt(),
    getDocumentSummaryPrompt(mode, content),
  );
}

export async function analyzeReviews(
  platform: string,
  productType: string,
  reviews: string,
): Promise<ReviewAnalysisResult> {
  if (isMockAiEnabled()) {
    return {
      positivePoints: ['上手简单', '外观好看', '性价比高'],
      negativeReasons: ['说明不够清晰', '包装一般'],
      buyingMotivations: ['日常使用', '送礼', '替换旧款'],
      painPoints: ['担心耐用性', '希望更快发货'],
      productSuggestions: ['补充使用说明', '优化包装体验'],
      marketingAngles: ['开箱即用', '适合送礼', '性价比友好'],
      contentIdeas: ['新手体验流程', '用户评价对比', '场景化展示'],
    };
  }

  return askModel<ReviewAnalysisResult>(
    getReviewAnalysisSystemPrompt(),
    getReviewAnalysisPrompt(platform, productType, reviews),
  );
}

export function ok<T>(data: T, usage?: Record<string, string | number | boolean | null>): ApiResponse<T> {
  return { success: true, data, usage };
}

export function fail(message: string): ApiResponse<never> {
  return { success: false, message };
}
