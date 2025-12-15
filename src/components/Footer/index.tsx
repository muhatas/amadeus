import classNames from "classnames";

// Styles
import Styles from "./styles.module.scss";

export default function Footer() {
  return (
    <footer
      className={classNames(
        Styles.footer,
        "flex mx-auto items-center justify-center"
      )}
    >
      <div className="text-center">by Atassama</div>
    </footer>
  );
}
