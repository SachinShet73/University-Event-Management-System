import { executeQuery } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const query = `
            SELECT 
                VenueTypeID,
                VenueTypeName
            FROM VenueType
            ORDER BY VenueTypeName
        `
        const venueTypes = await executeQuery(query)
        return NextResponse.json({ success: true, venueTypes })
    } catch (error) {
        console.error('Venue types API error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch venue types' },
            { status: 500 }
        )
    }
}