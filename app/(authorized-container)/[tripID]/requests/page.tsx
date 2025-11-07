import { ifTripExistAction } from "@/actions/trip.action";
import TripRequest from "@/components/TripRequest";
import { notFound } from "next/navigation";
import { Users, Clock, Inbox } from "lucide-react";
import { getTripRequests } from "@/actions/request.action";
import TripRequestsStats from "@/components/TripRequestsStats";
import Header from "@/components/Header";

const Page = async ({ params }: { params: Promise<{ tripID: string }> }) => {
  const { tripID } = await params;

  const response = await ifTripExistAction(tripID);

  if (!response) {
    notFound();
  }

  const tripRequests = await getTripRequests(tripID);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header title="Trip Requests" subtitle="Manage requests from travelers" showBackButton />
      <div className="max-w-6xl mx-auto px-2 py-5 sm:px-6 lg:px-8">
        {/* Header Section */}
        
        {/* <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Trip Requests</h1>
          </div>
          <p className="text-gray-600 ml-14">
            Manage and review requests from travelers interested in joining your trip
          </p>
        </div> */}

        {/* Stats Bar */}
        <TripRequestsStats initialRequests={tripRequests || []} />

        {/* Requests List or Empty State */}
        {tripRequests && tripRequests.length > 0 ? (
          <div className="space-y-4">
            {tripRequests.map((request) => (
              <TripRequest key={request.request_id} {...request} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-10 px-4">
            <div className="relative mb-8">
              {/* Decorative circles */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-blue-100 rounded-full animate-pulse"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-purple-100 rounded-full animate-pulse delay-75"></div>
              </div>
              
              {/* Main icon */}
              <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-8 shadow-lg">
                <Inbox className="w-16 h-16 text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No Requests Yet
            </h2>
            <p className="text-gray-600 text-center max-w-md mb-2">
              Your trip is live and waiting for adventurers! People will start sending requests soon.
            </p>
            <p className="text-sm text-gray-500 text-center max-w-md mb-8">
              In the meantime, make sure your trip details are complete and engaging to attract more travelers.
            </p>

            {/* Illustration/Animation area */}
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
              </div>
              <span>Waiting for travelers to discover your trip...</span>
            </div>

            {/* Tips Section */}
            <div className="mt-12 w-full max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Tips to Get More Requests
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-2xl">📸</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Add Description</h4>
                  <p className="text-sm text-gray-600">
                    Trips with Description get 3x more requests
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Complete Details</h4>
                  <p className="text-sm text-gray-600">
                    Add itinerary and activities information
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="bg-pink-100 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-2xl">💬</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Share Your Trip</h4>
                  <p className="text-sm text-gray-600">
                    Share with friends and social media
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;