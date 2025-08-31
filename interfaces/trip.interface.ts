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