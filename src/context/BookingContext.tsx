import { createContext, useContext, useState, ReactNode } from 'react';
import type { PlaceSelection, SearchResult, SearchSummary } from '../lib/api';
import { VehicleType } from '../lib/price';

export interface SearchParams {
  from: PlaceSelection;
  to: PlaceSelection;
  datetime: string;
  roundTrip: boolean;
  returnDatetime?: string;
  passengers: number;
}

export interface SelectedVehicle extends SearchResult {
  type: VehicleType;
  imageUrl?: string;
  priceOptions?: { currency: string; amount: number }[];
}

interface BookingContextType {
  searchParams: SearchParams | null;
  searchResults: SearchResult[] | null;
  searchSummary: SearchSummary | null;
  bookingReference: string | null;
  selectedVehicle: SelectedVehicle | null;
  setSearchParams: (params: SearchParams) => void;
  setSearchResults: (results: SearchResult[] | null) => void;
  setSearchSummary: (summary: SearchSummary | null) => void;
  setSelectedVehicle: (vehicle: SelectedVehicle | null) => void;
  setBookingReference: (value: string | null) => void;
  clearBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);
  const [searchSummary, setSearchSummary] = useState<SearchSummary | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<SelectedVehicle | null>(null);
  const [bookingReference, setBookingReference] = useState<string | null>(null);

  const clearBooking = () => {
    setSearchParams(null);
    setSearchResults(null);
    setSearchSummary(null);
    setSelectedVehicle(null);
    setBookingReference(null);
  };

  return (
    <BookingContext.Provider
      value={{
        searchParams,
        searchResults,
        searchSummary,
        bookingReference,
        selectedVehicle,
        setSearchParams,
        setSearchResults,
        setSearchSummary,
        setSelectedVehicle,
        setBookingReference,
        clearBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
}
