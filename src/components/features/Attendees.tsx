// components/features/Attendees.tsx
'use client'

import { useEffect, useState } from 'react'
import { Users, UserPlus, UserMinus, Edit, Search, X } from 'lucide-react'

interface User {
  UserID: number
  UserFName: string
  UserLName: string
  UserEmail: string
  UserPhone: string
  UserRole: string
}

interface UserFormData {
  UserFName: string
  UserLName: string
  UserEmail: string
  UserPhone: string
  UserRole: string
  Password: string
}

export default function Attendees() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [formData, setFormData] = useState<UserFormData>({
    UserFName: '',
    UserLName: '',
    UserEmail: '',
    UserPhone: '',
    UserRole: 'Attendee',
    Password: ''
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    const filtered = users.filter(user => 
      user.UserFName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.UserLName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.UserEmail.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      if (data.success) {
        setUsers(data.users)
        setFilteredUsers(data.users)
      }
    } catch (error) {
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = selectedUser 
        ? `/api/users/${selectedUser.UserID}` 
        : '/api/users/create'
      const method = selectedUser ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        fetchUsers()
        setShowForm(false)
        setSelectedUser(null)
        setFormData({
          UserFName: '',
          UserLName: '',
          UserEmail: '',
          UserPhone: '',
          UserRole: 'Attendee',
          Password: ''
        })
      } else {
        setError(data.message || 'Failed to save user')
      }
    } catch (error) {
      setError('Failed to save user')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        fetchUsers()
      } else {
        setError(data.message || 'Failed to delete user')
      }
    } catch (error) {
      setError('Failed to delete user')
    }
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setFormData({
      UserFName: user.UserFName,
      UserLName: user.UserLName,
      UserEmail: user.UserEmail,
      UserPhone: user.UserPhone,
      UserRole: user.UserRole,
      Password: '' // Don't populate password for security
    })
    setShowForm(true)
  }

  if (loading) return (
    <div className="flex justify-center p-8">
      <div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
    </div>
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 
                   transition-colors flex items-center gap-2"
        >
          <UserPlus size={20} />
          Add User
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-3 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-600 p-4 rounded">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedUser ? 'Edit User' : 'Add User'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false)
                  setSelectedUser(null)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-lg"
                  value={formData.UserFName}
                  onChange={(e) => setFormData({ ...formData, UserFName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-lg"
                  value={formData.UserLName}
                  onChange={(e) => setFormData({ ...formData, UserLName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full p-2 border rounded-lg"
                  value={formData.UserEmail}
                  onChange={(e) => setFormData({ ...formData, UserEmail: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  className="w-full p-2 border rounded-lg"
                  value={formData.UserPhone}
                  onChange={(e) => setFormData({ ...formData, UserPhone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  required
                  className="w-full p-2 border rounded-lg"
                  value={formData.UserRole}
                  onChange={(e) => setFormData({ ...formData, UserRole: e.target.value })}
                >
                  <option value="Attendee">Attendee</option>
                  <option value="Organizer">Organizer</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {selectedUser && '(Leave blank to keep current)'}
                </label>
                <input
                  type="password"
                  required={!selectedUser}
                  className="w-full p-2 border rounded-lg"
                  value={formData.Password}
                  onChange={(e) => setFormData({ ...formData, Password: e.target.value })}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 
                           disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save User'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setSelectedUser(null)
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg 
                           hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user.UserID}
            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {user.UserFName} {user.UserLName}
                </h3>
                <p className="text-gray-600 mt-1">
                  {user.UserEmail}
                </p>
                <div className="mt-2 flex gap-2">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {user.UserRole}
                  </span>
                  {user.UserPhone && (
                    <span className="text-sm text-gray-500">
                      {user.UserPhone}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(user.UserID)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <UserMinus size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}