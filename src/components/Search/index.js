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

export default function Search() {
  const router = useRouter();
  const [where, setWhere] = useState("");
  const [to, setTo] = useState("");
  const [originLocationCode, setOriginLocationCode] = useState("");
  const [destinationLocationCode, setDestinationLocationCode] = useState("");
  const [departureDate, setDepartureDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [isDepartureDateOk, setIsDepartureDateOk] = useState(false);
  const [returnDate, setReturnDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [isReturn, setIsReturn] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  const onSearch = async () => {
    const obj = {
      originLocationCode: originLocationCode,
      destinationLocationCode: destinationLocationCode,
      departureDate: departureDate,
      adults: adults,
      max: 250,
    };

    if (returnDate) obj.returnDate = returnDate;
    if (children) obj.children = children;
    if (infants) obj.infants = infants;

    router.push(`/flights?${qs.stringify(obj)}`);
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
          placeholder="Departure Date"
          date={departureDate}
          minDate={moment(new Date(), "MM.DD.YYYY").format("YYYY.MM.DD")}
          startDate={departureDate}
          setDate={setDepartureDate}
          setIsDepartureDateOk={setIsDepartureDateOk}
        />
        <DatePicker
          id="return-date"
          placeholder="Return Date"
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
          type="text"
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
