import { executeQuery } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        // Get total events
        const eventsQuery = `
            SELECT COUNT(*) as totalEvents,
                   (SELECT COUNT(*) FROM Event WHERE StartDate > GETDATE()) as upcomingEvents
            FROM Event
        `
        const eventsResult = await executeQuery(eventsQuery)

        // Get total users and active registrations
        const usersQuery = `
            SELECT 
                (SELECT COUNT(*) FROM [User]) as totalUsers,
                (SELECT COUNT(*) FROM Registration WHERE RegistrationStatus = 'Confirmed') as activeRegistrations
            FROM [User]
        `
        const usersResult = await executeQuery(usersQuery)

        // Get total revenue
        const revenueQuery = `
            SELECT ISNULL(SUM(Amount), 0) as totalRevenue
            FROM Payment 
            WHERE PaymentStatus = 'Completed'
        `
        const revenueResult = await executeQuery(revenueQuery)

        // Get total venues
        const venuesQuery = `SELECT COUNT(*) as totalVenues FROM Venue`
        const venuesResult = await executeQuery(venuesQuery)

        return NextResponse.json({
            success: true,
            stats: {
                totalEvents: eventsResult[0].totalEvents,
                totalUsers: usersResult[0].totalUsers,
                totalRevenue: revenueResult[0].totalRevenue,
                upcomingEvents: eventsResult[0].upcomingEvents,
                totalVenues: venuesResult[0].totalVenues,
                activeRegistrations: usersResult[0].activeRegistrations
            }
        })
    } catch (error) {
        console.error('Dashboard stats error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch dashboard stats' },
            { status: 500 }
        )
    }
}