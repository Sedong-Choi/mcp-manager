import { NextResponse } from 'next/server';

export async function GET() {
  const modelServiceUrl = process.env.MODEL_SERVICE_URL || 'http://localhost:4001';
  
  try {
    const response = await fetch(`${modelServiceUrl}/models`);
    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status}`);
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 });
  }
}
