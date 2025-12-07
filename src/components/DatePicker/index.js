import { forwardRef } from "react";
import classNames from "classnames";
import ReactDatePicker from "react-datepicker";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";

// Components
import Input from "@/components/Input";
import { DatePickerInput } from "@/utils/templates";

// Styles
import Styles from "./styles.module.scss";

export const DatePickerHeader = forwardRef(
  (
    {
      monthDate,
      customHeaderCount,
      decreaseMonth,
      increaseMonth,
      prevMonthButtonDisabled,
      nextMonthButtonDisabled,
    },
    customHeader
  ) => (
    <div ref={customHeader}>
      <button
        className={`react-datepicker__navigation react-datepicker__navigation--previous ${
          prevMonthButtonDisabled &&
          "react-datepicker__navigation--previous-disabled"
        }`}
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        style={customHeaderCount === 1 ? { visibility: "hidden" } : null}
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>
      <div className="react-datepicker__current-month">
        <b>{monthDate.toLocaleString("en-US", { month: "long" })}</b>
        {monthDate.toLocaleString("en-US", { year: "numeric" })}
      </div>
      <button
        className={`react-datepicker__navigation react-datepicker__navigation--next ${
          nextMonthButtonDisabled &&
          "react-datepicker__navigation--next-disabled"
        }`}
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        style={customHeaderCount === 0 ? { visibility: "hidden" } : null}
      >
        <FontAwesomeIcon icon={faAngleRight} />
      </button>
    </div>
  )
);

export const DatePickerCommonSettings = (customProps) => {
  return {
    renderCustomHeader: (props) => <DatePickerHeader {...props} />,
    monthsShown: 2,
    dateFormat: "MM.dd.YYYY",
    customInput: (
      <DatePickerInput
        type={customProps.type}
        label={customProps.label}
        isReturn={customProps.isReturn}
      />
    ),
  };
};

export default function DatePicker({
  className,
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
}) {
  const nextDatePicker = (bool) => {
    if (isDepartureDateOk !== undefined) setIsDepartureDateOk(bool);
  };

  const onChangeDates = (selectedDate) => {
    setDate(moment(selectedDate).format("YYYY-MM-DD"));
    if (isDepartureDateOk === undefined) {
      setIsDepartureDateOk(true);
    } else {
      setIsDepartureDateOk(false);
    }
  };

  return (
    <div
      className={classNames(Styles.form_group, "relative flex items-center")}
    >
      <ReactDatePicker
        id={id}
        {...DatePickerCommonSettings({
          type: "text",
          className: className,
          label: label,
          value: minDate,
          isReturn: isReturn,
          setIsReturn: setIsReturn ? setIsReturn : null,
        })}
        selected={date}
        minDate={minDate}
        startDate={new Date(startDate)}
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
