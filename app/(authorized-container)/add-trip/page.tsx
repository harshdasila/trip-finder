"use client"
import GooglePlacesAutocomplete from "@/components/GooglePlacesAutocomplete";
import React, { useState } from "react";

const page = () => {
    const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    const [coordinates, setCoordinates] = useState({
        latitude: "",
        longitude: ""
    })

  return (
    <div>
      
      <div className="p-8">
        <h1 className="text-2xl mb-4">Location Search</h1>
        <GooglePlacesAutocomplete
          apiKey={MAPS_API_KEY!}
          setCoordinates={setCoordinates}
          placeholder="Search for a location..."
          className="mb-4"
        />
      </div>
    </div>
  );
};

export default page;
