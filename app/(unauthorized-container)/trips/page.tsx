"use client";
import { commonSearchAction, getAllTripsNearby } from "@/actions/trip.action";
import TripCard from "@/components/TripCard";
import { getSession, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import {
  MapPin,
  Compass,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Calendar,
  Plus,
} from "lucide-react";
import Header from "@/components/Header";
import { Search, X } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { redirect } from "next/navigation";
import SelectGenderModal from "@/components/SelectGenderModal";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [showGenderModal, setShowGenderModal] = useState(false);
  const { data: session, status }: any = useSession();
  // if(session?.user?.gender === "Other"){
  //   setShowGenderModal(true);
  // }
  const [trips, setTrips] = useState<any>([]);
  const [acceptedTrips, setAcceptedTrips] = useState<any>([]);
  const [tripsToShow, setTripsToShow] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"discover" | "accepted">(
    "discover"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const getTrips = async () => {
    try {
      setLoading(true);
      const session = await getSession();
      const location = JSON.parse(localStorage.getItem("userLocation") || "{}");
      const trip = await getAllTripsNearby(
        location.lat,
        location.lon,
        session?.user?.id
      );
      console.log(trip);
      const tripsNotAccepted = trip?.filter(
        (trip) => trip?.request_status !== "ACCEPTED"
      );
      const tripsAccepted = trip?.filter(
        (trip) =>
          trip?.trip_owner_id === session?.user?.id ||
          trip?.request_status === "ACCEPTED"
      );
      setTrips(tripsNotAccepted || []);
      let otherUsersTrips = filterTripsToShow(trip, session);
      setTripsToShow(otherUsersTrips);
      setAcceptedTrips(tripsAccepted || []);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterTripsToShow = (t: any, session: any) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    if (!session?.user?.id) return t;
    return t.filter(
      (trip: any) =>
        trip.trip_owner_id !== session.user.id &&
        trip.request_status !== "ACCEPTED" &&
        new Date(trip?.trip_end_date) >= currentDate
    );
  };

  const handleAuthCheckAndRedirect = (url: string) => {
    if(status === "unauthenticated"){
            toast.info("Login to join exciting trips.")
            router.push("/login")
          }
    else{
      router.push(url);
    }
  }

  const handleSearch = async () => {
    const query = searchQuery.trim();
    const response = await commonSearchAction(query, session?.user?.id || "");
    const filteredTrips = filterTripsToShow(response, session);
    setTripsToShow(filteredTrips);
  };

  useEffect(() => {
    getTrips();
  }, []);
  useEffect(() => {
    if (session?.user?.gender === "Other") {
      setShowGenderModal(true);
    }
  }, [session?.user?.gender]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing trips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      {showGenderModal && <SelectGenderModal />}
      <Header
        title="Explore Trips"
        subtitle="Discover and join trips near you"
        gradient="blue"
        rightContent={
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
            {" "}
            <MapPin className="w-4 h-4 text-white" />{" "}
            <span className="text-sm text-white font-medium">Near You</span>{" "}
          </div>
        }
      />

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500">Available Trips</p>
                  <p className="text-lg font-bold text-gray-900">
                    {tripsToShow.length}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-xs text-gray-500">Your Trips</p>
                  <p className="text-lg font-bold text-gray-900">
                    {acceptedTrips.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            {activeTab === "discover" && (
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
              />
            )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <div className="flex items-center justify-between border-b border-gray-200 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab("discover")}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-all ${
                activeTab === "discover"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Discover Trips
              {tripsToShow.length > 0 && (
                <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-1 rounded-full">
                  {tripsToShow.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("accepted")}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-all ${
                activeTab === "accepted"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              My Trips
              {acceptedTrips.length > 0 && (
                <span className="bg-green-100 text-green-600 text-xs font-semibold px-2 py-1 rounded-full">
                  {acceptedTrips.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleAuthCheckAndRedirect("/my-trips")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              My Posted Trips
            </button>
            <button
              onClick={() => handleAuthCheckAndRedirect("/add-trip")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              Create Trip
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {activeTab === "discover" ? (
          <>
            {tripsToShow.length > 0 ? (
              <>
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-gray-600" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Popular Trips Near You
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {tripsToShow.map((trip: any) => (
                    <TripCard
                      key={trip.trip_id}
                      trip={trip}
                      getTrips={getTrips}
                      type="generalHomePage"
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                  <MapPin className="w-16 h-16 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No Trips Available
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  There are no trips available in your area right now. Check
                  back soon or create your own trip!
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            {acceptedTrips.length > 0 ? (
              <>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-green-900 mb-1">
                        Your Upcoming Adventures
                      </h3>
                      <p className="text-sm text-green-700">
                        You have {acceptedTrips.length} confirmed trip
                        {acceptedTrips.length > 1 ? "s" : ""}. Get ready for
                        amazing experiences!
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {acceptedTrips.map((trip: any) => (
                    <TripCard
                      key={trip.trip_id}
                      trip={trip}
                      getTrips={getTrips}
                      type="acceptedTrips"
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                  <Calendar className="w-16 h-16 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No Accepted Trips Yet
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  You haven't joined any trips yet. Browse available trips and
                  send requests to start your adventure!
                </p>
                <button
                  onClick={() => setActiveTab("discover")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                >
                  Explore Trips
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
