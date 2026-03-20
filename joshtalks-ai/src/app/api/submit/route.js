import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image');
    const description = formData.get('description');
    const state = formData.get('state');
    const district = formData.get('district');
    const gps_lat = formData.get('gps_lat');
    const gps_lng = formData.get('gps_lng');

    if (!image || !description || !state || !district) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Upload image to Supabase Storage
    const fileExt = image.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `submissions/${fileName}`;

    const { data: storageData, error: storageError } = await supabaseAdmin.storage
      .from('submission-images')
      .upload(filePath, image);

    if (storageError) {
      console.error('Storage Error:', storageError);
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }

    // 2. Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('submission-images')
      .getPublicUrl(filePath);

    // 3. Insert into database
    const { data: dbData, error: dbError } = await supabaseAdmin
      .from('submissions')
      .insert([
        {
          image_url: publicUrl,
          description,
          state,
          district,
          gps_lat: gps_lat ? parseFloat(gps_lat) : null,
          gps_lng: gps_lng ? parseFloat(gps_lng) : null,
          status: 'pending'
        }
      ])
      .select();

    if (dbError) {
      console.error('Database Error:', dbError);
      return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 });
    }

    return NextResponse.json({ success: true, submission: dbData[0] });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
