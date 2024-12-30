import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

// GET handler
export async function GET(request: NextRequest) {
    // Extract the 'id' from the request URL
    const { pathname } = request.nextUrl;
    const segments = pathname.split('/');
    const id = segments[segments.length - 1]; // Assuming 'id' is the last segment

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
            WHERE e.EventID = @param0
        `;
        const result = await executeQuery(query, [id]);

        if (!result?.length) {
            return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
        }

        const event = result[0];
        event.StartDate = new Date(event.StartDate).toISOString().split('T')[0];
        event.EndDate = new Date(event.EndDate).toISOString().split('T')[0];

        return NextResponse.json({ success: true, event });
    } catch (error) {
        console.error('Get event error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch event' },
            { status: 500 }
        );
    }
}

// PUT handler
export async function PUT(request: NextRequest) {
    // Extract the 'id' from the request URL
    const { pathname } = request.nextUrl;
    const segments = pathname.split('/');
    const id = segments[segments.length - 1]; // Assuming 'id' is the last segment

    try {
        const body = await request.json();
        const query = `
            UPDATE Event
            SET 
                EventTitle = @param0,
                EventDescription = @param1,
                StartDate = @param2,
                EndDate = @param3,
                VenueID = @param4,
                EventCategoryID = @param5,
                EventBudget = @param6
            WHERE EventID = @param7
        `;
        await executeQuery(query, [
            body.EventTitle,
            body.EventDescription,
            body.StartDate,
            body.EndDate,
            body.VenueID,
            body.EventCategoryID,
            body.EventBudget,
            id
        ]);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Update event error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update event' },
            { status: 500 }
        );
    }
}

// DELETE handler
export async function DELETE(request: NextRequest) {
    // Extract the 'id' from the request URL
    const { pathname } = request.nextUrl;
    const segments = pathname.split('/');
    const id = segments[segments.length - 1]; // Assuming 'id' is the last segment

    try {
        const query = `DELETE FROM Event WHERE EventID = @param0`;
        await executeQuery(query, [id]);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete event error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete event' },
            { status: 500 }
        );
    }
}
