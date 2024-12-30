import { executeQuery } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()
        const query = `
            SELECT UserID, UserFName, UserLName, UserEmail, UserRole 
            FROM [User] 
            WHERE UserEmail = '${email}' AND Password = '${password}'
        `
        const user = await executeQuery(query)
        
        if (user && user.length > 0) {
            return NextResponse.json({ success: true, user: user[0] })
        }
        
        return NextResponse.json(
            { success: false, message: 'Invalid credentials' },
            { status: 401 }
        )
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Server error' },
            { status: 500 }
        )
    }
}