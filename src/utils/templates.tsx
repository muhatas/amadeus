import { forwardRef, ChangeEventHandler, MouseEventHandler } from "react";

import classNames from "classnames";
import { IMaskInput } from "react-imask";
import moment from "moment";

// Styles
import Styles from "./styles.module.scss";

type FieldError = {
  message?: string;
} | null;

type BaseControlProps = {
  fieldClassNames?: string;
  groupClassNames?: string;
  id: string;
  name: string;
  value?: string | null;
  label: string;
  error?: FieldError;
  readOnly?: boolean;
  disabled?: boolean;
};

type TextControlEventProps = {
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onClick?: MouseEventHandler<HTMLInputElement>;
};

type TextControlProps = BaseControlProps & TextControlEventProps;

type DateControlProps = BaseControlProps &
  TextControlEventProps & {
    mask?: string;
  };

type TextAreaControlProps = BaseControlProps & {
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  onClick?: MouseEventHandler<HTMLTextAreaElement>;
};

type DatePickerControlProps = BaseControlProps &
  TextControlEventProps & {
    isReturn?: boolean;
  };

type GenderControlProps = BaseControlProps &
  TextControlEventProps & {
    index: number;
  };

export const TextControl = forwardRef<HTMLInputElement, TextControlProps>(
  (
    {
      fieldClassNames,
      id,
      name,
      value,
      label,
      error,
      readOnly,
      groupClassNames,
      disabled,
      onChange,
      onClick,
    },
    ref
  ) => {
    const message = error?.message;

    return (
      <div className={classNames(Styles.form_group, groupClassNames)}>
        <label
          className={classNames(Styles.form_label, {
            [Styles.has_error]: !!message,
            [Styles.has_filled]: !!value,
            "text-gray-400": disabled,
          })}
          htmlFor={id}
        >
          {label}
        </label>

        {name === "phone.phoneArea" && !!value && (
          <span className={Styles.phone_country_plus}>+</span>
        )}

        <input
          ref={ref}
          className={classNames(
            Styles.form_control,
            fieldClassNames,
            {
              [Styles.has_error]: !!message,
              [Styles.filled]: !!value,
              "text-gray-400": disabled,
            },
            "grow text-md font-bold bg-white block outline-1 outline-gray-300"
          )}
          id={id}
          name={name}
          type="text"
          value={value ?? ""}
          readOnly={readOnly}
          disabled={disabled}
          onChange={onChange}
          onClick={onClick}
        />

        {!!message && <span className={Styles.form_helper}>{message}</span>}
      </div>
    );
  }
);

export const TextAreaControl = forwardRef<
  HTMLTextAreaElement,
  TextAreaControlProps
>(
  (
    {
      fieldClassNames,
      id,
      name,
      value,
      label,
      error,
      groupClassNames,
      disabled,
      onChange,
      onClick,
    },
    ref
  ) => {
    const message = error?.message;

    return (
      <div className={classNames(Styles.form_group, groupClassNames)}>
        <label
          className={classNames(Styles.form_label, {
            [Styles.has_error]: !!message,
            [Styles.has_filled]: !!value,
            "text-gray-400": disabled,
          })}
          htmlFor={id}
        >
          {label}
        </label>

        <textarea
          ref={ref}
          className={classNames(
            Styles.form_control,
            fieldClassNames,
            {
              [Styles.has_error]: !!message,
              [Styles.filled]: !!value,
              "text-gray-400": disabled,
            },
            "grow text-md font-bold bg-white block outline-1 outline-gray-300"
          )}
          id={id}
          name={name}
          value={value || ""}
          disabled={disabled}
          onChange={onChange}
          onClick={onClick}
        ></textarea>

        {!!message && <span className={Styles.form_helper}>{message}</span>}
      </div>
    );
  }
);

export const DateControl = forwardRef<HTMLInputElement, DateControlProps>(
  (
    {
      fieldClassNames,
      id,
      name,
      value,
      label,
      error,
      mask,
      groupClassNames,
      disabled,
      onChange,
      onClick,
    },
    ref
  ) => {
    const message = error?.message;

    return (
      <div className={classNames(Styles.form_group, groupClassNames)}>
        <label
          className={classNames(Styles.form_label, {
            [Styles.has_error]: !!message,
            [Styles.has_filled]: !!value,
            "text-gray-400": disabled,
          })}
          htmlFor={id}
        >
          {label}
        </label>

        <IMaskInput
          ref={ref}
          className={classNames(
            Styles.form_control,
            fieldClassNames,
            {
              [Styles.has_error]: !!message,
              [Styles.filled]: !!value,
              "text-gray-400": disabled,
            },
            "grow text-md font-bold bg-white block outline-1 outline-gray-300"
          )}
          id={id}
          name={name}
          type="text"
          defaultValue="01.01.1970"
          value={value || ""}
          autoComplete="off"
          mask={mask}
          disabled={disabled}
          onChange={onChange}
          onClick={onClick}
        />

        {!!message && <span className={Styles.form_helper}>{message}</span>}
      </div>
    );
  }
);

export const GenderControl = forwardRef<HTMLInputElement, GenderControlProps>(
  ({ id, name, value, label, error, index, onChange }, ref) => {
    const message = error?.message;

    return (
      <div className={classNames(Styles.form_group, "mt-2")}>
        <div
          className={classNames(Styles.form_group_title, "mb-1 font-semibold")}
        >
          {label}
        </div>

        <div className="inline-flex">
          <input
            ref={ref}
            className={Styles.form_radio}
            id={`traveler-${index}-male`}
            name={name}
            type="radio"
            defaultValue="MALE"
            checked={value === "MALE"}
            onChange={onChange}
          />
          <label
            className="relative inline-flex items-center gap-2"
            htmlFor={`traveler-${index}-male`}
          >
            Male
          </label>
        </div>

        <div className="ms-6 inline-flex">
          <input
            ref={ref}
            className={Styles.form_radio}
            id={`${name}-female-${index}`}
            name={name}
            type="radio"
            defaultValue="FEMALE"
            checked={value === "FEMALE"}
            onChange={onChange}
          />
          <label
            className="relative inline-flex items-center gap-2"
            htmlFor={`${name}-female-${index}`}
          >
            Female
          </label>
        </div>

        {!!message && <span className={Styles.form_helper}>{message}</span>}
      </div>
    );
  }
);

export const DatePickerInput = forwardRef<
  HTMLInputElement,
  DatePickerControlProps
>(({ label, id, value, isReturn, onClick, onChange }, ref) => {
  return (
    <div className={classNames(Styles.form_group)}>
      <label
        className={classNames([Styles.form_label], {
          [Styles.has_filled]: !!value,
          "text-gray-400": isReturn === false,
        })}
        htmlFor={id}
      >
        {label}
      </label>
      <input
        ref={ref}
        className={classNames(
          Styles.form_control,
          {
            [Styles.filled]: !!value,
            "text-gray-400": isReturn === false,
          },
          "grow text-md font-bold bg-white block outline-1 outline-gray-300"
        )}
        id={id}
        type="text"
        value={moment(value, "MM.DD.YYYY").format("DD MMMM, YYYY")}
        autoComplete="off"
        readOnly={true}
        disabled={isReturn === false}
        onChange={onChange}
        onClick={onClick}
      />
    </div>
  );
});
