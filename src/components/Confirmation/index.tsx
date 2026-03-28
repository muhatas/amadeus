"use client";
import { useEffect } from "react";

// Utils
import { ClientApi } from "@/utils/api";

type ConfirmationPageProps = {
  id: string;
};

export default function ConfirmationPage({ id }: ConfirmationPageProps) {
  useEffect(() => {
    if (!id) {
      return;
    }

    const getBookingDetails = async () => {
      await ClientApi.get(`/v1/booking/flight-orders/${id}`);
    };

    void getBookingDetails();
  }, [id]);

  return (
    <div className="mx-auto max-w-7xl items-center justify-between p-6 lg:px-8">
      <div>Thanks for your booking!</div>
      <div>Your booking is successful.</div>
    </div>
  );
}
