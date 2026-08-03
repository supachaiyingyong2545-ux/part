import { NextRequest, NextResponse } from 'next/server';
import { castVote } from '@/lib/store';

export async function POST(request: NextRequest) {
  try {
    const { voterId, trackId, candidateId } = await request.json();

    if (!voterId || !trackId || !candidateId) {
      return NextResponse.json({ success: false, message: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 });
    }

    const result = castVote(voterId, trackId, candidateId);
    return NextResponse.json(result, { status: result.success ? 200 : 409 });
  } catch {
    return NextResponse.json({ success: false, message: 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}
