import { Github, ExternalLink } from 'lucide-react';
import { siteConfig } from '@/lib/site';

const projects = [
  {
    title: 'AI 文档转表格',
    repo: 'ai-document-to-table-lite',
    description: '上传 PDF、图片，AI 自动提取字段并整理为结构化表格。支持发票、合同、表单等文档类型。',
    tech: ['Next.js', 'TypeScript', 'OpenAI API'],
  },
  {
    title: 'AI Office 文档摘要提取',
    repo: 'ai-document-summary',
    description: '上传 PDF、Word、PPT 或粘贴文本，自动提取摘要、关键要点、待办事项和简版结论。',
    tech: ['Next.js', 'TypeScript', 'OpenAI API'],
  },
  {
    title: 'AI 商品评论分析',
    repo: 'ai-review-analyzer',
    description: '粘贴商品评论，自动分析好评点、差评原因、购买动机、产品优化建议和营销内容角度。',
    tech: ['Next.js', 'TypeScript', 'OpenAI API'],
  },
  {
    title: 'AI 自动化工具箱网站',
    repo: 'ai-automation-tools-website',
    description: '本网站源码。Next.js 全栈，免费试用工具 + 定制服务承接 + 案例展示。',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
  },
];

export default function GithubPage() {
  return (
    <main className="section-shell">
      <div className="container-shell max-w-4xl">
        <div className="text-center">
          <p className="badge">开源项目</p>
          <h1 className="section-title mt-4">部分基础工具已开源，可自行部署或二次开发。</h1>
          <p className="mt-4 body-muted">
            需要定制版本、私有化部署或企业功能，欢迎添加微信沟通。源码仅供参考基础能力，商用定制版包含完整业务逻辑和运维支持。
          </p>
        </div>

        <div className="mt-10 grid gap-6">
          {projects.map((project) => (
            <article key={project.repo} className="panel p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Github className="h-6 w-6 text-ink" />
                  <h2 className="font-display text-xl font-semibold tracking-tight text-ink">{project.title}</h2>
                </div>
                <a
                  href={`${siteConfig.githubUrl}/${project.repo}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-accentDeep hover:underline"
                >
                  查看仓库
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">{project.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span key={t} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-slate-500">
            更多项目请访问{' '}
            <a href={siteConfig.githubUrl} target="_blank" rel="noreferrer" className="text-accentDeep hover:underline">
              {siteConfig.githubUrl}
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
