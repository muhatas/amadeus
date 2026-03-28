import FlightList from "@/components/FlightList";

type FlightListPageProps = {
  searchParams: {
    originLocationCode: string;
    destinationLocationCode: string;
    departureDate: string;
    returnDate?: string;
    adults: number;
    children?: number;
    infants?: number;
    max?: number;
  };
};

export default async function FlightListPage({
  searchParams,
}: FlightListPageProps) {
  const {
    originLocationCode,
    destinationLocationCode,
    departureDate,
    returnDate,
    adults,
    children: childCount,
    infants,
    max,
  } = searchParams;

  return (
    <FlightList
      originLocationCode={originLocationCode}
      destinationLocationCode={destinationLocationCode}
      departureDate={departureDate}
      returnDate={returnDate}
      adults={adults}
      childCount={childCount}
      infants={infants}
      max={max}
    />
  );
}
