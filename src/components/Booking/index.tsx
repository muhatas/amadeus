"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useForm,
  Controller,
  useFieldArray,
  type SubmitHandler,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { string, object, array, type InferType } from "yup";

import {
  TextControl,
  TextAreaControl,
  DateControl,
  GenderControl,
} from "@/utils/templates";
import Sidebar from "@/components/Booking/Sidebar";

// Contexts
import { useBooking } from "@/context/bookingContext";

// Utils
import { ClientApi } from "@/utils/api";
import { formatDateForOrder, getYear } from "@/utils/shortcuts";

import type { FlightOffer } from "@/utils/types";

// Styles
import Styles from "./styles.module.scss";
import classNames from "classnames";

type TravelerForm = {
  id: string;
  gender: string;
  name: {
    firstName: string;
    lastName: string;
  };
  dateOfBirth: string;
  passportNumber: string;
  type: number;
};

type BookingFormValues = {
  email?: string;
  phone?: {
    phoneArea?: string;
    phoneNumber?: string;
  };
  address?: string;
  travelers: TravelerForm[];
};

type TravelerDocument = {
  documentType: "PASSPORT";
  birthPlace: string;
  issuanceLocation: string;
  issuanceDate: string;
  number: string;
  expiryDate: string;
  issuanceCountry: string;
  validityCountry: string;
  nationality: string;
  holder: boolean;
};

type TravelerContact = {
  emailAddress?: string;
  phones: Array<{
    deviceType: "MOBILE";
    countryCallingCode?: string;
    number?: string;
  }>;
};

type Travelers = Omit<TravelerForm, "type"> & {
  dateOfBirth: string;
  contact?: TravelerContact;
  documents?: TravelerDocument[];
};

type TravelerPricing = {
  travelerId: string;
  travelerType: "ADULT" | "CHILD" | "HELD_INFANT" | string;
};

type SelectedFlight = FlightOffer[];

const requiredText = "This field is required";

let bookingSchema = object({
  email: string().email("E-mail must be a valid email").required(requiredText),
  phone: object({
    phoneArea: string().required(requiredText),
    phoneNumber: string().required(requiredText),
  }),
  address: string().required(requiredText),
  travelers: array()
    .of(
      object({
        name: object({
          firstName: string().required(requiredText),
          lastName: string().required(requiredText),
        }),
        gender: string()
          .oneOf(["MALE", "FEMALE"], "Gender must be male or female")
          .required(requiredText),
        passportNumber: string()
          .min(8, "Passport must be at least 8 characters")
          .max(14, "Passport must be at most 14 characters")
          .required(requiredText),
        dateOfBirth: string()
          .matches(
            /^(0\d|1[0-2])\.([0-2]\d|3[01])\.(197[0-9]|198[0-9]|199[0-9]|200[0-9]|201[0-9]|202[0-5])$/,
            "Date must be a valid format"
          )
          .required(requiredText),
      })
    )
    .min(1, "At least one traveler is required"),
});

type BookingSchemaValues = InferType<typeof bookingSchema>;

export default function Booking() {
  const router = useRouter();

  const { selectedFlight } = useBooking() as {
    selectedFlight?: SelectedFlight;
  };

  const travelerPricings: TravelerPricing[] =
    selectedFlight?.[0]?.travelerPricings ?? [];

  const defaultTravelers = useMemo(
    () =>
      travelerPricings.length > 0
        ? travelerPricings.map((item) => {
            const travelerType = item.travelerType;

            let type: TravelerForm["type"] = 0;
            let dateOfBirth = "01.01.1970";

            if (travelerType === "CHILD") {
              type = 1;
              dateOfBirth = `01.01.${getYear(12)}`;
            } else if (travelerType === "HELD_INFANT") {
              type = 0;
              dateOfBirth = `01.01.${getYear(2)}`;
            }

            return {
              id: item.travelerId,
              gender: "MALE",
              name: { firstName: "", lastName: "" },
              dateOfBirth: dateOfBirth,
              passportNumber: "",
              type: type,
            };
          })
        : [
            {
              id: "1",
              gender: "MALE",
              name: { firstName: "", lastName: "" },
              dateOfBirth: "01.01.1970",
              passportNumber: "",
              type: 0,
            },
          ],
    [travelerPricings]
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BookingFormValues>({
    mode: "onChange",
    resolver: yupResolver(bookingSchema) as never,
    defaultValues: {
      travelers: defaultTravelers,
    },
  });

  const { fields } = useFieldArray<BookingFormValues, "travelers", "id">({
    control,
    name: "travelers",
    keyName: "id",
  });

  const onSubmit: SubmitHandler<BookingFormValues> = async (data) => {
    const emailAddress = data?.email;
    const phoneArea = data?.phone?.phoneArea;
    const phoneNumber = data?.phone?.phoneNumber;

    const travelers: Travelers[] = (data.travelers ?? []).map((item) => {
      const { type, ...rest } = item;

      const baseTraveler: Travelers = {
        ...rest,
        dateOfBirth: formatDateForOrder(item.dateOfBirth),
      };

      if (item.id === "1") {
        return {
          ...baseTraveler,
          contact: {
            emailAddress: emailAddress,
            phones: [
              {
                deviceType: "MOBILE",
                countryCallingCode: phoneArea,
                number: phoneNumber,
              },
            ],
          },
          documents: [
            {
              documentType: "PASSPORT",
              birthPlace: "Istanbul",
              issuanceLocation: "Istanbul",
              issuanceDate: "2020-04-14",
              number: item.passportNumber,
              expiryDate: "2030-04-14",
              issuanceCountry: "TR",
              validityCountry: "TR",
              nationality: "TR",
              holder: true,
            },
          ],
        };
      }

      return baseTraveler;
    });

    let payload = {
      data: {
        type: "flight-order",
        flightOffers: selectedFlight,
        ticketingAgreement: {
          option: "DELAY_TO_CANCEL",
          delay: "1D",
        },
        travelers: travelers,
      },
    };

    try {
      const response = await ClientApi.post(
        "/v1/booking/flight-orders",
        payload
      );

      const id = (response as any)?.data?.id as string | undefined;
      const errors = (response as any)?.errors as
        | Array<{
            title?: string;
            detail?: string;
          }>
        | undefined;

      if (errors?.length) {
        const { title, detail } = errors[0] || {};
        console.log(`${title} - ${detail}`);
        return;
      }

      router.push(`/confirmation/${id}`);
    } catch (error: any) {
      const { title, detail } =
        error?.response?.data?.errors?.[0] || ({} as any);
      console.log(`${title} - ${detail}`);
    }
  };

  useEffect(() => {
    if (!selectedFlight) {
      return router.back();
    }
  }, [selectedFlight]);

  return (
    <div className="container mx-auto">
      <div className="flex flex-row gap-4">
        <div className="w-8/12">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={Styles.contact}>
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <TextControl
                    {...field}
                    fieldClassNames="rounded-md"
                    groupClassNames="mt-6"
                    label="E-mail"
                    error={fieldState?.error}
                    id="email"
                  />
                )}
              />

              <div className="flex flex-row gap-4">
                <div className="w-2/12 w-xs-6/12">
                  <Controller
                    name="phone.phoneArea"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextControl
                        {...field}
                        fieldClassNames="rounded-md"
                        groupClassNames="mt-6"
                        label="Country Code"
                        id="phone-area"
                        error={fieldState?.error}
                      />
                    )}
                  />
                </div>
                <div className="w-10/12 w-xs-6/12">
                  <Controller
                    name="phone.phoneNumber"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextControl
                        {...field}
                        fieldClassNames="rounded-md"
                        groupClassNames="mt-6"
                        label="Phone Number"
                        id="phone-number"
                        error={fieldState?.error}
                      />
                    )}
                  />
                </div>
              </div>

              <Controller
                name="address"
                control={control}
                render={({ field, fieldState }) => (
                  <TextAreaControl
                    {...field}
                    fieldClassNames="rounded-md"
                    groupClassNames="mt-6"
                    label="Address"
                    id="address"
                    error={fieldState?.error}
                  />
                )}
              />
            </div>

            <div className={Styles.traveler_list}>
              {fields.map((item, index) => {
                const typedItem = item as unknown as TravelerForm & {
                  fieldId: string;
                };

                let travelerLabel = "Adult";
                if (typedItem.type === 1) travelerLabel = "Child";
                else if (typedItem.type === 2) travelerLabel = "Infant";

                return (
                  <div
                    className={classNames(Styles.traveler_card, "mt-5")}
                    key={item.id}
                  >
                    <div
                      className={classNames(
                        Styles.traveler_card_title,
                        "text-lg font-semibold"
                      )}
                      key={item.id}
                    >
                      {index + 1}. Traveler ({travelerLabel})
                    </div>
                    <div className={Styles.traveler_card_form}>
                      <Controller
                        name={`travelers.${index}.gender`}
                        control={control}
                        render={({ field, fieldState }) => (
                          <GenderControl
                            {...field}
                            fieldClassNames="rounded-md"
                            groupClassNames="mt-6"
                            id=""
                            label="Gender"
                            index={index}
                            error={fieldState?.error}
                          />
                        )}
                      />

                      <Controller
                        name={`travelers.${index}.name.firstName`}
                        control={control}
                        render={({ field, fieldState }) => (
                          <TextControl
                            {...field}
                            fieldClassNames="rounded-md"
                            groupClassNames="mt-6"
                            label="Name"
                            id={`traveler-${index}-name`}
                            error={fieldState?.error}
                          />
                        )}
                      />

                      <Controller
                        name={`travelers.${index}.name.lastName`}
                        control={control}
                        render={({ field, fieldState }) => (
                          <TextControl
                            {...field}
                            fieldClassNames="rounded-md"
                            groupClassNames="mt-6"
                            label="Surname"
                            id={`traveler-${index}-surname`}
                            error={fieldState?.error}
                          />
                        )}
                      />

                      <Controller
                        name={`travelers.${index}.dateOfBirth`}
                        control={control}
                        render={({ field, fieldState }) => (
                          <DateControl
                            {...field}
                            fieldClassNames="rounded-md"
                            groupClassNames="mt-6"
                            label="Date of Birth"
                            id={`traveler-${index}-dateofbirth`}
                            value={field.value}
                            error={fieldState?.error}
                            mask="00.00.0000"
                          />
                        )}
                      />

                      <Controller
                        name={`travelers.${index}.passportNumber`}
                        control={control}
                        render={({ field, fieldState }) => (
                          <TextControl
                            {...field}
                            fieldClassNames="rounded-md"
                            groupClassNames="mt-6"
                            label="Passport Number"
                            id={`traveler-${index}-passport`}
                            value={field.value}
                            error={fieldState?.error}
                          />
                        )}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              className={classNames(
                Styles.form_submit,
                "mt-6 flex justify-center items-center"
              )}
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>

        <Sidebar flightSummary={selectedFlight} />
      </div>
    </div>
  );
}
