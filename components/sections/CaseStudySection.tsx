'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { caseStudies } from '@/lib/site';

const caseImages: Record<string, string> = {
  invoice: '/cases/case1.png',
  summary: '/cases/case2.png',
  review: '/cases/case3.png',
};

export function CaseStudySection() {
  const [activeId, setActiveId] = useState(caseStudies[0].id);
  const active = caseStudies.find((c) => c.id === activeId) || caseStudies[0];

  return (
    <section className="section-shell">
      <div className="container-shell">
        <div className="max-w-3xl">
          <p className="badge">示例案例</p>
          <h2 className="section-title mt-4">以下为示例案例，展示 AI 自动化如何将重复工作流程化。如果你的场景类似，可以定制成你的内部工具。</h2>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Left sidebar nav */}
          <nav className="space-y-2">
            {caseStudies.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveId(item.id)}
                className={`w-full rounded-2xl px-5 py-4 text-left text-sm transition ${
                  activeId === item.id
                    ? 'bg-accent/10 border border-accent/30 text-ink font-semibold'
                    : 'border border-transparent bg-white/60 text-slate-600 hover:bg-white hover:text-ink'
                }`}
              >
                <span className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">{item.industry}</span>
                <p className="mt-1.5 leading-6">{item.title}</p>
              </button>
            ))}
          </nav>

          {/* Right detail panel */}
          <article className="panel space-y-8 p-6 sm:p-8">
            {/* Image / visual area */}
            <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100">
              <Image
                src={caseImages[active.id]}
                alt={active.title}
                width={1200}
                height={800}
                className="w-full h-auto"
                priority
              />
            </div>

            {/* Case detail sections */}
            <div className="grid gap-6 lg:grid-cols-2">
              <DetailBlock title="原始痛点" tone="before">
                {active.pain}
              </DetailBlock>
              <DetailBlock title="自动化流程" tone="process">
                {active.process}
              </DetailBlock>
              <DetailBlock title="自动化后效果" tone="after">
                {active.outcome}
              </DetailBlock>
              <DetailBlock title="节省时间" tone="time" highlight>
                {active.timeSaved}
              </DetailBlock>
            </div>

            {/* Customizable points */}
            <div>
              <p className="text-sm font-semibold text-ink">可定制方向</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {active.customPoints.map((tag) => (
                  <span key={tag} className="rounded-full bg-accent/8 border border-accent/15 px-4 py-1.5 text-sm font-medium text-accentDeep">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-6 py-5">
              <p className="text-sm text-slate-600">有类似的业务流程需要自动化？</p>
              <a
                href="/custom"
                className="inline-flex items-center gap-2 text-sm font-semibold text-accentDeep hover:underline"
              >
                沟通定制方案
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function DetailBlock({
  title,
  children,
  tone = 'before',
  highlight = false,
}: {
  title: string;
  children: string;
  tone?: 'before' | 'process' | 'after' | 'time';
  highlight?: boolean;
}) {
  const borderColor =
    tone === 'before'
      ? 'border-rose-200 bg-rose-50/50'
      : tone === 'process'
        ? 'border-blue-200 bg-blue-50/50'
        : tone === 'after'
          ? 'border-emerald-200 bg-emerald-50/50'
          : 'border-amber-200 bg-amber-50/50';

  return (
    <div className={`rounded-2xl border p-5 ${highlight ? 'border-amber-300 bg-amber-50/70' : borderColor}`}>
      <p className="text-sm font-semibold text-ink">{title}</p>
      <p className="mt-2 text-sm leading-7 text-slate-600">{children}</p>
    </div>
  );
}
