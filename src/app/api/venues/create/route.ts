import { executeQuery } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        
        // Validate required fields
        if (!body.VenueName || !body.VenueTypeID || !body.VenueCapacity || !body.VenueLocation) {
            return NextResponse.json(
                { success: false, message: 'All fields are required' },
                { status: 400 }
            )
        }

        // Validate capacity
        const capacity = parseInt(body.VenueCapacity)
        if (isNaN(capacity) || capacity <= 0) {
            return NextResponse.json(
                { success: false, message: 'Venue capacity must be a positive number' },
                { status: 400 }
            )
        }

        const query = `
            INSERT INTO Venue (
                VenueTypeID,
                VenueName,
                VenueCapacity,
                VenueLocation
            ) VALUES (
                @param0,
                @param1,
                @param2,
                @param3
            )
        `
        await executeQuery(query, [
            Number(body.VenueTypeID),
            String(body.VenueName),
            capacity,
            String(body.VenueLocation)
        ])
        
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Create venue error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create venue' },
            { status: 500 }
        )
    }
}