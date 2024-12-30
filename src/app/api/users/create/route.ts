import { executeQuery } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const query = `
            INSERT INTO [User] (
                UserFName,
                UserLName,
                UserEmail,
                UserPhone,
                UserRole,
                Password
            ) VALUES (
                '${body.UserFName}',
                '${body.UserLName}',
                '${body.UserEmail}',
                '${body.UserPhone}',
                '${body.UserRole}',
                '${body.Password}'
            )
        `
        await executeQuery(query)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Create user error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create user' },
            { status: 500 }
        )
    }
}