import { executeQuery } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json()
        const query = `
            UPDATE [User]
            SET 
                UserFName = '${body.UserFName}',
                UserLName = '${body.UserLName}',
                UserEmail = '${body.UserEmail}',
                UserPhone = '${body.UserPhone}',
                UserRole = '${body.UserRole}'
                ${body.Password ? `, Password = '${body.Password}'` : ''}
            WHERE UserID = ${params.id}
        `
        await executeQuery(query)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Update user error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update user' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const query = `
            DELETE FROM [User]
            WHERE UserID = ${params.id}
        `
        await executeQuery(query)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete user error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to delete user' },
            { status: 500 }
        )
    }
}