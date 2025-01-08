// app/api/tickets/[userId]/route.ts
import { executeQuery } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        // Extract userId from URL
        const { pathname } = request.nextUrl
        const userId = pathname.split('/').pop()

        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'User ID is required' }, 
                { status: 400 }
            )
        }

        // Updated query to include more event details and better formatting
        const query = `
            SELECT 
                t.TicketID,
                e.EventTitle,
                e.StartDate,
                e.EndDate,
                t.TicketType,
                t.TicketPrice,
                t.TicketStatus,
                t.TicketIssueDate,
                v.VenueName
            FROM Ticket t
            JOIN Event e ON t.EventID = e.EventID
            JOIN Venue v ON e.VenueID = v.VenueID
            WHERE t.UserID = @param0
            ORDER BY t.TicketIssueDate DESC
        `

        const result = await executeQuery(query, [userId])

        if (!result?.length) {
            return NextResponse.json(
                { 
                    success: true, 
                    tickets: [] 
                }
            )
        }

        return NextResponse.json({ 
            success: true, 
            tickets: result 
        })
    } catch (error) {
        console.error('Tickets API error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch tickets' },
            { status: 500 }
        )
    }
}