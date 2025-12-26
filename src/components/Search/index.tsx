"use client";

import react from "react";
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
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  adults: number;
  max: number;
  returnDate?: string;
  children?: number;
  infants?: number;
};

export default function Search() {
  const router = useRouter();
  const [where, setWhere] = react.useState<string>("");
  const [to, setTo] = react.useState<string>("");
  const [originLocationCode, setOriginLocationCode] = react.useState<string>("");
  const [destinationLocationCode, setDestinationLocationCode] =
    react.useState<string>("");
  const [departureDate, setDepartureDate] = react.useState<string>(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [isDepartureDateOk, setIsDepartureDateOk] = react.useState<boolean>(false);
  const [returnDate, setReturnDate] = react.useState<string>(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [isReturn, setIsReturn] = react.useState<boolean>(false);
  const [adults, setAdults] = react.useState<number>(1);
  const [children, setChildren] = react.useState<number>(0);
  const [infants, setInfants] = react.useState<number>(0);

  const onSearch = async () => {
    const payload: FlightSearchQuery = {
      originLocationCode: originLocationCode,
      destinationLocationCode: destinationLocationCode,
      departureDate: departureDate,
      adults: adults,
      max: 250,
    };

    if (isReturn) payload.returnDate = returnDate;
    if (children) payload.children = children;
    if (infants) payload.infants = infants;

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
          minDate={moment(new Date(), "MM.DD.YYYY").format("YYYY.MM.DD")}
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
