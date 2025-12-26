import {
  forwardRef,
  type Dispatch,
  type SetStateAction,
  type ReactElement,
} from "react";
import classNames from "classnames";
import ReactDatePicker, {
  type DatePickerProps,
  type ReactDatePickerCustomHeaderProps,
} from "react-datepicker";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";

// Components
import { DatePickerInput } from "@/utils/templates";

// Styles
import Styles from "./styles.module.scss";

type DatePicker = {
  id: string;
  label: string;
  date: string;
  startDate: string;
  minDate: string;
  setDate: Dispatch<SetStateAction<string>>;
  isReturn?: boolean;
  setIsReturn?: Dispatch<SetStateAction<boolean>>;
  isDepartureDateOk?: boolean;
  setIsDepartureDateOk: Dispatch<SetStateAction<boolean>>;
};

type DatePickerCommonSettingsArgs = {
  label: string;
  isReturn?: boolean;
  name: string;
  id: string;
  value: string;
};

type DatePickerCommonSettingsReturn = Pick<
  DatePickerProps,
  "renderCustomHeader" | "monthsShown" | "dateFormat" | "customInput"
>;

const toDateOrNull = (value?: string): Date | null => {
  if (!value) return null;
  const date = moment(value);
  return date.isValid() ? date.toDate() : null;
};

export const DatePickerHeader = forwardRef<
  HTMLDivElement,
  ReactDatePickerCustomHeaderProps
>(
  (
    {
      monthDate,
      customHeaderCount,
      decreaseMonth,
      increaseMonth,
      prevMonthButtonDisabled,
      nextMonthButtonDisabled,
    },
    ref
  ) => (
    <div ref={ref}>
      <button
        className={classNames(
          {
            "react-datepicker__navigation--previous-disabled":
              prevMonthButtonDisabled,
            invisible: customHeaderCount === 1,
          },
          "react-datepicker__navigation react-datepicker__navigation--previous"
        )}
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>
      <div className="react-datepicker__current-month">
        <b>{monthDate.toLocaleString("en-US", { month: "long" })}</b>
        {monthDate.toLocaleString("en-US", { year: "numeric" })}
      </div>
      <button
        className={classNames(
          {
            "react-datepicker__navigation--next-disabled":
              nextMonthButtonDisabled,
            invisible: customHeaderCount === 0,
          },
          "react-datepicker__navigation react-datepicker__navigation--next"
        )}
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
      >
        <FontAwesomeIcon icon={faAngleRight} />
      </button>
    </div>
  )
);

DatePickerHeader.displayName = "DatePickerHeader";

export const DatePickerCommonSettings = (
  customProps: DatePickerCommonSettingsArgs
): DatePickerCommonSettingsReturn => {
  return {
    renderCustomHeader: (props) => <DatePickerHeader {...props} />,
    monthsShown: 2,
    dateFormat: "MM.dd.YYYY",
    customInput: (
      <DatePickerInput
        id={customProps.id}
        name={customProps.name}
        label={customProps.label}
        isReturn={customProps.isReturn}
      />
    ) as ReactElement,
  };
};

export default function DatePicker({
  id,
  label,
  date,
  startDate,
  minDate,
  setDate,
  isReturn,
  setIsReturn,
  isDepartureDateOk,
  setIsDepartureDateOk,
}: DatePicker) {
  const nextDatePicker = (bool: boolean): void => {
    if (isDepartureDateOk !== undefined) setIsDepartureDateOk(bool);
  };

  const onChangeDates = (selectedDate: Date | null): void => {
    setDate(moment(selectedDate).format("YYYY-MM-DD"));
    if (isDepartureDateOk === undefined) {
      setIsDepartureDateOk(true);
    } else {
      setIsDepartureDateOk(false);
    }
  };

  const selectedDate = toDateOrNull(date);
  const minDateObj = toDateOrNull(minDate);
  const startDateObj = toDateOrNull(startDate);

  return (
    <div
      className={classNames(Styles.form_group, "relative flex items-center")}
    >
      <ReactDatePicker
        id={id}
        {...DatePickerCommonSettings({
          id: id,
          name: id,
          label: label,
          value: minDate,
          isReturn: isReturn,
        })}
        selected={selectedDate}
        minDate={minDateObj ?? undefined}
        startDate={startDateObj ?? undefined}
        open={isDepartureDateOk && isReturn}
        onChange={(selectedDate) => onChangeDates(selectedDate)}
        onClickOutside={() => nextDatePicker(false)}
        onInputClick={() => nextDatePicker(true)}
      />

      {setIsReturn && (
        <label
          htmlFor="direction-select"
          className={classNames(
            Styles.direction_select,
            "absolute flex justify-center align-center gap-1 hover:cursor-pointer"
          )}
        >
          <input
            type="checkbox"
            id="direction-select"
            checked={isReturn}
            onChange={() => setIsReturn(!isReturn)}
          />
          Return
        </label>
      )}
    </div>
  );
}
