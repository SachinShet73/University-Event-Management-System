'use client'

import { useEffect, useState } from 'react'
import {  Edit, Trash2, Plus, Search, X } from 'lucide-react'

interface Venue {
  VenueID: number
  VenueTypeID: number
  VenueName: string
  VenueCapacity: number
  VenueLocation: string
  VenueTypeName: string // Added for display purposes
}

interface VenueType {
  VenueTypeID: number
  VenueTypeName: string
}

interface VenueFormData {
  VenueName: string
  VenueTypeID: string
  VenueCapacity: string
  VenueLocation: string
}

export default function Venues() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [venueTypes, setVenueTypes] = useState<VenueType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  const [formData, setFormData] = useState<VenueFormData>({
    VenueName: '',
    VenueTypeID: '',
    VenueCapacity: '',
    VenueLocation: ''
  })

  useEffect(() => {
    fetchVenues()
    fetchVenueTypes()
  }, [])

  const fetchVenues = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/venues')
      const data = await response.json()
      if (data.success) {
        setVenues(data.venues)
      } else {
        setError(data.error || 'Failed to load venues')
      }
    } catch (error) {
      setError('Failed to load venues')
      console.error('Error fetching venues:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchVenueTypes = async () => {
    try {
      const response = await fetch('/api/venue-types')
      const data = await response.json()
      if (data.success) {
        setVenueTypes(data.venueTypes)
      } else {
        setError(data.error || 'Failed to load venue types')
      }
    } catch (error) {
      setError('Failed to load venue types')
      console.error('Error fetching venue types:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = selectedVenue 
        ? `/api/venues/${selectedVenue.VenueID}` 
        : '/api/venues/create'
      const method = selectedVenue ? 'PUT' : 'POST'

      console.log('Submitting venue data:', formData)

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        await fetchVenues()
        setShowForm(false)
        setSelectedVenue(null)
        setFormData({
          VenueName: '',
          VenueTypeID: '',
          VenueCapacity: '',
          VenueLocation: ''
        })
      } else {
        setError(data.error || 'Failed to save venue')
      }
    } catch (error) {
      console.error('Error saving venue:', error)
      setError('Failed to save venue')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (venue: Venue) => {
    setSelectedVenue(venue)
    setFormData({
      VenueName: venue.VenueName,
      VenueTypeID: venue.VenueTypeID.toString(),
      VenueCapacity: venue.VenueCapacity.toString(),
      VenueLocation: venue.VenueLocation
    })
    setShowForm(true)
  }

  const handleDelete = async (venueId: number) => {
    if (!window.confirm('Are you sure you want to delete this venue?')) return

    try {
      const response = await fetch(`/api/venues/${venueId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        await fetchVenues()
      } else {
        setError(data.error || 'Failed to delete venue')
      }
    } catch (error) {
      setError('Failed to delete venue')
      console.error('Error deleting venue:', error)
    }
  }

  const filteredVenues = venues.filter(venue =>
    venue.VenueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venue.VenueLocation.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading && !venues.length) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Header with Search and Add Button */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search venues..."
            className="w-full pl-10 pr-3 py-2 border-2 border-gray-300 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => {
            setSelectedVenue(null)
            setFormData({
              VenueName: '',
              VenueTypeID: '',
              VenueCapacity: '',
              VenueLocation: ''
            })
            setShowForm(true)
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 
                   transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add Venue
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-600 p-4 rounded">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Venue Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedVenue ? 'Edit Venue' : 'Add Venue'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false)
                  setSelectedVenue(null)
                  setError('')
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Venue Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border-2 border-gray-300 rounded-lg"
                  value={formData.VenueName}
                  onChange={(e) => setFormData({ ...formData, VenueName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Venue Type
                </label>
                <select
                  required
                  className="w-full p-2 border-2 border-gray-300 rounded-lg"
                  value={formData.VenueTypeID}
                  onChange={(e) => setFormData({ ...formData, VenueTypeID: e.target.value })}
                >
                  <option value="">Select a venue type</option>
                  {venueTypes.map(type => (
                    <option key={type.VenueTypeID} value={type.VenueTypeID}>
                      {type.VenueTypeName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  className="w-full p-2 border-2 border-gray-300 rounded-lg"
                  value={formData.VenueCapacity}
                  onChange={(e) => setFormData({ ...formData, VenueCapacity: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border-2 border-gray-300 rounded-lg"
                  value={formData.VenueLocation}
                  onChange={(e) => setFormData({ ...formData, VenueLocation: e.target.value })}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 
                           transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Venue'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setSelectedVenue(null)
                    setError('')
                  }}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-2 rounded-lg 
                           hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Venues List */}
      <div className="grid gap-6">
        {filteredVenues.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No venues found</p>
        ) : (
          filteredVenues.map((venue) => (
            <div
              key={venue.VenueID}
              className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {venue.VenueName}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {venue.VenueLocation}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {venue.VenueTypeName}
                    </span>
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Capacity: {venue.VenueCapacity}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(venue)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(venue.VenueID)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}