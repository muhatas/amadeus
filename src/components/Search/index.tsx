"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import moment from "moment";
import qs from "qs";

// Components
import Location from "@/components/Location";
import DatePicker from "@/components/DatePicker";
import Pax from "@/components/Pax";

// Styles
import Styles from "./styles.module.scss";

type FlightSearchQuery = {
  originLocationCode: string | null;
  destinationLocationCode: string | null;
  departureDate: string;
  adults: number;
  max?: number;
  returnDate?: string;
  children?: number;
  infants?: number;
};

export default function Search() {
  const router = useRouter();
  const [where, setWhere] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);
  const [originLocationCode, setOriginLocationCode] = useState<string | null>(
    null
  );
  const [destinationLocationCode, setDestinationLocationCode] = useState<
    string | null
  >(null);
  const [departureDate, setDepartureDate] = useState<string>(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [isDepartureDateOk, setIsDepartureDateOk] = useState<boolean>(false);
  const [returnDate, setReturnDate] = useState<string>(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [isReturn, setIsReturn] = useState<boolean>(false);
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [infants, setInfants] = useState<number>(0);

  const onSearch = () => {
    const payload: FlightSearchQuery = {
      originLocationCode,
      destinationLocationCode,
      departureDate,
      adults,
      max: 250,
      ...(isReturn && { returnDate }),
      ...(children && { children }),
      ...(infants && { infants }),
    };

    router.push(`/flights?${qs.stringify(payload)}`);
  };

  return (
    <div
      className={classNames(
        Styles.search,
        "flex flex-row mx-auto max-w-7xl items-center justify-between p-10 rounded-md"
      )}
    >
      <div
        className={classNames(
          Styles.search_form,
          "mr-6 flex flex-row items-center justify-between"
        )}
      >
        <Location
          fieldClassNames="rounded-tl-md rounded-bl-md"
          id="departure"
          label="Leaving from"
          value={where}
          setValue={setWhere}
          setCityCode={setOriginLocationCode}
        />
        <Location
          id="destination"
          label="Going to"
          value={to}
          setValue={setTo}
          setCityCode={setDestinationLocationCode}
        />
        <DatePicker
          id="departure-date"
          label="Departure Date"
          date={departureDate}
          minDate={moment().format("YYYY-MM-DD")}
          startDate={departureDate}
          setDate={setDepartureDate}
          setIsDepartureDateOk={setIsDepartureDateOk}
        />
        <DatePicker
          id="return-date"
          label="Return Date"
          date={returnDate}
          minDate={departureDate}
          startDate={returnDate}
          setDate={setReturnDate}
          isReturn={isReturn}
          setIsReturn={setIsReturn}
          isDepartureDateOk={isDepartureDateOk}
          setIsDepartureDateOk={setIsDepartureDateOk}
        />
        <Pax
          fieldClassNames="rounded-tr-md rounded-br-md hover:cursor-pointer"
          id="pax"
          label="Travelers"
          adults={adults}
          setAdults={setAdults}
          children={children}
          setChildren={setChildren}
          infants={infants}
          setInfants={setInfants}
        />
      </div>

      <div
        className={classNames(
          Styles.search_button,
          "flex flex-row items-center justify-between"
        )}
      >
        <button
          type="button"
          className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={onSearch}
        >
          Search
        </button>
      </div>
    </div>
  );
}
