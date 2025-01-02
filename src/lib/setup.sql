-- Create Database
CREATE DATABASE UniversityEventManagementSystem;
GO

USE UniversityEventManagementSystem;
GO

-- Create VenueType Table
CREATE TABLE VenueType (
    VenueTypeID INT IDENTITY(1,1) PRIMARY KEY,
    VenueTypeName VARCHAR(50) NOT NULL,
    Description VARCHAR(255)
);
GO

-- Create Venue Table
CREATE TABLE Venue (
    VenueID INT IDENTITY(1,1) PRIMARY KEY,
    VenueTypeID INT NOT NULL,
    VenueName VARCHAR(100) NOT NULL,
    VenueCapacity INT NOT NULL,
    VenueLocation VARCHAR(255) NOT NULL,
    FOREIGN KEY (VenueTypeID) REFERENCES VenueType(VenueTypeID)
);
GO

-- Create EventCategory Table
CREATE TABLE EventCategory (
    EventCategoryID INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName VARCHAR(50) NOT NULL,
    CategoryDescription VARCHAR(255)
);
GO

-- Create User Table
CREATE TABLE [User] (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    UserFName VARCHAR(50) NOT NULL,
    UserLName VARCHAR(50) NOT NULL,
    UserEmail VARCHAR(100) NOT NULL UNIQUE,
    UserPhone VARCHAR(20),
    UserRole VARCHAR(20) NOT NULL CHECK (UserRole IN ('Admin', 'Organizer', 'Attendee')),
    Password VARCHAR(100) NOT NULL
);
GO

-- Create Event Table
CREATE TABLE Event (
    EventID INT IDENTITY(1,1) PRIMARY KEY,
    VenueID INT NOT NULL,
    EventCategoryID INT NOT NULL,
    OrganizerID INT NOT NULL,
    EventTitle VARCHAR(100) NOT NULL,
    EventDescription TEXT,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    EventBudget DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (VenueID) REFERENCES Venue(VenueID),
    FOREIGN KEY (EventCategoryID) REFERENCES EventCategory(EventCategoryID),
    FOREIGN KEY (OrganizerID) REFERENCES [User](UserID)
);
GO

-- Create Registration Table
CREATE TABLE Registration (
    RegistrationID INT IDENTITY(1,1) PRIMARY KEY,
    EventID INT NOT NULL,
    UserID INT NOT NULL,
    RegistrationDate DATETIME NOT NULL DEFAULT GETDATE(),
    RegistrationStatus VARCHAR(20) NOT NULL CHECK (RegistrationStatus IN ('Pending', 'Confirmed', 'Cancelled')),
    FOREIGN KEY (EventID) REFERENCES Event(EventID),
    FOREIGN KEY (UserID) REFERENCES [User](UserID)
);
GO

-- Create Payment Table
CREATE TABLE Payment (
    PaymentID INT IDENTITY(1,1) PRIMARY KEY,
    RegistrationID INT NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    PaymentDate DATETIME NOT NULL DEFAULT GETDATE(),
    PaymentStatus VARCHAR(20) NOT NULL CHECK (PaymentStatus IN ('Pending', 'Completed', 'Failed', 'Refunded')),
    FOREIGN KEY (RegistrationID) REFERENCES Registration(RegistrationID)
);
GO

-- Create Ticket Table
CREATE TABLE Ticket (
    TicketID INT IDENTITY(1,1) PRIMARY KEY,
    EventID INT NOT NULL,
    UserID INT NOT NULL,
    TicketType VARCHAR(50) NOT NULL,
    TicketPrice DECIMAL(10,2) NOT NULL,
    TicketStatus VARCHAR(20) NOT NULL CHECK (TicketStatus IN ('Valid', 'Used', 'Cancelled')),
    TicketIssueDate DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (EventID) REFERENCES Event(EventID),
    FOREIGN KEY (UserID) REFERENCES [User](UserID)
);
GO

-- Insert Sample Data

-- Insert Venue Types
INSERT INTO VenueType (VenueTypeName, Description) VALUES
('Auditorium', 'Large indoor venue for presentations and performances'),
('Conference Room', 'Medium-sized room for meetings and seminars'),
('Sports Field', 'Outdoor venue for sports events'),
('Exhibition Hall', 'Large space for exhibitions and fairs'),
('Lecture Hall', 'Academic venue for lectures and presentations');
GO

-- Insert Venues
INSERT INTO Venue (VenueTypeID, VenueName, VenueCapacity, VenueLocation) VALUES
(1, 'Main Auditorium', 500, 'Main Campus Building A'),
(2, 'Executive Conference Room', 50, 'Administration Building'),
(3, 'University Stadium', 1000, 'Sports Complex'),
(4, 'Innovation Center', 300, 'Research Building'),
(5, 'Grand Lecture Hall', 200, 'Academic Building B');
GO

-- Insert Event Categories
INSERT INTO EventCategory (CategoryName, CategoryDescription) VALUES
('Academic', 'Educational and academic events'),
('Cultural', 'Cultural and artistic events'),
('Sports', 'Sports and athletic events'),
('Workshop', 'Hands-on learning sessions'),
('Conference', 'Professional conferences and seminars');
GO

-- Insert Sample Users
INSERT INTO [User] (UserFName, UserLName, UserEmail, UserPhone, UserRole, Password) VALUES
('Admin', 'User', 'admin@university.edu', '1234567890', 'Admin', 'admin123'),
('John', 'Doe', 'john.doe@university.edu', '2345678901', 'Organizer', 'organizer123'),
('Jane', 'Smith', 'jane.smith@university.edu', '3456789012', 'Attendee', 'attendee123');
GO

-- Insert Sample Events
INSERT INTO Event (VenueID, EventCategoryID, OrganizerID, EventTitle, EventDescription, StartDate, EndDate, EventBudget) VALUES
(1, 1, 2, 'Annual Academic Conference', 'University''s flagship academic conference', '2024-03-15', '2024-03-17', 5000.00),
(3, 3, 2, 'Inter-University Sports Meet', 'Annual sports competition', '2024-04-10', '2024-04-12', 3000.00),
(2, 4, 2, 'Research Workshop', 'Workshop on research methodologies', '2024-03-20', '2024-03-20', 1000.00);
GO

-- Insert Sample Registrations
INSERT INTO Registration (EventID, UserID, RegistrationStatus) VALUES
(1, 3, 'Confirmed'),
(2, 3, 'Confirmed'),
(3, 3, 'Pending');
GO

-- Insert Sample Payments
INSERT INTO Payment (RegistrationID, Amount, PaymentStatus) VALUES
(1, 50.00, 'Completed'),
(2, 30.00, 'Completed'),
(3, 25.00, 'Pending');
GO

-- Insert Sample Tickets
INSERT INTO Ticket (EventID, UserID, TicketType, TicketPrice, TicketStatus) VALUES
(1, 3, 'Regular', 50.00, 'Valid'),
(2, 3, 'Regular', 30.00, 'Valid'),
(3, 3, 'Early Bird', 25.00, 'Valid');
GO