import { executeQuery } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const query = `
            SELECT 
                v.VenueID,
                v.VenueTypeID,
                v.VenueName,
                v.VenueCapacity,
                v.VenueLocation,
                vt.VenueTypeName
            FROM Venue v
            JOIN VenueType vt ON v.VenueTypeID = vt.VenueTypeID
            ORDER BY v.VenueName
        `
        const venues = await executeQuery(query)
        return NextResponse.json({ success: true, venues })
    } catch (error) {
        console.error('Venues API error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch venues' },
            { status: 500 }
        )
    }
}