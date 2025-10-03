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
export interface UserOnRequestInterface {
  user_email: string,
  user_name: string,
  user_image: string | null
}

export interface TripRequestInterface {
  status: RequestType;
  request_message: string | null;
  request_created_at: Date;
  request_id: string;
  request_updated_at: Date;
  request_user_id: string;
  trip_id: string;
  user: UserOnRequestInterface
}

export type RequestType = "PENDING" | "ACCEPTED" | "REJECTED";