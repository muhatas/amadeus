import classNames from "classnames";
import slugify from "slugify";

// Styles
import Styles from "@/utils/styles.module.scss";

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
