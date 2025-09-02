import { addTripSchema } from "@/schema";
import z from "zod";

export interface PlaceResult {
  place_id: string;
  description: string;
  coordinates?: any
}

export interface GooglePlacesAutocompleteProps {
  apiKey: string;
  setCoordinates?: any
  setSelectedLocation: any
  placeholder?: string;
  className?: string;
}

export type AddTripType = z.infer<typeof addTripSchema>

export type AllTripCompleteType = AddTripType & {
  tripLocation: String,
  locationLat: String
  locationLon: String
  startLocation: String
  startLocationLat: String
  startLocationLon: String
};
