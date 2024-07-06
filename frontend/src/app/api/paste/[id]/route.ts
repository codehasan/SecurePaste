import { NextRequest, NextResponse } from 'next/server';

interface PasteParams {
  params: {
    id: string;
  };
}

export async function GET(
  { ...request }: NextRequest,
  { params }: PasteParams
) {}
