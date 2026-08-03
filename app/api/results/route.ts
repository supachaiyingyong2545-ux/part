import { NextResponse } from 'next/server';
import { getVotes } from '@/lib/store';

export async function GET() {
  return NextResponse.json(getVotes());
}
