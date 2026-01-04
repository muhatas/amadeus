export type FlightOffer = {
  id?: string;
  price: {
    grandTotal: string;
    currency: string;
  };
  itineraries: Array<{
    duration: string;
    segments: Array<{
      carrierCode: string;
      duration: string;
      departure: { iataCode: string; at: string };
      arrival: { iataCode: string; at: string };
    }>;
  }>;
  travelerPricings: Array<{
    travelerId: string;
    travelerType: "ADULT" | "CHILD" | "HELD_INFANT" | string;
    fareDetailsBySegment: Array<{
      amenities: Array<{
        description: string;
      }>;
    }>;
  }>;
};

export type PricingResponse = {
  data: {
    flightOffers: FlightOffer[];
  };
};

export type SidebarProps = {
  flightSummary?: FlightOffer[];
};

export type SelectedFiltersState = {
  selectedAirports: string[];
  selectedAirlines: string[];
  selectedStops: string[];
};
