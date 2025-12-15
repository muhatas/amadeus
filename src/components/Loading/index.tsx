import classNames from "classnames";

// Styles
import Styles from "./styles.module.scss";

type Loading = {
  variant?: string;
};

export default function Loading({ variant }: Loading) {
  const variantClass = !!variant && Styles[variant];
  
  return (
    <div
      className={classNames(
        Styles.loading,
        variantClass,
        "my-5 mx-auto size-5 animate-spin"
      )}
    ></div>
  );
}
