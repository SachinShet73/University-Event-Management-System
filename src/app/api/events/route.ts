import { executeQuery } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const query = `
            SELECT 
                e.EventID,
                e.EventTitle,
                e.EventDescription,
                e.StartDate,
                e.EndDate,
                v.VenueName,
                v.VenueCapacity,
                ec.CategoryName,
                (SELECT COUNT(*) FROM Registration r WHERE r.EventID = e.EventID) as registered
            FROM Event e
            JOIN Venue v ON e.VenueID = v.VenueID
            JOIN EventCategory ec ON e.EventCategoryID = ec.EventCategoryID
        `
        const events = await executeQuery(query)
        return NextResponse.json({ success: true, events })
    } catch (error) {
        console.error('Events API error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch events' },
            { status: 500 }
        )
    }
}