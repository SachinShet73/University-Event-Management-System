import { executeQuery } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const query = `
            INSERT INTO Venue (
                VenueTypeID,
                VenueName,
                VenueCapacity,
                VenueLocation
            ) VALUES (
                ${body.VenueTypeID},
                '${body.VenueName}',
                ${body.VenueCapacity},
                '${body.VenueLocation}'
            )
        `
        await executeQuery(query)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Create venue error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create venue' },
            { status: 500 }
        )
    }
}