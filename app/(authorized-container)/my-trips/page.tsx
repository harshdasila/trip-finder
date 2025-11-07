import { getMyTrips } from "@/actions/trip.action";
import Header from "@/components/Header";
import TripCard from "@/components/TripCard";
import { MapPin, Plus } from "lucide-react";
import Link from "next/link";
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
          {trips && trips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {trips.map((trip: any) => (
                <TripCard
                  key={trip.trip_id}
                  trip={trip}
                  getTrips={getMyTrips}
                  type="myTrips"
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center max-w-md">
                <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-full p-12 w-40 h-40 mx-auto mb-6 flex items-center justify-center">
                  <MapPin className="w-20 h-20 text-purple-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  No Trips Posted Yet
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  You haven't created any trips yet. Start planning your next
                  adventure and find travel companions!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/add-trip"
                    className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-sm"
                  >
                    <Plus className="w-5 h-5" />
                    Create Your First Trip
                  </Link>
                  <Link
                    href="/trips"
                    className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium px-6 py-3 rounded-lg transition-colors shadow-sm border border-gray-300"
                  >
                    Explore Other Trips
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;