USE [master]
GO
/****** Object:  Database [UniversityEventManagementSystem]    Script Date: 1/8/2025 2:38:54 PM ******/
CREATE DATABASE [UniversityEventManagementSystem]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'UniversityEventManagementSystem', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\UniversityEventManagementSystem.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'UniversityEventManagementSystem_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\UniversityEventManagementSystem_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [UniversityEventManagementSystem] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [UniversityEventManagementSystem].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [UniversityEventManagementSystem] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [UniversityEventManagementSystem] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [UniversityEventManagementSystem] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [UniversityEventManagementSystem] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [UniversityEventManagementSystem] SET ARITHABORT OFF 
GO
ALTER DATABASE [UniversityEventManagementSystem] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [UniversityEventManagementSystem] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [UniversityEventManagementSystem] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [UniversityEventManagementSystem] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [UniversityEventManagementSystem] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [UniversityEventManagementSystem] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [UniversityEventManagementSystem] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [UniversityEventManagementSystem] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [UniversityEventManagementSystem] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [UniversityEventManagementSystem] SET  ENABLE_BROKER 
GO
ALTER DATABASE [UniversityEventManagementSystem] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [UniversityEventManagementSystem] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [UniversityEventManagementSystem] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [UniversityEventManagementSystem] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [UniversityEventManagementSystem] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [UniversityEventManagementSystem] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [UniversityEventManagementSystem] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [UniversityEventManagementSystem] SET RECOVERY FULL 
GO
ALTER DATABASE [UniversityEventManagementSystem] SET  MULTI_USER 
GO
ALTER DATABASE [UniversityEventManagementSystem] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [UniversityEventManagementSystem] SET DB_CHAINING OFF 
GO
ALTER DATABASE [UniversityEventManagementSystem] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [UniversityEventManagementSystem] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [UniversityEventManagementSystem] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [UniversityEventManagementSystem] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'UniversityEventManagementSystem', N'ON'
GO
ALTER DATABASE [UniversityEventManagementSystem] SET QUERY_STORE = ON
GO
ALTER DATABASE [UniversityEventManagementSystem] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [UniversityEventManagementSystem]
GO
/****** Object:  User [Sachina]    Script Date: 1/8/2025 2:38:54 PM ******/
CREATE USER [Sachina] FOR LOGIN [Sachina] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [Sachina]
GO
ALTER ROLE [db_datareader] ADD MEMBER [Sachina]
GO
ALTER ROLE [db_datawriter] ADD MEMBER [Sachina]
GO
/****** Object:  UserDefinedFunction [dbo].[CalculateEventDuration]    Script Date: 1/8/2025 2:38:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



--2)User-Defined Function to Calculate Event Duration

CREATE FUNCTION [dbo].[CalculateEventDuration] (@StartDate DATE, @EndDate DATE)
RETURNS INT
AS
BEGIN
    RETURN DATEDIFF(DAY, @StartDate, @EndDate);
END;

GO
/****** Object:  UserDefinedFunction [dbo].[GetFullAddress]    Script Date: 1/8/2025 2:38:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



--3)User-Defined Function for GetFullAddress

CREATE FUNCTION [dbo].[GetFullAddress] (@VenueName VARCHAR(100), @VenueLocation VARCHAR(255))
RETURNS VARCHAR(355)
AS
BEGIN
    RETURN CONCAT(@VenueName, ', ', @VenueLocation);
END;

GO
/****** Object:  UserDefinedFunction [dbo].[GetFullName]    Script Date: 1/8/2025 2:38:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



-----COMPUTED COLUMNS AND UDF-----

--1)User-Defined Function to Calculate FullName

CREATE FUNCTION [dbo].[GetFullName] (@FirstName VARCHAR(50), @LastName VARCHAR(50))
RETURNS VARCHAR(101)
AS
BEGIN
    RETURN CONCAT(@FirstName, ' ', @LastName);
END;

GO
/****** Object:  Table [dbo].[User]    Script Date: 1/8/2025 2:38:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[User](
	[UserID] [int] IDENTITY(1,1) NOT NULL,
	[UserFName] [varchar](50) NOT NULL,
	[UserLName] [varchar](50) NOT NULL,
	[UserEmail] [varchar](100) NOT NULL,
	[UserPhone] [varchar](15) NULL,
	[UserRole] [varchar](20) NULL,
	[Password] [varchar](100) NOT NULL,
	[FullName]  AS ([dbo].[GetFullName]([UserFName],[UserLName])),
	[EncryptedPhone] [varbinary](256) NULL,
PRIMARY KEY CLUSTERED 
(
	[UserID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[UserEmail] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Event]    Script Date: 1/8/2025 2:38:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Event](
	[EventID] [int] IDENTITY(1,1) NOT NULL,
	[VenueID] [int] NOT NULL,
	[EventCategoryID] [int] NOT NULL,
	[OrganizerID] [int] NOT NULL,
	[EventTitle] [varchar](100) NOT NULL,
	[EventDescription] [text] NULL,
	[StartDate] [date] NULL,
	[EndDate] [date] NULL,
	[EventBudget] [decimal](10, 2) NULL,
	[EventDuration]  AS ([dbo].[CalculateEventDuration]([StartDate],[EndDate])),
	[Status] [varchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[EventID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Attendance]    Script Date: 1/8/2025 2:38:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Attendance](
	[AttendanceID] [int] IDENTITY(1,1) NOT NULL,
	[UserID] [int] NOT NULL,
	[EventID] [int] NOT NULL,
	[CheckInTime] [datetime] NULL,
	[CheckOutTime] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[AttendanceID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  View [dbo].[View_AttendeeDetails]    Script Date: 1/8/2025 2:38:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



-----VIEWS-----

--1)View_AttendeeDetails: Shows detailed information about event attendees

CREATE VIEW [dbo].[View_AttendeeDetails]
AS
    SELECT
        e.EventTitle,
        CONCAT(u.UserFName, ' ', u.UserLName) AS AttendeeName,
        u.UserEmail,
        a.CheckInTime,
        a.CheckOutTime
    FROM
        Attendance a
        INNER JOIN [User] u ON a.UserID = u.UserID
        INNER JOIN Event e ON a.EventID = e.EventID;

GO
/****** Object:  Table [dbo].[Sponsor]    Script Date: 1/8/2025 2:38:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Sponsor](
	[SponsorID] [int] IDENTITY(1,1) NOT NULL,
	[SponsorFName] [varchar](50) NULL,
	[SponsorLName] [varchar](50) NULL,
	[SponsorPhone] [varchar](15) NULL,
	[SponsorEmail] [varchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[SponsorID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[SponsorEmail] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EventSponsor]    Script Date: 1/8/2025 2:38:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EventSponsor](
	[EventID] [int] NOT NULL,
	[SponsorID] [int] NOT NULL,
	[SponsorshipAmount] [decimal](10, 2) NULL,
	[SponsoredDate] [date] NULL,
	[SponsorshipType] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[EventID] ASC,
	[SponsorID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  View [dbo].[View_SponsorshipSummary]    Script Date: 1/8/2025 2:38:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



--2)View_SponsorshipSummary: Summarizes sponsorship amounts by sponsor and event

CREATE VIEW [dbo].[View_SponsorshipSummary]
AS
    SELECT
        CONCAT(s.SponsorFName, ' ', s.SponsorLName) AS SponsorName,
        e.EventTitle,
        es.SponsorshipAmount,
        es.SponsorshipType
    FROM
        Sponsor s
        INNER JOIN EventSponsor es ON s.SponsorID = es.SponsorID
        INNER JOIN Event e ON es.EventID = e.EventID;

GO
/****** Object:  Table [dbo].[Venue]    Script Date: 1/8/2025 2:38:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Venue](
	[VenueID] [int] IDENTITY(1,1) NOT NULL,
	[VenueTypeID] [int] NOT NULL,
	[VenueName] [varchar](100) NOT NULL,
	[VenueCapacity] [int] NULL,
	[VenueLocation] [varchar](255) NULL,
	[FullAddress]  AS ([dbo].[GetFullAddress]([VenueName],[VenueLocation])),
PRIMARY KEY CLUSTERED 
(
	[VenueID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  View [dbo].[View_VenueUtilization]    Script Date: 1/8/2025 2:38:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



--3)View_VenueUtilization: Shows venue usage details by event, including capacity utilization

CREATE VIEW [dbo].[View_VenueUtilization]
AS
    SELECT
        e.EventTitle,
        v.VenueName,
        v.VenueCapacity,
        COUNT(a.UserID) AS AttendeeCount,
        CAST(COUNT(a.UserID) AS FLOAT) / v.VenueCapacity * 100 AS UtilizationPercent
    FROM
        Event e
        INNER JOIN Venue v ON e.VenueID = v.VenueID
        LEFT JOIN Attendance a ON e.EventID = a.EventID
    GROUP BY 
    e.EventTitle, v.VenueName, v.VenueCapacity;

GO
/****** Object:  Table [dbo].[Booking]    Script Date: 1/8/2025 2:38:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Booking](
	[BookingID] [int] IDENTITY(1,1) NOT NULL,
	[VenueID] [int] NOT NULL,
	[OrganizerID] [int] NOT NULL,
	[BookingDate] [date] NOT NULL,
	[BookingStatus] [varchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[BookingID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EventBudgetChangeLog]    Script Date: 1/8/2025 2:38:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EventBudgetChangeLog](
	[LogID] [int] IDENTITY(1,1) NOT NULL,
	[EventID] [int] NULL,
	[OldBudget] [decimal](10, 2) NULL,
	[NewBudget] [decimal](10, 2) NULL,
	[ChangedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[LogID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EventCategory]    Script Date: 1/8/2025 2:38:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EventCategory](
	[EventCategoryID] [int] IDENTITY(1,1) NOT NULL,
	[CategoryName] [varchar](50) NOT NULL,
	[CategoryDescription] [text] NULL,
PRIMARY KEY CLUSTERED 
(
	[EventCategoryID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EventResourceAllocation]    Script Date: 1/8/2025 2:38:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EventResourceAllocation](
	[AllocationID] [int] IDENTITY(1,1) NOT NULL,
	[EventID] [int] NOT NULL,
	[ResourceID] [int] NOT NULL,
	[AllocatedQuantity] [int] NULL,
	[AllocationDate] [date] NULL,
	[AllocationTime] [time](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[AllocationID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Organizer]    Script Date: 1/8/2025 2:38:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Organizer](
	[OrganizerID] [int] IDENTITY(1,1) NOT NULL,
	[OrganizerFName] [varchar](50) NOT NULL,
	[OrganizerLName] [varchar](50) NOT NULL,
	[OrganizerRole] [varchar](20) NULL,
	[OrganizerPhone] [varchar](15) NULL,
	[OrganizerEmail] [varchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[OrganizerID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[OrganizerEmail] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Payment]    Script Date: 1/8/2025 2:38:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Payment](
	[PaymentID] [int] IDENTITY(1,1) NOT NULL,
	[RegistrationID] [int] NOT NULL,
	[Amount] [decimal](10, 2) NOT NULL,
	[PaymentDate] [date] NOT NULL,
	[PaymentStatus] [varchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[PaymentID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Registration]    Script Date: 1/8/2025 2:38:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Registration](
	[RegistrationID] [int] IDENTITY(1,1) NOT NULL,
	[EventID] [int] NOT NULL,
	[UserID] [int] NOT NULL,
	[RegistrationDate] [date] NOT NULL,
	[RegistrationStatus] [varchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[RegistrationID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RegistrationDeletionLog]    Script Date: 1/8/2025 2:38:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RegistrationDeletionLog](
	[LogID] [int] IDENTITY(1,1) NOT NULL,
	[RegistrationID] [int] NULL,
	[UserID] [int] NULL,
	[EventID] [int] NULL,
	[RegistrationDate] [date] NULL,
	[RegistrationStatus] [varchar](20) NULL,
	[DeletedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[LogID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Resource]    Script Date: 1/8/2025 2:38:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Resource](
	[ResourceID] [int] IDENTITY(1,1) NOT NULL,
	[ResourceName] [varchar](100) NOT NULL,
	[ResourceDescription] [text] NULL,
	[Quantity] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[ResourceID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Ticket]    Script Date: 1/8/2025 2:38:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Ticket](
	[TicketID] [int] IDENTITY(1,1) NOT NULL,
	[EventID] [int] NOT NULL,
	[UserID] [int] NOT NULL,
	[TicketType] [varchar](20) NOT NULL,
	[TicketPrice] [decimal](10, 2) NULL,
	[TicketIssueDate] [date] NULL,
	[TicketStatus] [varchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[TicketID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[VenueType]    Script Date: 1/8/2025 2:38:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[VenueType](
	[VenueTypeID] [int] IDENTITY(1,1) NOT NULL,
	[VenueTypeName] [varchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[VenueTypeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Event] ADD  DEFAULT ('Active') FOR [Status]
GO
ALTER TABLE [dbo].[EventBudgetChangeLog] ADD  DEFAULT (getdate()) FOR [ChangedAt]
GO
ALTER TABLE [dbo].[RegistrationDeletionLog] ADD  DEFAULT (getdate()) FOR [DeletedAt]
GO
ALTER TABLE [dbo].[Attendance]  WITH CHECK ADD FOREIGN KEY([EventID])
REFERENCES [dbo].[Event] ([EventID])
GO
ALTER TABLE [dbo].[Attendance]  WITH CHECK ADD FOREIGN KEY([UserID])
REFERENCES [dbo].[User] ([UserID])
GO
ALTER TABLE [dbo].[Attendance]  WITH CHECK ADD  CONSTRAINT [FK_Attendance_Event] FOREIGN KEY([EventID])
REFERENCES [dbo].[Event] ([EventID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Attendance] CHECK CONSTRAINT [FK_Attendance_Event]
GO
ALTER TABLE [dbo].[Booking]  WITH CHECK ADD FOREIGN KEY([OrganizerID])
REFERENCES [dbo].[Organizer] ([OrganizerID])
GO
ALTER TABLE [dbo].[Booking]  WITH CHECK ADD FOREIGN KEY([VenueID])
REFERENCES [dbo].[Venue] ([VenueID])
GO
ALTER TABLE [dbo].[Event]  WITH CHECK ADD FOREIGN KEY([OrganizerID])
REFERENCES [dbo].[Organizer] ([OrganizerID])
GO
ALTER TABLE [dbo].[EventResourceAllocation]  WITH CHECK ADD FOREIGN KEY([EventID])
REFERENCES [dbo].[Event] ([EventID])
GO
ALTER TABLE [dbo].[EventResourceAllocation]  WITH CHECK ADD FOREIGN KEY([ResourceID])
REFERENCES [dbo].[Resource] ([ResourceID])
GO
ALTER TABLE [dbo].[EventResourceAllocation]  WITH CHECK ADD  CONSTRAINT [FK_EventResource_Event] FOREIGN KEY([EventID])
REFERENCES [dbo].[Event] ([EventID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[EventResourceAllocation] CHECK CONSTRAINT [FK_EventResource_Event]
GO
ALTER TABLE [dbo].[EventSponsor]  WITH CHECK ADD FOREIGN KEY([EventID])
REFERENCES [dbo].[Event] ([EventID])
GO
ALTER TABLE [dbo].[EventSponsor]  WITH CHECK ADD FOREIGN KEY([SponsorID])
REFERENCES [dbo].[Sponsor] ([SponsorID])
GO
ALTER TABLE [dbo].[EventSponsor]  WITH CHECK ADD  CONSTRAINT [FK_EventSponsor_Event] FOREIGN KEY([EventID])
REFERENCES [dbo].[Event] ([EventID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[EventSponsor] CHECK CONSTRAINT [FK_EventSponsor_Event]
GO
ALTER TABLE [dbo].[Payment]  WITH CHECK ADD  CONSTRAINT [FK_Payment_Registration] FOREIGN KEY([RegistrationID])
REFERENCES [dbo].[Registration] ([RegistrationID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Payment] CHECK CONSTRAINT [FK_Payment_Registration]
GO
ALTER TABLE [dbo].[Registration]  WITH CHECK ADD FOREIGN KEY([UserID])
REFERENCES [dbo].[User] ([UserID])
GO
ALTER TABLE [dbo].[Registration]  WITH CHECK ADD  CONSTRAINT [FK_Registration_Event] FOREIGN KEY([EventID])
REFERENCES [dbo].[Event] ([EventID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Registration] CHECK CONSTRAINT [FK_Registration_Event]
GO
ALTER TABLE [dbo].[Ticket]  WITH CHECK ADD FOREIGN KEY([UserID])
REFERENCES [dbo].[User] ([UserID])
GO
ALTER TABLE [dbo].[Ticket]  WITH CHECK ADD  CONSTRAINT [FK_Ticket_Event] FOREIGN KEY([EventID])
REFERENCES [dbo].[Event] ([EventID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Ticket] CHECK CONSTRAINT [FK_Ticket_Event]
GO
ALTER TABLE [dbo].[Venue]  WITH CHECK ADD FOREIGN KEY([VenueTypeID])
REFERENCES [dbo].[VenueType] ([VenueTypeID])
GO
ALTER TABLE [dbo].[Attendance]  WITH CHECK ADD  CONSTRAINT [CHK_CheckOutAfterCheckIn] CHECK  (([CheckOutTime]>[CheckInTime]))
GO
ALTER TABLE [dbo].[Attendance] CHECK CONSTRAINT [CHK_CheckOutAfterCheckIn]
GO
ALTER TABLE [dbo].[Booking]  WITH CHECK ADD CHECK  (([BookingStatus]='Cancelled' OR [BookingStatus]='Confirmed' OR [BookingStatus]='Pending'))
GO
ALTER TABLE [dbo].[Event]  WITH CHECK ADD  CONSTRAINT [CHK_PRJ_StartDateBeforeEndDate] CHECK  (([StartDate]<=[EndDate]))
GO
ALTER TABLE [dbo].[Event] CHECK CONSTRAINT [CHK_PRJ_StartDateBeforeEndDate]
GO
ALTER TABLE [dbo].[Event]  WITH CHECK ADD CHECK  (([EventBudget]>=(0)))
GO
ALTER TABLE [dbo].[EventResourceAllocation]  WITH CHECK ADD CHECK  (([AllocatedQuantity]>(0)))
GO
ALTER TABLE [dbo].[EventSponsor]  WITH CHECK ADD CHECK  (([SponsorshipAmount]>(0)))
GO
ALTER TABLE [dbo].[Organizer]  WITH CHECK ADD CHECK  (([OrganizerRole]='Coordinator' OR [OrganizerRole]='Event Manager'))
GO
ALTER TABLE [dbo].[Payment]  WITH CHECK ADD CHECK  (([Amount]>(0)))
GO
ALTER TABLE [dbo].[Payment]  WITH CHECK ADD CHECK  (([PaymentStatus]='Refunded' OR [PaymentStatus]='Completed' OR [PaymentStatus]='Pending'))
GO
ALTER TABLE [dbo].[Registration]  WITH CHECK ADD CHECK  (([RegistrationStatus]='Cancelled' OR [RegistrationStatus]='Confirmed' OR [RegistrationStatus]='Pending'))
GO
ALTER TABLE [dbo].[Resource]  WITH CHECK ADD CHECK  (([Quantity]>(0)))
GO
ALTER TABLE [dbo].[Ticket]  WITH CHECK ADD CHECK  (([TicketPrice]>=(0)))
GO
ALTER TABLE [dbo].[Ticket]  WITH CHECK ADD CHECK  (([TicketStatus]='Cancelled' OR [TicketStatus]='Issued'))
GO
ALTER TABLE [dbo].[User]  WITH CHECK ADD CHECK  (([UserRole]='Admin' OR [UserRole]='Organizer' OR [UserRole]='Attendee'))
GO
ALTER TABLE [dbo].[Venue]  WITH CHECK ADD CHECK  (([VenueCapacity]>(0)))
GO
/****** Object:  StoredProcedure [dbo].[GetEventBudgetStatus]    Script Date: 1/8/2025 2:38:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetEventBudgetStatus]
    @ExpectedBudget DECIMAL(10,2),
    @OverBudgetCount INT OUTPUT
AS
BEGIN
    BEGIN TRY

-- Check for null or invalid input
        IF @ExpectedBudget IS NULL OR @ExpectedBudget <= 0
        BEGIN
        RAISERROR('ExpectedBudget must be a positive value', 16, 1);
        RETURN;
    END

-- Select events with budget status
        SELECT DISTINCT
        e.EventID,
        e.EventTitle,
        e.EventBudget,
        CASE 
                WHEN e.EventBudget > @ExpectedBudget THEN 'Over Budget'
                ELSE 'Under Budget'
            END AS BudgetStatus
    FROM
        Event e;

-- Set count of events over budget
        SET @OverBudgetCount = (SELECT COUNT(*)
    FROM Event e
    WHERE e.EventBudget > @ExpectedBudget);
    END TRY
    BEGIN CATCH
        -- Handle errors by setting output to null and reporting the error
        SET @OverBudgetCount = NULL;
        PRINT 'An error occurred in GetEventBudgetStatus.';
        THROW;
    END CATCH
END;

GO
/****** Object:  StoredProcedure [dbo].[GetResourcesByVenueType]    Script Date: 1/8/2025 2:38:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetResourcesByVenueType]
    @VenueTypeName VARCHAR(50),
    @ResourceCount INT OUTPUT
AS
BEGIN
    BEGIN TRY
        -- Check for null input
        IF @VenueTypeName IS NULL
        BEGIN
        RAISERROR('VenueTypeName parameter cannot be null', 16, 1);
        RETURN;
    END

        -- Select resources allocated to events at venues of specified type
        SELECT
        r.ResourceID,
        r.ResourceName,
        SUM(era.AllocatedQuantity) AS TotalAllocatedQuantity
    FROM
        Resource r
        INNER JOIN EventResourceAllocation era ON r.ResourceID = era.ResourceID
        INNER JOIN Event e ON era.EventID = e.EventID
        INNER JOIN Venue v ON e.VenueID = v.VenueID
        INNER JOIN VenueType vt ON v.VenueTypeID = vt.VenueTypeID
    WHERE 
            vt.VenueTypeName = @VenueTypeName
    GROUP BY 
            r.ResourceID, r.ResourceName;

        -- Set distinct resource count
        SET @ResourceCount = (SELECT COUNT(DISTINCT r.ResourceID)
    FROM Resource r
        INNER JOIN EventResourceAllocation era ON r.ResourceID = era.ResourceID
        INNER JOIN Event e ON era.EventID = e.EventID
        INNER JOIN Venue v ON e.VenueID = v.VenueID
        INNER JOIN VenueType vt ON v.VenueTypeID = vt.VenueTypeID
    WHERE vt.VenueTypeName = @VenueTypeName);
    END TRY
    BEGIN CATCH
        -- Handle errors by setting output to null and reporting the error
        SET @ResourceCount = NULL;
        PRINT 'An error occurred in GetResourcesByVenueType.';
        THROW;
    END CATCH
END;

GO
/****** Object:  StoredProcedure [dbo].[GetUsersByEvent]    Script Date: 1/8/2025 2:38:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-----STORED PROCEDURES-----

--SP1:GetUsersByEvent-Lists all users registered for a specific event. Returns a result set with user details and event title:

CREATE PROCEDURE [dbo].[GetUsersByEvent]
    @EventTitle VARCHAR(100),
    @TotalUsers INT OUTPUT
AS
BEGIN
    BEGIN TRY
        -- Check for null input
        IF @EventTitle IS NULL
        BEGIN
        RAISERROR('EventTitle parameter cannot be null', 16, 1);
        RETURN;
    END

        -- Select registered users for the specified event
        SELECT DISTINCT
        u.UserID,
        CONCAT(u.UserFName, ' ', u.UserLName) AS FullName,
        u.UserEmail,
        u.UserPhone,
        r.RegistrationStatus
    FROM
        [User] u
        INNER JOIN Registration r ON u.UserID = r.UserID
        INNER JOIN Event e ON r.EventID = e.EventID
    WHERE 
            e.EventTitle = @EventTitle;

        -- Set total distinct user count
        SET @TotalUsers = (SELECT COUNT(DISTINCT u.UserID)
    FROM [User] u
        INNER JOIN Registration r ON u.UserID = r.UserID
        INNER JOIN Event e ON r.EventID = e.EventID
    WHERE e.EventTitle = @EventTitle);
    END TRY
    BEGIN CATCH
        -- Handle errors by setting output to null and reporting the error
        SET @TotalUsers = NULL;
        PRINT 'An error occurred in GetUsersByEvent.';
        THROW;
    END CATCH
END;

GO
USE [master]
GO
ALTER DATABASE [UniversityEventManagementSystem] SET  READ_WRITE 
GO
