"use client";

import { createContext, useContext, useState } from "react";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [selectedFlight, setSelectedFlight] = useState(null);

  return (
    <BookingContext.Provider value={{ selectedFlight, setSelectedFlight }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);

  if (!context) router.back();

  return context;
};
