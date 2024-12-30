import { executeQuery } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { eventId, userId } = await request.json()
        
        // First check if user is already registered
        const checkQuery = `
            SELECT RegistrationID 
            FROM Registration 
            WHERE EventID = ${eventId} AND UserID = ${userId}
        `
        const existingRegistration = await executeQuery(checkQuery)
        
        if (existingRegistration.length > 0) {
            return NextResponse.json(
                { success: false, message: 'You are already registered for this event' },
                { status: 400 }
            )
        }

        // Add new registration
        const insertQuery = `
            INSERT INTO Registration (EventID, UserID, RegistrationDate, RegistrationStatus)
            VALUES (${eventId}, ${userId}, GETDATE(), 'Confirmed')
        `
        await executeQuery(insertQuery)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to register for event' },
            { status: 500 }
        )
    }
}