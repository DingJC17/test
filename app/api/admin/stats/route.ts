import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  const password = request.headers.get('x-admin-password') || '';
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected || password !== expected) {
    return NextResponse.json({ success: false, message: '密码错误或未配置' }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();

    const [leadsRes, trialsRes, clicksRes] = await Promise.all([
      supabase.from('leads').select('*', { count: 'exact', head: true }),
      supabase.from('tool_usages').select('*', { count: 'exact', head: true }),
      supabase.from('contact_clicks').select('*', { count: 'exact', head: true }),
    ]);

    const { data: recentLeads } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    return NextResponse.json({
      success: true,
      data: {
        totalLeads: leadsRes.count || 0,
        totalTrials: trialsRes.count || 0,
        totalClicks: clicksRes.count || 0,
        recentLeads: recentLeads || [],
      },
    });
  } catch {
    return NextResponse.json({ success: false, message: '查询失败，请检查数据库配置' }, { status: 500 });
  }
}
