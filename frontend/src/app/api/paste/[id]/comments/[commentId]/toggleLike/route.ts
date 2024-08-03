import logger from '@/lib/logging/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
  } catch (err) {
    logger.error(`Unexpected error: ${JSON.stringify(err)}`);

    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
