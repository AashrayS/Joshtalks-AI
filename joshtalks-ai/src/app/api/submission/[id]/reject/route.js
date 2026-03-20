import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request, { params }) {
  const { id } = await params;
  const { reason } = await request.json();
  const adminPassword = request.headers.get('x-admin-password');

  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!reason) {
    return NextResponse.json({ error: 'Rejection reason is required' }, { status: 400 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('submissions')
      .update({ 
        status: 'rejected',
        rejection_reason: reason
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Database Error:', error);
      return NextResponse.json({ error: 'Failed to reject submission' }, { status: 500 });
    }

    return NextResponse.json({ success: true, submission: data[0] });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
