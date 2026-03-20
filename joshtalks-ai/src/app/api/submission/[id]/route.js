import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request, { params }) {
  const { id } = await params;
  const adminPassword = request.headers.get('x-admin-password');

  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('submissions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Database Error:', error);
      return NextResponse.json({ error: 'Failed to fetch submission' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    return NextResponse.json({ submission: data });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
