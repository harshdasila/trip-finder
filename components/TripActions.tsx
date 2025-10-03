import React from 'react'

const TripActions = ({ hasRequested, cancelTripRequest, tripId, requestToJoinTrip }: { hasRequested: any, cancelTripRequest: any, tripId: any , requestToJoinTrip: any}) => {
  return (
    <>
      {hasRequested === true && (
        <div>
          <div className="mt-auto pt-3">
            <button
              onClick={() => cancelTripRequest(tripId)}
              className="w-full bg-red-400 hover:bg-red-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors duration-200 cursor-pointer"
            >
              Cancel Trip Request
            </button>
          </div>
        </div>
      )}
      {hasRequested === false && (
          <div className="mt-auto pt-3">
            <button
              onClick={() => requestToJoinTrip()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors duration-200 cursor-pointer"
            >
              Request to Join Trip
            </button>
          </div>
        )}
    </>
  )
}

export default TripActions
