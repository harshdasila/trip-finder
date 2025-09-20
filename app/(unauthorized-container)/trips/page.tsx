"use client"
import { getAllTripsNearby } from "@/actions/trip.action";
import React, { useEffect, useState } from "react";

const page = () => {
    const [trips, setTrips] = useState<any>([]);
  const getTrips = async () => {
    const location = JSON.parse(localStorage.getItem("userLocation") || "");
    const trips = await getAllTripsNearby(location.lat, location.lon);
    setTrips(trips);
    console.log(trips,'tripss')
  };

  useEffect(() => {
    getTrips();
  }, []);

  return <div>
    {"HELLO"}
  </div>;
};

export default page;
