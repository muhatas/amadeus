import {
  useEffect,
  useState,
  useRef,
  Fragment,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleUp,
  faAngleDown,
  faArrowRight,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import Loading from "@/components/Loading";

// Contexts
import { useBooking } from "@/context/bookingContext";

// Utils
import { ClientApi } from "@/utils/api";
import { durationFormat } from "@/utils/shortcuts";

// Types
import { FlightOffer, PricingResponse } from "@/utils/types";

// Styles
import Styles from "./styles.module.scss";

type FlightProps = {
  flight: FlightOffer;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export default function Flight({
  flight,
  isLoading,
  setIsLoading,
}: FlightProps) {
  const router = useRouter();
  const { setSelectedFlight } = useBooking();
  const stopsTooltipRef = useRef<HTMLDivElement | null>(null);
  const stopsTooltipToggleRef = useRef<HTMLDivElement | null>(null);
  const [isShowTooltip, setIsShowTooltip] = useState<boolean>(false);
  const [isShowRoutes, setIsShowRoutes] = useState<boolean>(false);
  const { itineraries, price, travelerPricings } = flight;
  const { fareDetailsBySegment } = travelerPricings[0];
  const { amenities } = fareDetailsBySegment[0];
  const { grandTotal, currency } = price;

  const stopsTooltipToggle = (event: MouseEvent): void => {
    const target = event.target as Node;

    if (
      stopsTooltipRef.current &&
      !stopsTooltipRef.current.contains(target) &&
      stopsTooltipToggleRef.current &&
      !stopsTooltipToggleRef.current.contains(target)
    ) {
      setIsShowTooltip(false);
    }
  };

  const onSelect = async () => {
    const payload = {
      data: {
        type: "flight-offers-pricing",
        flightOffers: [{ ...flight }],
      },
    };

    setIsLoading(true);

    try {
      const response = await ClientApi.post<PricingResponse>(
        "/v1/shopping/flight-offers/pricing",
        payload
      );

      setSelectedFlight(response?.data.flightOffers);
      router.push("/booking");
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    document.addEventListener("mouseover", stopsTooltipToggle);
    return () => {
      document.removeEventListener("mouseleave", stopsTooltipToggle);
    };
  }, []);

  return (
    <div className={classNames(Styles.flight_item, "relative flex mt-4")}>
      <div
        className={classNames(Styles.flight_routes, "flex flex-1 flex-nowrap")}
      >
        {itineraries?.length > 0 &&
          itineraries?.map((item, index) => (
            <div className={Styles.flight_route} key={index}>
              <div
                className={classNames(
                  Styles.flight_header,
                  "flex flex-row justify-between items-center"
                )}
              >
                <div className="w-1/3">
                  {item.segments.at(0)?.departure.iataCode}
                  <span className="block">
                    {moment(item.segments.at(0)?.departure.at).format(
                      "DD MMMM, dddd YYYY"
                    )}
                  </span>
                  <b className="block">
                    {moment(item.segments.at(0)?.departure.at).format("HH:mm")}
                  </b>
                </div>

                <div
                  className={classNames(
                    Styles.flight_info,
                    "w-1/3 relative text-center"
                  )}
                >
                  <div
                    className="relative"
                    onMouseOver={() => setIsShowTooltip(true)}
                    ref={stopsTooltipToggleRef}
                  >
                    {item.segments.length > 1
                      ? `${item.segments.length - 1} Stop`
                      : "NonStop"}
                  </div>

                  <div className="font-bold mx-auto inline-flex gap-1 items-center">
                    <FontAwesomeIcon icon={faClock} />
                    {durationFormat(item.duration)}
                  </div>

                  {isShowTooltip && (
                    <div
                      className={classNames(
                        Styles.flight_info_tooltip,
                        "absolute"
                      )}
                      ref={stopsTooltipRef}
                    >
                      <ul>
                        {item.segments.slice(0, -1).map((item, index) => (
                          <li key={index}>
                            {item.arrival.iataCode}
                            {" - "}
                            <b>{moment(item.arrival.at).format("HH:mm")}</b>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="w-1/3 text-end">
                  {item.segments.at(-1)?.arrival.iataCode}
                  <span className="block">
                    {moment(item.segments.at(-1)?.arrival.at).format(
                      "DD MMMM, dddd YYYY"
                    )}
                  </span>
                  <b className="block">
                    {moment(item.segments.at(-1)?.arrival.at).format("HH:mm")}
                  </b>
                </div>
              </div>
              {isShowRoutes && (
                <div className={classNames(Styles.flight_stops, "mt-10 block")}>
                  {item?.segments?.map((segment, index) => {
                    const nextStop = item.segments[index + 1];
                    const arrivalTime = moment(segment.arrival.at);
                    let layover = null;

                    if (nextStop) {
                      const nextDepartureTime = moment(nextStop.departure.at);

                      const diff = moment.duration(
                        nextDepartureTime.diff(arrivalTime)
                      );
                      const hours = diff.hours() ? `${diff.hours()}h` : "";
                      const minutes = diff.minutes()
                        ? `${diff.minutes()}m`
                        : "";

                      layover = `${hours} ${minutes}`;
                    }

                    return (
                      <Fragment key={index}>
                        <div
                          className={classNames(
                            Styles.flight_stop,
                            "py-5 px-4 mt-10 relative flex flex-row justify-content-between items-center"
                          )}
                        >
                          <div className="w-1/3">
                            {segment.departure.iataCode}
                            <span className="block">
                              {moment(segment.departure.at).format(
                                "DD MMMM, dddd YYYY"
                              )}
                            </span>
                            <b className="block">
                              {moment(segment.departure.at).format("HH:mm")}
                            </b>
                          </div>

                          <div
                            className={classNames(
                              Styles.flight_stop_duration,
                              "w-1/3 relative text-center"
                            )}
                          >
                            <span className="px-3 relative inline-flex items-center gap-1">
                              <FontAwesomeIcon icon={faClock} />
                              {durationFormat(segment.duration)}
                            </span>
                          </div>

                          <div className="w-1/3 text-end">
                            {segment.arrival.iataCode}
                            <span className="block">
                              {moment(segment.arrival.at).format(
                                "DD MMMM, dddd YYYY"
                              )}
                            </span>
                            <b className="block">
                              {moment(segment.arrival.at).format("HH:mm")}
                            </b>
                          </div>
                        </div>

                        {layover && (
                          <div
                            className={classNames(
                              Styles.flight_stop_layover,
                              "px-5 mt-10 inline-flex items-center"
                            )}
                          >
                            Layover in {segment.arrival.iataCode}: {layover}
                          </div>
                        )}
                      </Fragment>
                    );
                  })}
                </div>
              )}
              <ul
                className={classNames(
                  Styles.flight_amenities,
                  "mt-5 flex flex-wrap"
                )}
              >
                {amenities?.length > 0 &&
                  amenities?.map((item, index) => (
                    <li
                      className="inline-flex items-center px-3 mt-3 me-3 rounded-full"
                      key={index}
                    >
                      {item.description}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
      </div>
      <div
        className={classNames(
          Styles.flight_details,
          "absolute underline cursor-pointer"
        )}
        onClick={() => setIsShowRoutes(!isShowRoutes)}
      >
        {isShowRoutes ? "Hide Details" : "Show Details"}

        <FontAwesomeIcon icon={isShowRoutes ? faAngleUp : faAngleDown} />
      </div>
      <div
        className={classNames(Styles.flight_action, "ps-10 flex items-center")}
      >
        <button
          className={classNames(
            Styles.flight_button,
            "px-5 rounded-[8px] inline-flex items-center gap-2 cursor-pointer"
          )}
          disabled={isLoading}
          onClick={onSelect}
        >
          {isLoading && <Loading variant="white" />}
          {!isLoading && (
            <>
              {grandTotal} {currency}
              <FontAwesomeIcon icon={faArrowRight} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
