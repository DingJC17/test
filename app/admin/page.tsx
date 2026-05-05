'use client';

import { useState } from 'react';
import { FileText, MessageSquare, Users } from 'lucide-react';
import type { LeadRecord } from '@/types';

interface Stats {
  totalLeads: number;
  totalTrials: number;
  totalClicks: number;
  recentLeads: (LeadRecord & { created_at: string })[];
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/stats', {
      headers: { 'x-admin-password': password },
    });
    const data = await res.json();
    setLoading(false);

    if (!data.success) {
      setError(data.message);
      return;
    }
    setAuthed(true);
    setStats(data.data);
  }

  if (!authed) {
    return (
      <main className="section-shell">
        <div className="container-shell max-w-sm">
          <form onSubmit={handleLogin} className="panel space-y-5 p-6 sm:p-8">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">管理后台</h1>
            <p className="text-sm text-slate-500">请输入管理密码查看数据。</p>
            <input
              type="password"
              className="input-base"
              placeholder="管理密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-70">
              {loading ? '验证中...' : '进入后台'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="section-shell">
      <div className="container-shell max-w-5xl space-y-8">
        <div>
          <p className="badge">管理后台</p>
          <h1 className="section-title mt-4">数据概览</h1>
        </div>

        {stats ? (
          <>
            <div className="grid gap-5 sm:grid-cols-3">
              <StatCard icon={Users} label="定制线索" value={stats.totalLeads} />
              <StatCard icon={FileText} label="工具试用" value={stats.totalTrials} />
              <StatCard icon={MessageSquare} label="行为点击" value={stats.totalClicks} />
            </div>

            <section className="panel p-6 sm:p-8">
              <h2 className="font-display text-xl font-semibold tracking-tight text-ink">最近线索</h2>
              {stats.recentLeads.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">暂无线索数据。</p>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="border-b border-slate-200 text-slate-500">
                      <tr>
                        <th className="pb-3 pr-4 font-medium">姓名</th>
                        <th className="pb-3 pr-4 font-medium">行业</th>
                        <th className="pb-3 pr-4 font-medium">需求</th>
                        <th className="pb-3 pr-4 font-medium">时间</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {stats.recentLeads.map((lead) => (
                        <tr key={lead.created_at} className="text-slate-700">
                          <td className="py-3 pr-4 font-medium">{lead.name}</td>
                          <td className="py-3 pr-4">{lead.industry}</td>
                          <td className="py-3 pr-4 max-w-xs truncate">{lead.problem}</td>
                          <td className="py-3 pr-4 text-slate-500">{new Date(lead.created_at).toLocaleDateString('zh-CN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number }) {
  return (
    <div className="panel p-6">
      <Icon className="h-6 w-6 text-accent" />
      <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
}
