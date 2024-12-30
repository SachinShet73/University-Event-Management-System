'use client'

import { useEffect, useState, useCallback } from 'react'
import { Calendar, MapPin, Users, Clock, Save, XCircle } from 'lucide-react'


interface Venue {
  VenueID: number
  VenueName: string
  VenueCapacity: number
}

interface Category {
  EventCategoryID: number
  CategoryName: string
}

interface EventFormProps {
  eventId?: number | null;
  onClose: () => void;
  onSave: () => void;
  userRole: string;
  organizerId: number;
}



export default function EventForm({ eventId, onClose, onSave, userRole, organizerId }: EventFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [venues, setVenues] = useState<Venue[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  const [formData, setFormData] = useState({
    EventTitle: '',
    EventDescription: '',
    StartDate: '',
    EndDate: '',
    VenueID: '',
    EventCategoryID: '',
    EventBudget: '',
    OrganizerID: organizerId.toString()
  })

  const fetchEventDetails = useCallback(async () => {
    if (!eventId) return
  
    try {
        console.log('Fetching event details for ID:', eventId)
        const response = await fetch(`/api/events/${eventId}`)
        const data = await response.json()
        console.log('Received event data:', data)
  
        if (data.success) {
            setFormData({
                EventTitle: data.event.EventTitle || '',
                EventDescription: data.event.EventDescription || '',
                StartDate: data.event.StartDate || '',
                EndDate: data.event.EndDate || '',
                VenueID: data.event.VenueID.toString() || '',
                EventCategoryID: data.event.EventCategoryID.toString() || '',
                EventBudget: data.event.EventBudget.toString() || '',
                OrganizerID: data.event.OrganizerID?.toString() || organizerId.toString()
            })
        }
    } catch (error) {
        console.error('Error fetching event details:', error)
        setError('Failed to load event details')
    }
  }, [eventId, organizerId]);
  
  const fetchVenues = useCallback(async () => {
    try {
        const response = await fetch('/api/venues')
        const data = await response.json()
        if (data.success) {
            setVenues(data.venues)
        }
    } catch (error) {
        setError('Failed to load venues')
    }
  }, []);
  
  const fetchCategories = useCallback(async () => {
    try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        if (data.success) {
            setCategories(data.categories)
        }
    } catch (error) {
        setError('Failed to load categories')
    }
  }, []);

// Add these two separate useEffect hooks instead of the single one

// Effect for loading venues and categories
useEffect(() => {
  fetchVenues();
  fetchCategories();
}, [fetchVenues, fetchCategories]);

// Effect for loading event details
useEffect(() => {
  if (eventId) {
      fetchEventDetails();
  }
}, [eventId, fetchEventDetails]);





  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = eventId ? `/api/events/${eventId}` : '/api/events/create'
      const method = eventId ? 'PUT' : 'POST'

      console.log('Submitting form data:', formData)

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      
      if (data.success) {
        onSave()
      } else {
        setError(data.message || 'Failed to save event')
      }
    } catch (error) {
      console.error('Error saving event:', error)
      setError('Failed to save event')
    } finally {
      setLoading(false)
    }
  }

  if (userRole !== 'organizer' && userRole !== 'admin') {
    return <div className="text-red-600 font-semibold text-lg">Access denied</div>
  }

  // Rest of your component JSX remains exactly the same...
  return (
    <div className="bg-white rounded-lg p-8 border-2 border-gray-300 shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          {eventId ? 'Edit Event' : 'Create Event'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-700 hover:text-gray-900 transition-colors"
        >
          <XCircle size={24} />
        </button>
      </div>

      {error && (
        <div className="mb-8 bg-red-50 border-l-4 border-red-600 p-4 rounded">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Event Title
          </label>
          <input
            type="text"
            required
            placeholder="Enter event title"
            className="w-full p-3 border-2 border-gray-400 rounded-lg text-gray-900
                     placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            value={formData.EventTitle}
            onChange={(e) => setFormData({ ...formData, EventTitle: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Description
          </label>
          <textarea
            required
            rows={4}
            placeholder="Enter event description"
            className="w-full p-3 border-2 border-gray-400 rounded-lg text-gray-900
                     placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            value={formData.EventDescription}
            onChange={(e) => setFormData({ ...formData, EventDescription: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Start Date
            </label>
            <input
              type="date"
              required
              className="w-full p-3 border-2 border-gray-400 rounded-lg text-gray-900
                       focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              value={formData.StartDate}
              onChange={(e) => setFormData({ ...formData, StartDate: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              End Date
            </label>
            <input
              type="date"
              required
              className="w-full p-3 border-2 border-gray-400 rounded-lg text-gray-900
                       focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              value={formData.EndDate}
              onChange={(e) => setFormData({ ...formData, EndDate: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Venue
            </label>
            <select
              required
              className="w-full p-3 border-2 border-gray-400 rounded-lg text-gray-900
                       focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              value={formData.VenueID}
              onChange={(e) => setFormData({ ...formData, VenueID: e.target.value })}
            >
              <option value="">Select a venue</option>
              {venues.map(venue => (
                <option key={venue.VenueID} value={venue.VenueID}>
                  {venue.VenueName} (Capacity: {venue.VenueCapacity})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Category
            </label>
            <select
              required
              className="w-full p-3 border-2 border-gray-400 rounded-lg text-gray-900
                       focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              value={formData.EventCategoryID}
              onChange={(e) => setFormData({ ...formData, EventCategoryID: e.target.value })}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.EventCategoryID} value={category.EventCategoryID}>
                  {category.CategoryName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Budget
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            placeholder="Enter event budget"
            className="w-full p-3 border-2 border-gray-400 rounded-lg text-gray-900
                     placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            value={formData.EventBudget}
            onChange={(e) => setFormData({ ...formData, EventBudget: e.target.value })}
          />
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 
                     transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Event'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border-2 border-gray-400 text-gray-700 py-3 rounded-lg 
                     hover:bg-gray-50 transition-colors font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}