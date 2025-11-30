"use client";

// Components
import classNames from "classnames";

// Styles
import Styles from "./styles.module.scss";

export default function Input({
  className,
  type,
  id,
  value,
  placeholder,
  readonly,
  disabled,
  onChange,
  onClick,
  ref,
}) {
  return (
    <input
      className={classNames(
        Styles.form_control,
        [className],
        "block grow px-3 text-base bg-white text-gray-900 placeholder:text-gray-400 outline-1 outline-gray-300 sm:text-sm/6"
      )}
      type={type}
      id={id}
      name={id}
      value={value}
      placeholder={placeholder}
      readOnly={readonly}
      disabled={disabled}
      autoComplete="off"
      onChange={onChange}
      onClick={onClick}
      ref={ref}
    />
  );
}
