"use client";
import { useEffect } from "react";

// Utils
import { ClientApi } from "@/utils/api";

export default function ConfirmationPage({ id }) {
  const getBookingDetails = async () => {
    const response = await ClientApi.get(`/v1/booking/flight-orders/${id}`);
  };

  useEffect(() => {
    if (id) getBookingDetails();
  }, [id]);

  return (
    <div>
      <div>Thanks for your booking!</div>
      <div>Your booking is successful.</div>
    </div>
  );
}
