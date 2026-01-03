import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import moment from "moment";
import DatePicker from "@/components/DatePicker";
import { useState } from "react";

const meta: Meta<typeof DatePicker> = {
  title: "Form/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  args: {
    id: "custom-date",
    label: "Custom Date",
    date: moment().format("YYYY-MM-DD"),
    minDate: moment().format("YYYY-MM-DD"),
    startDate: moment().format("YYYY-MM-DD"),
    setDate: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

export const HasNoCheckbox: Story = {
  render: (args) => {
    const [date, setDate] = useState(args.date);
    const [isDepartureDateOk, setIsDepartureDateOk] = useState(false);

    return (
      <DatePicker
        id="custom-date"
        label="Custom Date"
        date={date}
        minDate={date}
        startDate={date}
        setDate={setDate}
        setIsDepartureDateOk={setIsDepartureDateOk}
      />
    );
  },
};

export const HasCheckbox: Story = {
  render: (args) => {
    const [date, setDate] = useState(args.date);
    const [isDepartureDateOk, setIsDepartureDateOk] = useState(false);
    const [isReturn, setIsReturn] = useState(false);

    return (
      <div className="mt-5">
        <DatePicker
          id="custom-date"
          label="Custom Date"
          date={date}
          minDate={date}
          startDate={date}
          setDate={setDate}
          isReturn={isReturn}
          setIsReturn={setIsReturn}
          isDepartureDateOk={isDepartureDateOk}
          setIsDepartureDateOk={setIsDepartureDateOk}
        />
      </div>
    );
  },
};
