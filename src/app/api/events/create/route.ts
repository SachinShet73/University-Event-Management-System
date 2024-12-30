import { executeQuery } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        
        // Validate required fields
        if (!body.EventTitle || !body.EventDescription || !body.StartDate || 
            !body.EndDate || !body.VenueID || !body.EventCategoryID || 
            !body.EventBudget || !body.OrganizerID) {
            return NextResponse.json(
                { success: false, message: 'All fields are required' },
                { status: 400 }
            )
        }

        const query = `
            INSERT INTO Event (
                VenueID,
                EventCategoryID,
                OrganizerID,
                EventTitle,
                EventDescription,
                StartDate,
                EndDate,
                EventBudget
            ) VALUES (
                ${body.VenueID},
                ${body.EventCategoryID},
                ${body.OrganizerID},
                '${body.EventTitle}',
                '${body.EventDescription}',
                '${body.StartDate}',
                '${body.EndDate}',
                ${body.EventBudget}
            )
        `
        await executeQuery(query)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Create event error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create event' },
            { status: 500 }
        )
    }
}