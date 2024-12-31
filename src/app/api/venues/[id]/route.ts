import { executeQuery } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// GET single venue
export async function GET(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const id = pathname.split('/').pop() || '';

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
            WHERE v.VenueID = @param0
        `
        const result = await executeQuery(query, [Number(id)])
        
        if (!result?.length) {
            return NextResponse.json(
                { success: false, message: 'Venue not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true, venue: result[0] })
    } catch (error) {
        console.error('Get venue error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch venue' },
            { status: 500 }
        )
    }
}

// UPDATE venue
export async function PUT(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const id = pathname.split('/').pop() || '';

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
            UPDATE Venue
            SET 
                VenueTypeID = @param0,
                VenueName = @param1,
                VenueCapacity = @param2,
                VenueLocation = @param3
            WHERE VenueID = @param4
        `
        
        await executeQuery(query, [
            Number(body.VenueTypeID),
            String(body.VenueName),
            capacity,
            String(body.VenueLocation),
            Number(id)
        ])

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Update venue error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update venue' },
            { status: 500 }
        )
    }
}

// DELETE venue
export async function DELETE(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const id = pathname.split('/').pop() || '';

    try {
        // First check if the venue is being used in any events
        const checkQuery = `
            SELECT COUNT(*) as eventCount 
            FROM Event 
            WHERE VenueID = @param0
        `
        const checkResult = await executeQuery(checkQuery, [Number(id)])
        
        if (checkResult[0].eventCount > 0) {
            return NextResponse.json(
                { 
                    success: false, 
                    message: 'Cannot delete venue as it is being used in events' 
                },
                { status: 400 }
            )
        }

        const query = `DELETE FROM Venue WHERE VenueID = @param0`
        await executeQuery(query, [Number(id)])
        
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete venue error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to delete venue' },
            { status: 500 }
        )
    }
}