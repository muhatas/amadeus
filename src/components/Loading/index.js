import classNames from "classnames";

// Styles
import Styles from "./styles.module.scss";

export default function Loading({ variant }) {
  return (
    <div
      className={classNames(
        Styles.loading,
        Styles[variant],
        "my-5 mx-auto size-5 animate-spin"
      )}
    ></div>
  );
}
