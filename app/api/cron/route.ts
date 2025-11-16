import prisma from '@/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Verify the request is from Vercel Cron using a secret token
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const response = await prisma.constants.update({
      where: {
        constant_slug: "google_maps"
      },
      data: {
        constant_value: 0
      }
    });
    
    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Cron job failed:', error);
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}