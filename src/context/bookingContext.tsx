"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";

// Types
import type { FlightOffer } from "@/utils/types";

type BookingContextType = {
  selectedFlight: FlightOffer[] | null;
  setSelectedFlight: Dispatch<SetStateAction<FlightOffer[] | null>>;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

type BookingProviderProps = {
  children: ReactNode;
};

export const BookingProvider = ({ children }: BookingProviderProps) => {
  const [selectedFlight, setSelectedFlight] = useState<FlightOffer[] | null>(
    null
  );

  return (
    <BookingContext.Provider value={{ selectedFlight, setSelectedFlight }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within BookingProvider");
  }
  return context;
};
