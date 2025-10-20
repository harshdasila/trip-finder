"use client";
import { addTrip } from "@/actions/trip.action";
import ErrorMessage from "@/components/ErrorMessage";
import GooglePlacesAutocomplete from "@/components/GooglePlacesAutocomplete";
import Input from "@/components/Input";
import Header from "@/components/Header";
import { addTripSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  MapPin,
  Users,
  DollarSign,
  Calendar,
  FileText,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addTripSchema),
  });

  const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const [coordinates, setCoordinates] = useState({
    latitude: "14",
    longitude: "24",
  });
  const [startCoordinates, setStartCoordinates] = useState({
    latitude: "421",
    longitude: "411",
  });
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedStartingLocation, setSelectedStartingLocation] = useState("");

  const validateFeilds = () => {
    if (
      !selectedLocation ||
      !coordinates.latitude ||
      !coordinates.longitude ||
      !startCoordinates.latitude ||
      !startCoordinates.longitude ||
      !startDate ||
      !endDate
    ) {
      return 0;
    }
    return 1;
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const isFormFilled = validateFeilds();
      if (!isFormFilled) {
        toast.warning("Please fill all mandatory fields first!");
        return;
      }
      const formData = new FormData();
      formData.append("title", data?.title);
      formData.append("maxPeople", data.maxPeople);
      formData.append("description", data.description!);
      formData.append("tripLocation", selectedLocation);
      formData.append("locationLat", coordinates.latitude);
      formData.append("locationLon", coordinates.longitude);
      formData.append("startLocation", selectedStartingLocation);
      formData.append("startLocationLat", startCoordinates.latitude);
      formData.append("startLocationLon", startCoordinates.longitude);
      formData.append("minBudget", data.minBudget);
      formData.append("maxBudget", data.maxBudget);
      formData.append("ownerId", session?.user?.id!);
      formData.append("startDate", startDate ? startDate.toISOString() : "");
      formData.append("endDate", endDate ? endDate.toISOString() : "");

      const response = await addTrip(formData);
      console.log(response,'response')
      if (response) {
        console.log("ONSIDE RES")
        setSubmitSuccess(true);
        reset();
        setDateRange([null, null]);
        setSelectedLocation("");
        setSelectedStartingLocation("");
        setStartCoordinates({
          latitude: "",
          longitude: "",
        });
        toast.success("Trip created successfully.");
        setTimeout(() => setSubmitSuccess(false), 3000);
        router.push('/my-trips');
      }
    } catch (error) {
      console.error("Error creating trip:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header
        title="Create New Trip"
        subtitle="Share your adventure and find travel companions"
        showBackButton
        gradient="blue"
      />

      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 bg-green-900 border border-green-700 rounded-lg p-4 flex items-center gap-3">
            <div className="bg-green-500 rounded-full p-1">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p className="text-green-100 font-medium">
                Trip created successfully!
              </p>
              <p className="text-green-300 text-sm">
                Your trip is now live and visible to other travelers.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information Card */}
          <div className="bg-black rounded-lg shadow-sm border border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">
                Basic Information
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <Input
                  label="Trip Title"
                  placeholder="e.g., Weekend Trek to Manali"
                  type="text"
                  name="title"
                  register={register}
                  required={false}
                />
                {errors.title && (
                  <ErrorMessage text={errors.title.message || null} />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  placeholder="Describe your trip, activities, and what travelers can expect..."
                  className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-400"
                />
                {errors.description && (
                  <ErrorMessage text={errors.description.message || null} />
                )}
              </div>
            </div>
          </div>

          {/* Location Details Card */}
          <div className="bg-black rounded-lg shadow-sm border border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">
                Location Details
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Trip Destination <span className="text-red-500">*</span>
                </label>
                <GooglePlacesAutocomplete
                  apiKey={MAPS_API_KEY!}
                  setCoordinates={setCoordinates}
                  setSelectedLocation={setSelectedLocation}
                  placeholder="Where are you going? (e.g., Goa, Manali)"
                  className=""
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Starting Location <span className="text-red-500">*</span>
                </label>
                <GooglePlacesAutocomplete
                  apiKey={MAPS_API_KEY!}
                  setCoordinates={setStartCoordinates}
                  setSelectedLocation={setSelectedStartingLocation}
                  placeholder="Where will you start from? (e.g., Delhi, Mumbai)"
                  className=""
                />
              </div>
            </div>
          </div>

          {/* Trip Details Card */}
          <div className="bg-black rounded-lg shadow-sm border border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Trip Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Maximum People"
                  placeholder="e.g., 5"
                  type="number"
                  name="maxPeople"
                  register={register}
                  required={true}
                />
                {errors.maxPeople && (
                  <ErrorMessage text={errors.maxPeople.message || null} />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Travel Dates <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-5 text-gray-400 pointer-events-none z-10" />
                  <DatePicker
                    selectsRange
                    minDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => {
                      setDateRange(update as [Date | null, Date | null]);
                    }}
                    isClearable
                    placeholderText="Select start and end date"
                    className="w-full pl-10 pr-4 py-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Budget Card */}
          <div className="bg-black rounded-lg shadow-sm border border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">
                Budget Range (per person)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Minimum Budget (₹)"
                  placeholder="e.g., 5000"
                  type="number"
                  name="minBudget"
                  register={register}
                  required={true}
                />
                {errors.minBudget && (
                  <ErrorMessage text={errors.minBudget.message || null} />
                )}
              </div>

              <div>
                <Input
                  label="Maximum Budget (₹)"
                  placeholder="e.g., 10000"
                  type="number"
                  name="maxBudget"
                  register={register}
                  required={true}
                />
                {errors.maxBudget && (
                  <ErrorMessage text={errors.maxBudget.message || null} />
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Trip...
                </>
              ) : (
                <>Create Trip</>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                reset();
                setDateRange([null, null]);
                setSelectedLocation("");
                setSelectedStartingLocation("");
              }}
              className="px-6 py-3 border border-gray-600 text-gray-300 font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
