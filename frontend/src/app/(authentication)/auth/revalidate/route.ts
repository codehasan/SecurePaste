import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  revalidatePath('/', 'layout');
  return NextResponse.redirect(new URL('/', request.url));
}
