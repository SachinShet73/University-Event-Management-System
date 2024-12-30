import { executeQuery } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const query = `
            SELECT 
                EventCategoryID,
                CategoryName,
                CategoryDescription
            FROM EventCategory
            ORDER BY CategoryName
        `
        const categories = await executeQuery(query)
        return NextResponse.json({ success: true, categories })
    } catch (error) {
        console.error('Categories API error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch categories' },
            { status: 500 }
        )
    }
}