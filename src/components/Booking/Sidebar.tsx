import type { SidebarProps } from "@/utils/types";

export default function Sidebar({ flightSummary }: SidebarProps) {
  const { itineraries, price } = flightSummary?.[0] || {};
  const { grandTotal, currency } = price || {};

  return (
    <div className="w-4/12">
      <h1>
        <b>SUMMARY</b>
      </h1>
      {itineraries?.map((itinerary, index) => (
        <div className="mt-6" key={index}>
          <div>{index === 0 ? "Departure" : "Return"}</div>
          <div className="flex justify-between">
            <div>{itinerary.segments.at(0)?.departure.iataCode}</div>
            <div></div>
            <div>{itinerary.segments.at(-1)?.arrival.iataCode}</div>
          </div>
        </div>
      ))}
      <hr className="mt-6" />
      <div className="mt-6 flex justify-between">
        <span>Total</span>
        <b>
          {grandTotal} {currency}
        </b>
      </div>
    </div>
  );
}
