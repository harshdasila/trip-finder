"use client"
import { Clock } from 'lucide-react'
import { useState, useEffect } from 'react'

interface TripRequestsStatsProps {
  initialRequests: any[]
}

export default function TripRequestsStats({ initialRequests }: TripRequestsStatsProps) {
  const [requests, setRequests] = useState(initialRequests)

  const updateRequestStatus = (requestId: string, newStatus: string) => {
    setRequests(prev => 
      prev.map(req => 
        req.request_id === requestId 
          ? { ...req, status: newStatus }
          : req
      )
    )
  }

  // Expose this function globally so TripRequest can call it
  useEffect(() => {
    // Store the update function in window object
    (window as any).updateTripRequestStats = updateRequestStatus
    
    return () => {
      delete (window as any).updateTripRequestStats
    }
  }, [])

  const pendingCount = requests.filter(r => r.status === 'PENDING').length
  const acceptedCount = requests.filter(r => r.status === 'ACCEPTED').length
  const rejectedCount = requests.filter(r => r.status === 'REJECTED').length

  if (requests.length === 0) return null

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span className="text-sm text-gray-600">
              {pendingCount} Pending
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-sm text-gray-600">
              {acceptedCount} Accepted
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <span className="text-sm text-gray-600">
              {rejectedCount} Rejected
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Clock className="w-4 h-4" />
          <span className="text-sm">Total: {requests.length} requests</span>
        </div>
      </div>
    </div>
  )
}