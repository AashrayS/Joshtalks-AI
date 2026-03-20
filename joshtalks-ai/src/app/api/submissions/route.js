import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state');
  const district = searchParams.get('district');
  const status = searchParams.get('status');
  const adminPassword = request.headers.get('x-admin-password');

  // Basic admin password protection
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let query = supabaseAdmin
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (state) query = query.eq('state', state);
    if (district) query = query.eq('district', district);
    if (status) query = query.eq('status', status);

    const { data, error } = await query;

    if (error) {
      console.error('Database Error:', error);
      return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
    }

    return NextResponse.json({ submissions: data });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
