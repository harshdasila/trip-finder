import { getMyTrips } from "@/actions/trip.action";
import TripCard from "@/components/TripCard";
import React from "react";

const page = async () => {
  const trips = await getMyTrips();
  console.log(trips, "tripssss");
  return (
    <div>
      <h2>My Trips</h2>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Popular Trips For You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {trips &&
              trips.length > 0 &&
              trips.map((trip: any) => (
                <TripCard
                  key={trip.trip_id}
                  trip={trip}
                  getTrips={getMyTrips}
                  type="myTrips"
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
