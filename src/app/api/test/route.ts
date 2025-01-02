import { executeQuery } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const result = await executeQuery('SELECT NOW()', []);
        return NextResponse.json({ success: true, time: result[0].now });
    } catch (error) {
        console.error('Test query error:', error);
        return NextResponse.json(
            { success: false, error: 'Database connection failed' },
            { status: 500 }
        );
    }
}