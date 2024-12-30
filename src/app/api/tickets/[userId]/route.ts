import { executeQuery } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    // Extract 'userId' from the URL using nextUrl
    const { pathname } = request.nextUrl
    const userId = pathname.split('/').pop() // Get the last segment of the URL

    if (!userId) {
        return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 })
    }

    try {
        const query = `
            SELECT 
                t.TicketID,
                e.EventTitle,
                t.TicketType,
                t.TicketPrice,
                t.TicketStatus,
                t.TicketIssueDate
            FROM Ticket t
            JOIN Event e ON t.EventID = e.EventID
            WHERE t.UserID = @userId
            ORDER BY t.TicketIssueDate DESC
        `

        // Execute the query with the userId as a parameter
        const tickets = await executeQuery(query, [userId])

        if (tickets.length === 0) {
            return NextResponse.json({ success: false, message: 'No tickets found for this user' }, { status: 404 })
        }

        return NextResponse.json({ success: true, tickets })
    } catch (error) {
        console.error('Tickets API error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch tickets' },
            { status: 500 }
        )
    }
}
