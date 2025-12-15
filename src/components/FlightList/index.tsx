"use client";
import { useEffect, useState, useMemo } from "react";
import classNames from "classnames";
import _ from "lodash";

// Components
import Filters from "@/components/FlightList/Filters";
import Flight from "@/components/FlightList/Flight";
import Loading from "@/components/Loading";

// Utils
import { ClientApi } from "@/utils/api";

// Styles
import Styles from "./styles.module.scss";

type FlightListContainerProps = {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  max?: number;
};

type DictionariesLocations = {
  cityCode: string;
  countryCode: string;
};

type FlightOffer = {
  id?: string;
  price: {
    grandTotal: string;
    currency: string;
  };
  itineraries: Array<{
    duration: string;
    segments: Array<{
      carrierCode: string;
      departure: { iataCode: string; at: string };
      arrival: { iataCode: string; at: string };
    }>;
  }>;
};

type FlightOffersResponse = {
  data: FlightOffer[];
  dictionaries?: {
    locations?: Record<string, DictionariesLocations>;
    carriers?: Record<string, string>;
  };
};

type FiltersState = {
  airlines: Array<{ code: string; name: string }>;
  airports: Array<{ code: string } & DictionariesLocations>;
  stops: number;
};

type SelectedFiltersState = {
  selectedAirlines: string[];
  selectedAirports: string[];
  selectedStops: number[];
};

type SortKey =
  | "recomended"
  | "departure-earliest"
  | "departure-latest"
  | "arrival-earliest"
  | "arrival-latest"
  | "price-lowest"
  | "price-highest";

export default function FlightListContainer({
  originLocationCode,
  destinationLocationCode,
  departureDate,
  returnDate,
  adults,
  children,
  infants,
  max,
}: FlightListContainerProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [flightList, setFlightList] = useState<FlightOffer[]>([]);
  const [filters, setFilters] = useState<FiltersState>({
    stops: 0,
    airports: [],
    airlines: [],
  });
  const [selectedFilters, setSelectedFilters] = useState<SelectedFiltersState>({
    selectedAirlines: [],
    selectedAirports: [],
    selectedStops: [],
  });
  const [isSelectLoading, setIsSelectLoading] = useState<boolean>(false);
  const [sort, setSorted] = useState<SortKey>("recomended");

  const getMaxSegments = (list: FlightOffer[] | undefined | null): number => {
    if (!list || list.length === 0) return 0;

    return Math.max(
      ...list.flatMap((flight) =>
        flight.itineraries.map((itin) => itin.segments.length)
      )
    );
  };

  const getFlights = async (): Promise<void> => {
    const payload: FlightListContainerProps = {
      originLocationCode,
      destinationLocationCode,
      departureDate,
      returnDate,
      adults,
      children,
      infants,
      max,
    };

    try {
      const response = await ClientApi.get<FlightOffersResponse>(
        "/v2/shopping/flight-offers",
        payload
      );

      const airports = _.map(
        response?.dictionaries?.locations,
        (value, key) => ({
          code: key,
          ...(value ?? {}),
        })
      );

      const airlines = _.map(
        response?.dictionaries?.carriers,
        (name, code) => ({
          code,
          name,
        })
      );

      setFlightList(response?.data);
      setFilters({
        stops: getMaxSegments(response?.data),
        airports: airports,
        airlines: airlines,
      });

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const filteredFlights = useMemo<FlightOffer[]>(() => {
    if (!flightList?.length) return [];

    const selectedAirlines = selectedFilters?.selectedAirlines || [];
    const selectedAirports = selectedFilters?.selectedAirports || [];
    const selectedStops = selectedFilters?.selectedStops || [];

    return flightList?.filter((flight) => {
      const airlineMatches =
        selectedAirlines.length === 0 ||
        selectedAirlines.some((filter) =>
          flight.itineraries.some((itinerary) =>
            itinerary.segments.some((segment) => filter === segment.carrierCode)
          )
        );

      const airportMatches =
        selectedAirports.length === 0 ||
        selectedAirports.some((filter) =>
          flight.itineraries.some((itinerary) =>
            itinerary.segments.some(
              (segment) =>
                filter === segment.departure.iataCode ||
                filter === segment.arrival.iataCode
            )
          )
        );

      const stopsMatches =
        selectedStops.length === 0 ||
        selectedStops.some((filter) =>
          flight.itineraries.some(
            (itinerary) => itinerary.segments.length === filter + 1
          )
        );

      return airlineMatches && airportMatches && stopsMatches;
    });
  }, [flightList, selectedFilters]);

  const sortedFlights = useMemo<FlightOffer[]>(() => {
    return filteredFlights?.slice().sort((s, e) => {
      const first = s.itineraries[0].segments[0];
      const firstDeparture = new Date(first.departure.at).getTime();
      const firstArrival = new Date(first.arrival.at).getTime();
      const last = e.itineraries[0].segments[0];
      const lastDeparture = new Date(last.departure.at).getTime();
      const lastArrival = new Date(last.arrival.at).getTime();
      const firstPrice = Number(s.price.grandTotal);
      const lastPrice = Number(e.price.grandTotal);

      switch (sort) {
        case "departure-earliest":
          return firstDeparture - lastDeparture;
        case "departure-latest":
          return lastDeparture - firstDeparture;
        case "arrival-earliest":
          return firstArrival - lastArrival;
        case "arrival-latest":
          return lastArrival - firstArrival;
        case "price-lowest":
          return firstPrice - lastPrice;
        case "price-highest":
          return lastPrice - firstPrice;
        default:
          return 0;
      }
    });
  }, [filteredFlights, sort]);

  useEffect(() => {
    if (isLoading) void getFlights();
  }, [isLoading]);

  return (
    <div className="container mx-auto">
      {isLoading && <Loading />}

      {!isLoading && (
        <Filters
          filters={filters}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          sort={sort}
          setSorted={setSorted}
        />
      )}

      {!isLoading && sortedFlights?.length > 0 && (
        <div className={classNames(Styles.flight_list, "flex flex-wrap")}>
          {sortedFlights?.map((item, index) => (
            <Flight
              flight={item}
              isLoading={isSelectLoading}
              setIsLoading={setIsSelectLoading}
              key={index}
            />
          ))}
        </div>
      )}

      {!isLoading && flightList?.length === 0 && (
        <div className={classNames(Styles.flight_list, "flex flex-wrap")}>
          <article className="my-10 flex-1 justify-center text-2xl text-center">
            There is no flight
          </article>
        </div>
      )}
    </div>
  );
}
