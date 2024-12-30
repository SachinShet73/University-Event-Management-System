'use client'

import { useEffect, useState } from 'react'
import { 
    Calendar, 
    Users, 
    DollarSign,
    Clock,
    MapPin,
    UserCheck
} from 'lucide-react'

interface DashboardStats {
    totalEvents: number
    totalUsers: number
    totalRevenue: number
    upcomingEvents: number
    totalVenues: number
    activeRegistrations: number
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/stats')
            const data = await response.json()
            
            if (data.success) {
                setStats(data.stats)
            } else {
                setError(data.error || 'Failed to load statistics')
            }
        } catch (error) {
            setError('Failed to load dashboard statistics')
            console.error('Dashboard stats error:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700">{error}</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Events */}
                <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Calendar className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Events</p>
                            <p className="text-2xl font-bold text-gray-900">{stats?.totalEvents || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Total Users */}
                <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <Users className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Total Revenue */}
                <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <DollarSign className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">
                                ${(stats?.totalRevenue || 0).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <Clock className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Upcoming Events</p>
                            <p className="text-2xl font-bold text-gray-900">{stats?.upcomingEvents || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Total Venues */}
                <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-red-100 rounded-lg">
                            <MapPin className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Venues</p>
                            <p className="text-2xl font-bold text-gray-900">{stats?.totalVenues || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Active Registrations */}
                <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-100 rounded-lg">
                            <UserCheck className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Active Registrations</p>
                            <p className="text-2xl font-bold text-gray-900">{stats?.activeRegistrations || 0}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}