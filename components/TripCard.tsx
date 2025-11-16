"use client";
import Image from "next/image";
import React from "react";
import tripImage from "../public/assets/BANNER.jpg";
import "../app/globals.css";
import {
  cancelRequestTripAction,
  requestToJoinTripAction,
} from "@/actions/trip.action";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import TripActions from "./TripActions";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TripCard = ({ trip, getTrips, type }: any) => {
  const router = useRouter();
  const {
    trip_id,
    trip_title,
    trip_description,
    trip_starting_location,
    trip_start_date,
    trip_end_date,
    trip_min_budget,
    trip_max_budget,
    trip_max_people,
    chat_room_id,
    trip_location,
    gendertrip,
  } = trip;
  const formattedStartDate = new Date(trip_start_date).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );
  const formattedEndDate = new Date(trip_end_date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const { data: session, status } = useSession();

  const requestToJoinTrip = async () => {
    try {
      // if (status === "loading") {
      //   return;
      // }
      if (status === "unauthenticated") {
        toast.info("Login to join exciting trips.");
        router.push("/login");
      }
      const result = await Swal.fire({
        input: "textarea",
        inputLabel: "Message",
        inputPlaceholder: "Type your message here...",
        inputAttributes: {
          "aria-label": "Type your message here",
        },
        showCancelButton: true,
        confirmButtonText: "Submit",
        cancelButtonText: "Cancel",
        reverseButtons: true, // This puts Cancel on left, Submit on right
        confirmButtonColor: "#4CAF50", // Optional: green color for submit
        cancelButtonColor: "#f44336", // Optional: red color for cancel
      });

      if (result.isConfirmed) {
        const response = await requestToJoinTripAction(
          session?.user?.id,
          trip_id,
          result?.value
        );
        if (response) {
          toast.success("Request submitted successfully.");
        }
        await getTrips();
      } else if (result.isDismissed) {
        // Add your cancel logic here
      }
    } catch (error) {
      console.error("Error in joining trip", error);
    }
  };

  const cancelTripRequest = async (tripId: any) => {
    try {
      const result = await cancelRequestTripAction(session?.user?.id, tripId);
      if (result) {
        toast.success("Request deleted successfully.");
        await getTrips();
      }
    } catch (error) {
      console.error("Error in deleting trip request", error);
    }
  };

  // Calculate difference in days
  const diffMs = trip_end_date.getTime() - trip_start_date.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return (
    <div className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <div className="aspect-[4/3] bg-gray-200">
          <Image
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            src={tripImage}
            alt={trip_title}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">
            {trip_title}
          </h3>
        </div>

        {/* Trip Features */}
        <div className="space-y-2 mb-4 flex-1">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-4 h-4 flex items-center justify-center">📍</span>
            <span>Trip Location: {trip_location}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-4 h-4 flex items-center justify-center">👥</span>
            <span>1 - {trip_max_people} People</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-4 h-4 flex items-center justify-center">📍</span>
            <span>From: {trip_starting_location}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-4 h-4 flex items-center justify-center">📅</span>
            <span>
              {formattedStartDate} - {formattedEndDate}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-4 h-4 flex items-center justify-center">💰</span>
            <span>
              Budget: ₹{trip_min_budget.toLocaleString()} - ₹
              {trip_max_budget.toLocaleString()}
            </span>
          </div>

          <p className="text-sm text-gray-600 mt-2">{trip_description}</p>
        </div>
        {type === "generalHomePage" && (
          <TripActions
            cancelTripRequest={cancelTripRequest}
            hasRequested={trip?.has_requested}
            requestStatus={trip?.request_status}
            requestToJoinTrip={requestToJoinTrip}
            tripId={trip?.trip_id}
            genderSpecific={gendertrip}
            tripStartDate={trip_start_date}
            tripEndDate={trip_end_date}
          />
        )}
        {type === "myTrips" && (
          <div className="mt-4">
            <Link
              href={`/${trip_id}/requests`}
              prefetch={true}
              className="block w-full text-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              View Requests
            </Link>
          </div>
        )}
        {type === "acceptedTrips" && (
          <div className="mt-4">
            <Link
              href={`/chat/${chat_room_id}`}
              className="block w-full text-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Chat
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripCard;
