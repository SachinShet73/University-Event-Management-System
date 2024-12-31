import { executeQuery } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// PUT handler
export async function PUT(request: NextRequest) {
    const { pathname } = request.nextUrl
    const id = pathname.split('/').pop()

    if (!id) {
        return NextResponse.json(
            { success: false, message: 'User ID is required' },
            { status: 400 }
        )
    }

    try {
        const body = await request.json()

        // Validate required fields
        if (!body.UserFName || !body.UserLName || !body.UserEmail || !body.UserRole) {
            return NextResponse.json(
                { success: false, message: 'Required fields are missing' },
                { status: 400 }
            )
        }

        const params = [
            body.UserFName,
            body.UserLName,
            body.UserEmail,
            body.UserPhone || null,
            body.UserRole
        ]

        let query = `
            UPDATE [User]
            SET 
                UserFName = @param0,
                UserLName = @param1,
                UserEmail = @param2,
                UserPhone = @param3,
                UserRole = @param4
        `

        // Add password update if provided
        if (body.Password) {
            query += ', Password = @param5'
            params.push(body.Password)
        }

        query += ' WHERE UserID = @param' + params.length
        params.push(Number(id))

        await executeQuery(query, params)
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
    const id = pathname.split('/').pop()

    if (!id) {
        return NextResponse.json(
            { success: false, message: 'User ID is required' },
            { status: 400 }
        )
    }

    try {
        // First check if user has any associated records
        const checkQuery = `
            SELECT 
                (SELECT COUNT(*) FROM Event WHERE OrganizerID = @param0) as events,
                (SELECT COUNT(*) FROM Registration WHERE UserID = @param0) as registrations
        `
        const checkResult = await executeQuery(checkQuery, [Number(id)])

        if (checkResult[0].events > 0 || checkResult[0].registrations > 0) {
            return NextResponse.json(
                { 
                    success: false, 
                    message: 'Cannot delete user as they have associated events or registrations' 
                },
                { status: 400 }
            )
        }

        const query = `DELETE FROM [User] WHERE UserID = @param0`
        await executeQuery(query, [Number(id)])

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete user error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to delete user' },
            { status: 500 }
        )
    }
}