import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

// Components
import { TextControl } from "@/utils/templates";

// Styles
import Styles from "./styles.module.scss";

type PaxGlobalTypes = {
  adults: number;
  setAdults: Dispatch<SetStateAction<number>>;
  childCount: number;
  setChildCount: Dispatch<SetStateAction<number>>;
  infants: number;
  setInfants: Dispatch<SetStateAction<number>>;
};

type PaxProps = PaxGlobalTypes & {
  fieldClassNames?: string;
  id: string;
  label: string;
};

type PaxDropDownProps = PaxGlobalTypes & {
  isShowing: boolean;
};

type PaxCounterProps = {
  value: number;
  label: string;
  counter: Dispatch<SetStateAction<number>>;
};

export const PaxCounter = ({ value, label, counter }: PaxCounterProps) => {
  return (
    <li>
      <div className={Styles.pax_type}>{label}</div>
      <div
        className={classNames(
          Styles.pax_counter,
          "flex justify-center align-center"
        )}
      >
        <button
          className="hover:cursor-pointer disabled:hover:cursor-default"
          disabled={value === 0}
          onClick={() => counter(value - 1)}
        >
          <FontAwesomeIcon icon={faMinus} />
        </button>
        <span className="flex justify-center align-center">{value}</span>
        <button
          className="hover:cursor-pointer disabled:cursor-default"
          disabled={value === 3}
          onClick={() => counter(value + 1)}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
    </li>
  );
};

export const PaxDropDown = forwardRef<HTMLDivElement, PaxDropDownProps>(
  (
    {
      isShowing,
      adults,
      childCount,
      infants,
      setAdults,
      setChildCount,
      setInfants,
    },
    ref
  ) => {
    return (
      <>
        {isShowing && (
          <div
            className={classNames(
              Styles.pax_dropdown,
              // { hidden: !isShowing, block: isShowing },
              "col-span-1 col-end-7"
            )}
            ref={ref}
          >
            <ul>
              <PaxCounter label="Adult" value={adults} counter={setAdults} />
              <PaxCounter
                label="Child"
                value={childCount}
                counter={setChildCount}
              />
              <PaxCounter label="Infant" value={infants} counter={setInfants} />
            </ul>
          </div>
        )}
      </>
    );
  }
);

PaxDropDown.displayName = "PaxDropDown";

export default function Pax({
  fieldClassNames,
  id,
  label,
  adults,
  setAdults,
  childCount,
  setChildCount,
  infants,
  setInfants,
}: PaxProps) {
  const [isPaxDropDownOpen, setIsPaxDropDownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLInputElement | null>(null);
  const paxTotal = adults + childCount + infants;
  const newValue =
    paxTotal == 1
      ? `${paxTotal} Traveler`
      : paxTotal > 1
      ? `${paxTotal} Travelers`
      : "";

  const closeDropDown = (event: MouseEvent): void => {
    const target = event.target as Node;

    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(target) &&
      triggerRef.current &&
      !triggerRef.current.contains(target)
    ) {
      setIsPaxDropDownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeDropDown);
    return () => {
      document.removeEventListener("mousedown", closeDropDown);
    };
  }, []);

  return (
    <div
      className={classNames(Styles.form_group, "relative flex items-center")}
    >
      <TextControl
        ref={triggerRef}
        fieldClassNames={fieldClassNames}
        label={label}
        id={id}
        name={id}
        defaultValue={newValue}
        value={newValue}
        readOnly={true}
        onClick={() => setIsPaxDropDownOpen(!isPaxDropDownOpen)}
      />

      <PaxDropDown
        adults={adults}
        childCount={childCount}
        infants={infants}
        isShowing={isPaxDropDownOpen}
        ref={dropdownRef}
        setAdults={setAdults}
        setChildCount={setChildCount}
        setInfants={setInfants}
      />
    </div>
  );
}
