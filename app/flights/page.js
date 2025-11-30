import FlightList from "@/components/FlightList";

export default async function FlightListPage({ searchParams }) {
  const {
    originLocationCode,
    destinationLocationCode,
    departureDate,
    returnDate,
    adults,
    children,
    infants,
    max,
  } = await searchParams;

  return (
    <FlightList
      originLocationCode={originLocationCode}
      destinationLocationCode={destinationLocationCode}
      departureDate={departureDate}
      returnDate={returnDate}
      adults={adults}
      children={children}
      infants={infants}
      max={max}
    />
  );
}
