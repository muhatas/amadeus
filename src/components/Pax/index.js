import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

// Components
// import Input from "@/components/Input";
import { SearchControl } from "@/utils/templates";

// Styles
import Styles from "./styles.module.scss";

export const PersonCounter = ({ value, type, typeName, counter }) => {
  return (
    <li>
      <div className="person-type">{typeName}</div>
      <div
        className={classNames(
          Styles.person_counter,
          "flex justify-center align-center"
        )}
      >
        <button
          className="hover:cursor-pointer disabled:hover:cursor-default"
          disabled={value === 0}
          onClick={() => counter(Number(value) - 1)}
        >
          <FontAwesomeIcon icon={faMinus} />
        </button>
        <span className="flex justify-center align-center">{value}</span>
        <button
          className="hover:cursor-pointer disabled:cursor-default"
          disabled={value === 3}
          onClick={() => counter(Number(value) + 1)}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
    </li>
  );
};

export const PersonDropDown = ({
  adults,
  children,
  infants,
  isPersonDropDownOpen,
  ref,
  setAdults,
  setChildren,
  setInfants,
}) => {
  return (
    isPersonDropDownOpen && (
      <nav
        className={classNames(Styles.pax_dropdown, "col-span-1 col-end-7")}
        ref={ref}
      >
        <ul>
          <PersonCounter
            type={`adults`}
            typeName={`Adult`}
            value={adults}
            counter={setAdults}
          />
          <PersonCounter
            type={`children`}
            typeName={`Child`}
            value={children}
            counter={setChildren}
          />
          <PersonCounter
            type={`infants`}
            typeName={`Infant`}
            value={infants}
            counter={setInfants}
          />
        </ul>
      </nav>
    )
  );
};

export default function Pax({
  className,
  id,
  label,
  adults,
  setAdults,
  children,
  setChildren,
  infants,
  setInfants,
}) {
  const [isPersonDropDownOpen, setIsPersonDropDownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const paxTotal = adults + children + infants;
  const newValue =
    paxTotal == 1
      ? `${paxTotal} Traveler`
      : paxTotal > 1
      ? `${paxTotal} Travelers`
      : "";

  const closeDropDown = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      triggerRef.current &&
      !triggerRef.current.contains(event.target)
    ) {
      setIsPersonDropDownOpen(false);
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
      {/* <Input
        className={className}
        type="text"
        id={id}
        placeholder={placeholder}
        defaultValue={newValue}
        value={newValue}
        readonly
        onClick={setIsPersonDropDownOpen}
        ref={triggerRef}
      /> */}

<SearchControl
        id={id}
        defaultValue={newValue}
        value={newValue}
        label={label}
        onChange={(e) => onSearch(e.target.value)}
        onClick={setIsPersonDropDownOpen}
        readonly
        ref={triggerRef}
      />

      <PersonDropDown
        adults={adults}
        children={children}
        infants={infants}
        isPersonDropDownOpen={isPersonDropDownOpen}
        ref={dropdownRef}
        setAdults={setAdults}
        setChildren={setChildren}
        setInfants={setInfants}
      />
    </div>
  );
}
