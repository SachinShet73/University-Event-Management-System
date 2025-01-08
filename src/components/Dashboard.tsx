'use client'

import { useState } from 'react'
import Events from './features/Events'
import EventForm from './features/EventForm'
import Venues from './features/Venues'
import Attendees from './features/Attendees'
import AdminDashboard from './features/AdminDashboard'
import {
  LayoutDashboard,
  Calendar,
  Users,
  MapPin,
  LogOut,
  PlusCircle
} from 'lucide-react'

interface DashboardProps {
  user: {
    UserID: number;
    UserFName: string;
    UserLName: string;
    UserEmail: string;
    UserRole: string;
  };
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [currentView, setCurrentView] = useState('events')
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)

  const handleEditEvent = (eventId: number) => {
    setSelectedEventId(eventId)
    setCurrentView('edit-event')
  }

  const handleSaveEvent = () => {
    setCurrentView('events')
  }

  const getNavigationItems = () => {
    if (user.UserRole.toLowerCase() === 'admin') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'events', label: 'Events', icon: Calendar },
        { id: 'create-event', label: 'Create Event', icon: PlusCircle },
        { id: 'venues', label: 'Venues', icon: MapPin },
        { id: 'attendees', label: 'Attendees', icon: Users }
      ];
    } else if (user.UserRole.toLowerCase() === 'organizer') {
      return [
        { id: 'events', label: 'Events', icon: Calendar },
        { id: 'create-event', label: 'Create Event', icon: PlusCircle }
      ];
    } else {
      return [
        { id: 'events', label: 'Events', icon: Calendar }
      ];
    }
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <>
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <AdminDashboard />
          </>
        );

      case 'events':
        return (
          <>
            <h1 className="text-2xl font-bold mb-4">Events</h1>
            <Events 
              userRole={user.UserRole.toLowerCase()} 
              onEdit={handleEditEvent}
              userId={user.UserID}
            />
          </>
        );

      case 'create-event':
        return (
          <>
            <h1 className="text-2xl font-bold mb-4"></h1>
            <EventForm 
              onClose={() => setCurrentView('events')}
              onSave={handleSaveEvent}
              userRole={user.UserRole.toLowerCase()}
              organizerId={user.UserID}
            />
          </>
        );

      case 'edit-event':
        return (
          <>
            <h1 className="text-2xl font-bold mb-4">Edit Event</h1>
            <EventForm 
              eventId={selectedEventId}
              onClose={() => setCurrentView('events')}
              onSave={handleSaveEvent}
              userRole={user.UserRole.toLowerCase()}
              organizerId={user.UserID}
            />
          </>
        );

      case 'venues':
        return (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Venue Management</h1>

            <Venues />
          </>
        );

      case 'attendees':
        return (
          <>
            <h1 className="text-2xl font-bold mb-4"></h1>
            <Attendees />
          </>
        );

      default:
        return (
          <p className="text-gray-600">
            Select an option from the sidebar to view content
          </p>
        );
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed left-0 top-0 w-64 h-full bg-indigo-800 text-white p-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Event Management</h2>
          <p className="text-sm text-indigo-200 mt-1">Welcome, {user.UserFName}</p>
          <p className="text-xs text-indigo-300">{user.UserRole}</p>
        </div>

        <nav className="space-y-2">
          {getNavigationItems().map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
                currentView === item.id
                  ? 'bg-indigo-900 text-white'
                  : 'text-indigo-100 hover:bg-indigo-700'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}

          <button
            onClick={onLogout}
            className="flex items-center space-x-3 w-full p-3 rounded-lg text-indigo-100 hover:bg-red-600 transition-colors mt-8"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      <div className="ml-64 p-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}