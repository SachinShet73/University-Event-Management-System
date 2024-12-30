'use client'

import { useEffect, useState } from 'react'
import { Calendar, MapPin, Users, Clock, Search, Filter, X, Ticket } from 'lucide-react'

interface Event {
  EventID: number
  EventTitle: string
  EventDescription: string
  StartDate: string
  EndDate: string
  VenueName: string
  registered: number
  VenueCapacity: number
  CategoryName: string
  EventBudget: number
}

interface Ticket {
  TicketID: number
  EventTitle: string
  TicketType: string
  TicketPrice: number
  TicketStatus: string
  TicketIssueDate: string
}

interface EventsProps {
  userRole: string;
  onEdit?: (eventId: number) => void;
  userId: number;
}

export default function Events({ userRole, onEdit, userId }: EventsProps) {
  // Basic state
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  // Ticket and modal state
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showTickets, setShowTickets] = useState(false)
  const [userTickets, setUserTickets] = useState<Ticket[]>([])

  // Initial load
  useEffect(() => {
    fetchEvents()
  }, [])

  // Filter events based on search and category
  useEffect(() => {
    if (!events.length) return;
    
    const filtered = events.filter(event => {
      const matchesSearch = event.EventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.EventDescription.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !categoryFilter || event.CategoryName === categoryFilter
      return matchesSearch && matchesCategory
    })
    setFilteredEvents(filtered)
  }, [searchTerm, categoryFilter, events])

  // Fetch all events
  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetch('/api/events/')
      if (!response.ok) {
        throw new Error('Failed to fetch events')
      }
      const data = await response.json()

      if (data.success && data.events) {
        const sortedEvents = data.events.sort((a: Event, b: Event) => 
          new Date(a.StartDate).getTime() - new Date(b.StartDate).getTime()
        )
        setEvents(sortedEvents)
        setFilteredEvents(sortedEvents)
      } else {
        throw new Error(data.message || 'Failed to load events')
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      setError(error instanceof Error ? error.message : 'Error connecting to server')
    } finally {
      setLoading(false)
    }
  }

  // Fetch user tickets
  const fetchUserTickets = async () => {
    try {
      setError('')
      const response = await fetch(`/api/tickets/${userId}`)
      const data = await response.json()
      if (data.success) {
        setUserTickets(data.tickets)
      } else {
        setError(data.message || 'Failed to load tickets')
      }
    } catch (error) {
      console.error('Error fetching tickets:', error)
      setError('Failed to load tickets')
    }
  }

  // Handle event registration
  const handleRegister = async (eventId: number) => {
    try {
      setError('')
      const response = await fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, userId }),
      })
      const data = await response.json()
      if (data.success) {
        await fetchEvents()
        alert('Successfully registered for event!')
      } else {
        setError(data.message || 'Failed to register for event')
      }
    } catch (error) {
      console.error('Error registering:', error)
      setError('Failed to register for event')
    }
  }

  // Handle event cancellation
  const handleCancelEvent = async (eventId: number) => {
    if (!window.confirm('Are you sure you want to cancel this event?')) return

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        await fetchEvents()
      } else {
        setError(data.message || 'Failed to cancel event')
      }
    } catch (error) {
      setError('Failed to cancel event')
    }
  }

  // View ticket modal
  const handleViewTickets = () => {
    setShowTickets(true)
    fetchUserTickets()
  }

  // View event details
  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event)
  }

  // Get unique categories for filter
  const categories = Array.from(new Set(events.map(event => event.CategoryName))).sort()

  // Loading state
  if (loading) return (
    <div className="flex justify-center p-8">
      <div className="animate-spin h-8 w-8 border-4 border-indigo-600 rounded-full border-t-transparent"></div>
    </div>
  )

  // Error state
  if (error) return (
    <div className="text-red-600 p-4 text-center font-semibold">{error}</div>
  )

  return (
    <div>
      {/* Search and Filter Bar */}
      <div className="mb-6">
        <div className="flex gap-4 flex-wrap md:flex-nowrap">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-700" />
            <input
              type="text"
              placeholder="Search events..."
              className="w-full pl-10 pr-3 py-2 border-2 border-gray-400 rounded-lg text-gray-900 
                       placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative w-full md:w-48">
            <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-700" />
            <select
              className="w-full pl-10 pr-3 py-2 border-2 border-gray-400 rounded-lg appearance-none 
                       text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          {userRole === 'attendee' && (
            <button
              onClick={handleViewTickets}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 
                       transition-colors flex items-center gap-2 font-semibold"
            >
              <Ticket size={20} />
              My Tickets
            </button>
          )}
        </div>
      </div>

      {/* Tickets Modal */}
      {showTickets && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">My Tickets</h3>
              <button
                onClick={() => setShowTickets(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              {userTickets.map(ticket => (
                <div
                  key={ticket.TicketID}
                  className="border-2 border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h4 className="font-bold text-gray-900">{ticket.EventTitle}</h4>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <p className="text-gray-700">Type: <span className="font-semibold">{ticket.TicketType}</span></p>
                    <p className="text-gray-700">Price: <span className="font-semibold">${ticket.TicketPrice}</span></p>
                    <p className="text-gray-700">Status: <span className="font-semibold">{ticket.TicketStatus}</span></p>
                    <p className="text-gray-700">Issued: <span className="font-semibold">
                      {new Date(ticket.TicketIssueDate).toLocaleDateString()}
                    </span></p>
                  </div>
                </div>
              ))}
              {userTickets.length === 0 && (
                <p className="text-center text-gray-500 py-4">No tickets found</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">{selectedEvent.EventTitle}</h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700">{selectedEvent.EventDescription}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-900 font-semibold">Date</p>
                  <p className="text-gray-700">
                    {new Date(selectedEvent.StartDate).toLocaleDateString()} - 
                    {new Date(selectedEvent.EndDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-900 font-semibold">Venue</p>
                  <p className="text-gray-700">{selectedEvent.VenueName}</p>
                </div>
                <div>
                  <p className="text-gray-900 font-semibold">Category</p>
                  <p className="text-gray-700">{selectedEvent.CategoryName}</p>
                </div>
                <div>
                  <p className="text-gray-900 font-semibold">Capacity</p>
                  <p className="text-gray-700">
                    {selectedEvent.registered} / {selectedEvent.VenueCapacity} registered
                  </p>
                </div>
              </div>
              {userRole === 'attendee' && (
                <button
                  onClick={() => {
                    handleRegister(selectedEvent.EventID)
                    setSelectedEvent(null)
                  }}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 
                           transition-colors font-semibold disabled:bg-gray-400 mt-4"
                  disabled={selectedEvent.registered >= selectedEvent.VenueCapacity}
                >
                  {selectedEvent.registered >= selectedEvent.VenueCapacity ? 'Event Full' : 'Register Now'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Event Cards Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center text-gray-700 py-8 font-medium">No events found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.EventID}
              className="bg-white rounded-lg shadow-md border-2 border-gray-300 p-6 hover:shadow-lg 
                       transition-shadow"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">{event.EventTitle}</h3>
              <p className="text-gray-700 font-medium mb-4">{event.EventDescription}</p>
              
              <div className="space-y-3 text-sm text-gray-800 font-medium">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-700" />
                  <span>{new Date(event.StartDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-700" />
                  <span>{event.VenueName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-700" />
                  <span>
                    {event.registered} / {event.VenueCapacity} registered
                  </span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleViewDetails(event)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-2 rounded-lg 
                           hover:bg-gray-50 transition-colors font-semibold"
                >
                  View Details
                </button>

                {userRole === 'attendee' && (
                  <button
                    onClick={() => handleRegister(event.EventID)}
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 
                             transition-colors font-semibold disabled:bg-gray-400"
                    disabled={event.registered >= event.VenueCapacity}
                  >
                    {event.registered >= event.VenueCapacity ? 'Full' : 'Register'}
                  </button>
                )}
                
                {(userRole === 'organizer' || userRole === 'admin') && (
                  <>
                    <button
                      onClick={() => onEdit && onEdit(event.EventID)}
                      className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 
                               transition-colors font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleCancelEvent(event.EventID)}
                      className="flex-1 border-2 border-red-500 text-red-600 py-2 rounded-lg 
                               hover:bg-red-50 transition-colors font-semibold"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}