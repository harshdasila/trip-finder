'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { GooglePlacesAutocompleteProps, PlaceResult } from '@/interfaces/trip.interface';

export default function GooglePlacesAutocomplete({
  apiKey,
  setCoordinates,
  setSelectedLocation,
  placeholder = "Enter a location...",
  className = ""
}: GooglePlacesAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounced search function
  const searchPlaces = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.get(`/api/places/autocomplete`, {
        params: { input: searchQuery }
      });
      const data = await response.data;
      
      if (data.status === 'OK') {
        const results: PlaceResult[] = data.predictions.map((prediction: any) => ({
          place_id: prediction.place_id,
          description: prediction.description,
        }));
        
        setSuggestions(results);
        setShowSuggestions(true);
        setSelectedIndex(-1);
      } else {
        console.error('Places API error:', data.status);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error fetching places:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Get place details including coordinates
  const getPlaceDetails = async (placeId: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      const response = await axios.get(`/api/places/details`, {
        params: { place_id: placeId }
      });
      
      const data = response.data;
      
      if (data.status === 'OK' && data.result.geometry) {
        return {
          lat: data.result.geometry.location.lat,
          lng: data.result.geometry.location.lng,
        };
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
    
    return null;
  };

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer
    debounceTimer.current = setTimeout(() => {
      searchPlaces(value);
    }, 300);
  };

  // Handle place selection
  const handlePlaceSelect = async (place: PlaceResult, index: number) => {
    setQuery(place.description);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    
    // Get coordinates for the selected place
    const coordinates: any = await getPlaceDetails(place.place_id);
    
    const selectedPlace: PlaceResult = {
      ...place,
      coordinates,
    };
    setSelectedLocation(selectedPlace?.description);
    console.log("selected palce",selectedPlace)
    setCoordinates({
      latitude: coordinates?.lat,
      longitude: coordinates?.lng
    })
    // if (onPlaceSelect) {
    //   onPlaceSelect(selectedPlace);
    // }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handlePlaceSelect(suggestions[selectedIndex], selectedIndex);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <div className={`relative w-full max-w-md ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholder}
          className="text-white flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:border-white border-[#ccc]"
        />
        
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((place, index) => (
            <div
              key={place.place_id}
              onClick={() => handlePlaceSelect(place, index)}
              className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                index === selectedIndex ? 'bg-blue-100' : ''
              } ${index === suggestions.length - 1 ? '' : 'border-b border-gray-100'}`}
            >
              <div className="text-sm text-gray-800">{place.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}