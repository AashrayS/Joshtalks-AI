import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request) {
  const adminPassword = request.headers.get('x-admin-password');

  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Get total counts by status
    const { data: statusData, error: statusError } = await supabaseAdmin
      .from('submissions')
      .select('status');

    if (statusError) throw statusError;

    const stats = {
      total: statusData.length,
      pending: statusData.filter(s => s.status === 'pending').length,
      approved: statusData.filter(s => s.status === 'approved').length,
      rejected: statusData.filter(s => s.status === 'rejected').length,
    };

    // 2. Get regional breakdown (State/District counts)
    const { data: regionData, error: regionError } = await supabaseAdmin
      .from('submissions')
      .select('state, district, status');

    if (regionError) throw regionError;

    const coverage = {};
    regionData.forEach(item => {
      const key = `${item.district}, ${item.state}`;
      if (!coverage[key]) {
        coverage[key] = { district: item.district, state: item.state, count: 0, verified: 0 };
      }
      coverage[key].count += 1;
      if (item.status === 'approved') {
        coverage[key].verified += 1;
      }
    });

    // Convert to array and sort by count descending
    const coverageArray = Object.values(coverage).sort((a, b) => b.count - a.count);

    return NextResponse.json({ stats, coverage: coverageArray });
  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
