"use client";
import { getAllTripsNearby } from "@/actions/trip.action";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import TripCard from "@/components/TripCard";
import { getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const page = () => {
  const [trips, setTrips] = useState<any>([]);
  const getTrips = async () => {
    const session = await getSession();
    const location = JSON.parse(localStorage.getItem("userLocation") || "");
    const trip = await getAllTripsNearby(location.lat, location.lon, session?.user?.id);
    console.log(trip, "trips");
    setTrips(trip);
  };

  useEffect(() => {
    getTrips();
  }, []);

  return (
    <div>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Popular Trips For You 
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {trips.map((trip: any) => (
              <TripCard key={trip.trip_id} trip={trip} getTrips={getTrips} type="generalHomePage" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
