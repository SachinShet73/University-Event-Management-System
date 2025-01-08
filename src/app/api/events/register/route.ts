import { executeQuery } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { eventId, userId } = await request.json()
        
        if (!eventId || !userId) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Check if user is already registered
        const checkQuery = `
            SELECT RegistrationID 
            FROM Registration 
            WHERE EventID = @param0 AND UserID = @param1
            AND RegistrationStatus <> 'Cancelled'
        `
        const existingRegistration = await executeQuery(checkQuery, [eventId, userId])
        
        if (existingRegistration.length > 0) {
            return NextResponse.json(
                { success: false, message: 'You are already registered for this event' },
                { status: 400 }
            )
        }

        // Check event capacity
        const capacityQuery = `
            SELECT 
                e.EventID,
                v.VenueCapacity,
                (
                    SELECT COUNT(*) 
                    FROM Registration r 
                    WHERE r.EventID = e.EventID 
                    AND r.RegistrationStatus <> 'Cancelled'
                ) as registered
            FROM Event e
            JOIN Venue v ON e.VenueID = v.VenueID
            WHERE e.EventID = @param0
        `
        const capacityResult = await executeQuery(capacityQuery, [eventId])
        
        if (capacityResult.length === 0) {
            return NextResponse.json(
                { success: false, message: 'Event not found' },
                { status: 404 }
            )
        }

        const event = capacityResult[0]

        if (event.registered >= event.VenueCapacity) {
            return NextResponse.json(
                { success: false, message: 'Event is full' },
                { status: 400 }
            )
        }

        // Perform registration and ticket creation in a single transaction
        const registrationQuery = `
            BEGIN TRY
                BEGIN TRANSACTION;
                
                -- Create registration
                DECLARE @RegistrationID INT;
                
                INSERT INTO Registration (
                    EventID, 
                    UserID, 
                    RegistrationDate, 
                    RegistrationStatus
                )
                VALUES (
                    @param0,       -- EventID
                    @param1,       -- UserID
                    GETDATE(),     -- RegistrationDate
                    'Confirmed'    -- RegistrationStatus (Valid values: 'Pending', 'Confirmed', 'Cancelled')
                );
                
                SET @RegistrationID = SCOPE_IDENTITY();
                
                -- Create ticket
                INSERT INTO Ticket (
                    EventID,
                    UserID,
                    TicketType,
                    TicketPrice,
                    TicketStatus,
                    TicketIssueDate
                )
                VALUES (
                    @param0,         -- EventID
                    @param1,         -- UserID
                    'Regular',       -- TicketType
                    0.00,           -- TicketPrice (CHECK constraint: must be >= 0)
                    'Issued',       -- TicketStatus (CHECK constraint: must be 'Issued' or 'Cancelled')
                    GETDATE()       -- TicketIssueDate
                );
                
                COMMIT TRANSACTION;
                SELECT @RegistrationID as registrationId;
            END TRY
            BEGIN CATCH
                IF @@TRANCOUNT > 0
                    ROLLBACK TRANSACTION;
                    
                -- Log detailed error information
                DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
                DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
                DECLARE @ErrorState INT = ERROR_STATE();
                
                RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
            END CATCH
        `
        
        const registrationResult = await executeQuery(registrationQuery, [eventId, userId])
        
        if (!registrationResult || !registrationResult[0]?.registrationId) {
            throw new Error('Registration failed - no registration ID returned')
        }

        return NextResponse.json({ 
            success: true, 
            registrationId: registrationResult[0].registrationId 
        })
        
    } catch (error) {
        console.error('Registration error:', error)
        
        // Check if it's a SQL Server error with a specific message
        const errorMessage = error instanceof Error ? error.message : 'Failed to register for event'
        
        return NextResponse.json(
            { 
                success: false, 
                message: errorMessage
            },
            { status: 500 }
        )
    }
}