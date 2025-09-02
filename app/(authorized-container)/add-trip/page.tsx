"use client";
import ErrorMessage from "@/components/ErrorMessage";
import GooglePlacesAutocomplete from "@/components/GooglePlacesAutocomplete";
import Input from "@/components/Input";
import {  } from "@/interfaces/auth.interface";
import { AddTripType, AllTripCompleteType } from "@/interfaces/trip.interface";
import { addTripSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const page = () => {
   const { data: session, status } = useSession();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddTripType>({
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
  const [selectedLocation, setSelectedLocation] = useState("delhi");
  const [selectedStartingLocation, setSelectedStartingLocation] =
    useState("udaipur");

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("title", data?.title);
    formData.append("maxPeople", data.maxBudget);
    formData.append("description", data.description!);
    formData.append("tripLocation", selectedLocation);
    formData.append("locationLat", coordinates.latitude);
    formData.append("locationLon", coordinates.longitude);
    formData.append("startLocation", selectedStartingLocation);
    formData.append("startLocationLat", startCoordinates.latitude);
    formData.append("startLocationLon", startCoordinates.longitude);
    formData.append("minBudget",data.minBudget);
    formData.append("maxBudget", data.maxBudget);
    formData.append("ownerId", session?.user?.id!)
    const plainObj = Object.fromEntries(formData.entries());
    console.log("Form Data as Object:", plainObj);
    reset();
  };
  console.log(errors, "errors");

  return (
    <div className="main-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-containers">
          <div className="mb-2">
            <Input
              label="Title"
              placeholder="Enter your trip title."
              type="text"
              name="title"
              register={register}
              required={false}
            />
            {errors.title && (
              <ErrorMessage text={errors.title.message || null} />
            )}
          </div>
          <div className="">
            <h1 className="mb-4 text-white">Trip Destination</h1>
            <GooglePlacesAutocomplete
              apiKey={MAPS_API_KEY!}
              setCoordinates={setCoordinates}
              setSelectedLocation={setSelectedLocation}
              placeholder="Search for a location..."
              className="mb-4 text-white"
            />
            {/* {errors.tripLocation && (
              <ErrorMessage text={errors.tripLocation.message || null} />
            )} */}
          </div>
          <div className="">
            <h1 className="mb-4 text-white">Trip Starting Location</h1>
            <GooglePlacesAutocomplete
              apiKey={MAPS_API_KEY!}
              setCoordinates={setStartCoordinates}
              setSelectedLocation={setSelectedStartingLocation}
              placeholder="Search for a location..."
              className="mb-4 text-white"
            />
            {/* {errors.startLocation && (
              <ErrorMessage text={errors.startLocation.message || null} />
            )} */}
          </div>
          <div className="mb-2">
            <Input
              label="Maximum People"
              placeholder="Max People required."
              type="number"
              name="maxPeople"
              register={register}
              required={true}
            />
            {errors.maxPeople && (
              <ErrorMessage text={errors.maxPeople.message || null} />
            )}
          </div>
          <div className="mb-2">
            <Input
              label="Description"
              placeholder="Enter your trip description."
              type="text"
              name="description"
              register={register}
              required={true}
            />
            {errors.description && (
              <ErrorMessage text={errors.description.message || null} />
            )}
          </div>
          <div className="mb-2">
            <Input
              label="Min Budget"
              placeholder="Enter your min budget"
              type="text"
              name="minBudget"
              register={register}
              required={true}
            />
            {errors.minBudget && (
              <ErrorMessage text={errors.minBudget.message || null} />
            )}
          </div>
          <div className="mb-2">
            <Input
              label="Max Budget"
              placeholder="Enter your max budget"
              type="text"
              name="maxBudget"
              register={register}
              required={true}
            />
            {errors.maxBudget && (
              <ErrorMessage text={errors.maxBudget.message || null} />
            )}
          </div>
        </div>
        <button className="font-medium" type="submit">
          Add Trip
        </button>
      </form>
    </div>
  );
};

export default page;
