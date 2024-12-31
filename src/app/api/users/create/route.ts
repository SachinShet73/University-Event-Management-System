import { executeQuery } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Validate required fields
        if (!body.UserFName || !body.UserLName || !body.UserEmail || !body.UserRole || !body.Password) {
            return NextResponse.json(
                { success: false, message: 'Required fields are missing' },
                { status: 400 }
            )
        }

        const query = `
            INSERT INTO [User] (
                UserFName,
                UserLName,
                UserEmail,
                UserPhone,
                UserRole,
                Password
            ) VALUES (
                @param0,
                @param1,
                @param2,
                @param3,
                @param4,
                @param5
            )
        `
        await executeQuery(query, [
            body.UserFName,
            body.UserLName,
            body.UserEmail,
            body.UserPhone || null,
            body.UserRole,
            body.Password
        ])
        
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Create user error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create user' },
            { status: 500 }
        )
    }
}