import { executeQuery } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const query = `
            SELECT 
                UserID,
                UserFName,
                UserLName,
                UserEmail,
                UserPhone,
                UserRole
            FROM [User]
            ORDER BY UserFName, UserLName
        `
        const users = await executeQuery(query)
        return NextResponse.json({ success: true, users })
    } catch (error) {
        console.error('Users API error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch users' },
            { status: 500 }
        )
    }
}