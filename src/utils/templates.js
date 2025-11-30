import classNames from "classnames";
import { IMaskInput } from "react-imask";
import slugify from "slugify";

// Styles
import Styles from "./styles.module.scss";

export const SearchControl = ({
  ref,
  id,
  value,
  label,
  error,
  onChange,
  onClick,
}) => {
  const { message } = error || {};
  const name = slugify(id, { replacement: "_" });

  return (
    <div className={classNames(Styles.form_group)}>
      {name === "phone.phoneArea" && !!value && (
        <span className={Styles.phone_country_plus}>+</span>
      )}
      <input
        className={classNames(
          Styles.form_control,
          {
            [Styles.has_error]: !!message,
            "rounded-tl-md rounded-bl-md": id === "departure",
            "rounded-tr-md rounded-br-md hover:cursor-pointer": id === "pax",
          },
          "grow px-3 text-md font-bold bg-white rounded-md block placeholder:text-gray-400 outline-1 outline-gray-300"
        )}
        id={id}
        name={name}
        type="text"
        value={value || ""}
        onChange={onChange}
        onClick={onClick}
        autoComplete="off"
        ref={ref}
      />
      <label
        className={classNames(Styles.form_label, {
          [Styles.has_error]: !!message,
        })}
        htmlFor={id}
      >
        {label}
      </label>
      {!!message && <span className={Styles.form_helper}>{message}</span>}
    </div>
  );
};

export const TextControl = ({ ref, name, value, label, error, onChange }) => {
  const { message } = error || {};
  const id = slugify(name, { strict: true });

  return (
    <div
      className={classNames(Styles.form_group, {
        "mt-0": name === "email",
        "mt-6": name !== "email",
      })}
    >
      {name === "phone.phoneArea" && !!value && (
        <span className={Styles.phone_country_plus}>+</span>
      )}
      <input
        className={classNames(
          Styles.form_control,
          {
            [Styles.has_error]: !!message,
          },
          "grow px-3 text-md font-bold bg-white rounded-md block placeholder:text-gray-400 outline-1 outline-gray-300"
        )}
        id={id}
        name={name}
        type="text"
        value={value || ""}
        onChange={onChange}
        ref={ref}
      />
      <label
        className={classNames(Styles.form_label, {
          [Styles.has_error]: !!message,
        })}
        htmlFor={id}
      >
        {label}
      </label>
      {!!message && <span className={Styles.form_helper}>{message}</span>}
    </div>
  );
};

// export const PhoneCountry = ({ ref, name, value, label, error, onChange }) => {
//   const { message } = error || {};

//   return (
//     <div className={Styles.form_group}>
//       <PhoneInput
//         country={"tr"}
//         className={classNames(Styles.form_control, { "has-error": !!message })}
//         id={name}
//         name={name}
//         value={value || ""}
//         onChange={(phone) => onChange(phone)}
//         ref={ref}
//       />
//       <label className={classNames(Styles.form_label)} htmlFor={name}>
//         {label}
//       </label>
//       {!!message && <span className={Styles.form_helper}>{message}</span>}
//     </div>
//   );
// };

export const TextareaControl = ({
  ref,
  name,
  value,
  label,
  error,
  onChange,
}) => {
  const { message } = error || {};
  const id = slugify(name, { strict: true });

  return (
    <div className={classNames(Styles.form_group, "mt-6")}>
      <textarea
        className={classNames(
          Styles.form_control,
          {
            [Styles.has_error]: !!message,
          },
          "grow px-3 text-md font-bold bg-white rounded-md block placeholder:text-gray-400 outline-1 outline-gray-300"
        )}
        id={id}
        name={name}
        type="text"
        value={value || ""}
        onChange={onChange}
        ref={ref}
      ></textarea>
      <label
        className={classNames(Styles.form_label, {
          [Styles.has_error]: !!message,
        })}
        htmlFor={id}
      >
        {label}
      </label>
      {!!message && <span className={Styles.form_helper}>{message}</span>}
    </div>
  );
};

export const DateControl = ({
  ref,
  name,
  value,
  label,
  error,
  onChange,
  mask,
}) => {
  const { message } = error || {};
  const id = slugify(name, { strict: true });

  return (
    <div className={classNames(Styles.form_group, "mt-6")}>
      <IMaskInput
        className={classNames(
          Styles.form_control,
          {
            [Styles.has_error]: !!message,
          },
          "grow px-3 text-md font-bold bg-white rounded-md block placeholder:text-gray-400 outline-1 outline-gray-300"
        )}
        id={id}
        name={name}
        type="text"
        defaultValue="01.01.1970"
        value={value || ""}
        onChange={onChange}
        autoComplete="off"
        ref={ref}
        mask={mask}
      />
      <label
        className={classNames(Styles.form_label, {
          [Styles.has_error]: !!message,
        })}
        htmlFor={id}
      >
        {label}
      </label>
      {!!message && <span className={Styles.form_helper}>{message}</span>}
    </div>
  );
};

export const GenderControl = ({
  ref,
  name,
  value,
  label,
  error,
  index,
  onChange,
}) => {
  const { message } = error || {};

  return (
    <div className={classNames(Styles.form_group, "mt-2")}>
      <div
        className={classNames(Styles.form_group_title, "mb-1 font-semibold")}
      >
        {label}
      </div>
      <div className="inline-flex">
        <input
          className={Styles.form_radio}
          id={`${name}-male-${index}`}
          name={name}
          type="radio"
          defaultValue="MALE"
          checked={value === "MALE"}
          onChange={onChange}
          ref={ref}
        />
        <label
          className="relative inline-flex items-center gap-2"
          htmlFor={`${name}-male-${index}`}
        >
          Male
        </label>
      </div>

      <div className="ms-6 inline-flex">
        <input
          className={Styles.form_radio}
          id={`${name}-female-${index}`}
          name={name}
          type="radio"
          defaultValue="FEMALE"
          checked={value === "FEMALE"}
          onChange={onChange}
          ref={ref}
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
};
