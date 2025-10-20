import { getMyTrips } from "@/actions/trip.action";
import Header from "@/components/Header";
import TripCard from "@/components/TripCard";
import React from "react";

const page = async () => {
  const trips = await getMyTrips();
  console.log(trips, "tripssss");
  return (
    <div>
      <Header
        title="My Trips"
        subtitle="View and manage your trips"
        showBackButton
        backUrl="/trips"
        gradient="purple"
      />
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
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
