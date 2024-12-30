import { executeQuery } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// PUT handler
export async function PUT(request: NextRequest) {
    const { pathname } = request.nextUrl
    const id = pathname.split('/').pop() // Extract userId from the URL

    if (!id) {
        return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 })
    }

    try {
        const body = await request.json()

        const query = `
            UPDATE [User]
            SET 
                UserFName = @UserFName,
                UserLName = @UserLName,
                UserEmail = @UserEmail,
                UserPhone = @UserPhone,
                UserRole = @UserRole
                ${body.Password ? `, Password = @Password` : ''}
            WHERE UserID = @UserID
        `

        await executeQuery(query, [
            body.UserFName,
            body.UserLName,
            body.UserEmail,
            body.UserPhone,
            body.UserRole,
            body.Password,
            id
        ])

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Update user error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update user' },
            { status: 500 }
        )
    }
}

// DELETE handler
export async function DELETE(request: NextRequest) {
    const { pathname } = request.nextUrl
    const id = pathname.split('/').pop() // Extract userId from the URL

    if (!id) {
        return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 })
    }

    try {
        const query = `DELETE FROM [User] WHERE UserID = @UserID`
        await executeQuery(query, [id])

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete user error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to delete user' },
            { status: 500 }
        )
    }
}
