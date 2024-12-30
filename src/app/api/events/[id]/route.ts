import { executeQuery } from '@/lib/db'
import { NextResponse } from 'next/server'

// Get single event
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const query = `
            SELECT 
                e.EventID,
                e.EventTitle,
                e.EventDescription,
                e.StartDate,
                e.EndDate,
                e.VenueID,
                e.EventCategoryID,
                e.EventBudget,
                e.OrganizerID,
                v.VenueName,
                v.VenueCapacity,
                ec.CategoryName
            FROM Event e
            JOIN Venue v ON e.VenueID = v.VenueID
            JOIN EventCategory ec ON e.EventCategoryID = ec.EventCategoryID
            WHERE e.EventID = ${params.id}
        `
        const result = await executeQuery(query)
        
        if (result.length === 0) {
            return NextResponse.json(
                { success: false, message: 'Event not found' },
                { status: 404 }
            )
        }

        // Format dates for the form
        const event = result[0]
        event.StartDate = new Date(event.StartDate).toISOString().split('T')[0]
        event.EndDate = new Date(event.EndDate).toISOString().split('T')[0]

        return NextResponse.json({ success: true, event: event })
    } catch (error) {
        console.error('Get event error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch event' },
            { status: 500 }
        )
    }
}

// Update event
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json()
        const query = `
            UPDATE Event
            SET 
                EventTitle = '${body.EventTitle}',
                EventDescription = '${body.EventDescription}',
                StartDate = '${body.StartDate}',
                EndDate = '${body.EndDate}',
                VenueID = ${body.VenueID},
                EventCategoryID = ${body.EventCategoryID},
                EventBudget = ${body.EventBudget}
            WHERE EventID = ${params.id}
        `
        await executeQuery(query)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Update event error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update event' },
            { status: 500 }
        )
    }
}

// Delete event
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const query = `
            DELETE FROM Event 
            WHERE EventID = ${params.id}
        `
        await executeQuery(query)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete event error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to delete event' },
            { status: 500 }
        )
    }
}