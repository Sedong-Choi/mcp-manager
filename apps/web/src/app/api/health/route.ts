import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'MCP Manager Pro API Gateway is running' });
}
