import logger from '@/lib/logging/server';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
  } catch (err) {
    logger.error(`Unexpected error: ${JSON.stringify(err)}`);

    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
  } catch (err) {
    logger.error(`Unexpected error: ${JSON.stringify(err)}`);

    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
