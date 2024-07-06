import { Paste } from '@/lib/schema/ZodSchema';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body: Paste = await request.json();
}
