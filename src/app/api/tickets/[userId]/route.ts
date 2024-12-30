import { executeQuery } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: { userId: string } }
) {
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
            WHERE t.UserID = ${params.userId}
            ORDER BY t.TicketIssueDate DESC
        `
        const tickets = await executeQuery(query)
        return NextResponse.json({ success: true, tickets })
    } catch (error) {
        console.error('Tickets API error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch tickets' },
            { status: 500 }
        )
    }
}