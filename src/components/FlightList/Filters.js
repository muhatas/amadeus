"use client";

import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import slugify from "slugify";
import classNames from "classnames";

import { normalizeToArray } from "@/utils/shortcuts";

// Styles
import Styles from "./styles.module.scss";

export const Filter = ({
  title,
  list,
  count,
  type,
  selectedFilters,
  setSelectedFilters,
}) => {
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [isShow, setIsShow] = useState(false);

  const closeDropdown = (event) => {
    if (
      triggerRef.current &&
      !triggerRef.current.contains(event.target) &&
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setIsShow(false);
    }
  };

  const onSelect = (code) => {
    setSelectedFilters((prev) => {
      const current = new Set(prev?.[type] || []);
      if (current.has(code)) current.delete(code);
      else current.add(code);

      return {
        ...prev,
        [type]: Array.from(current),
      };
    });
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeDropdown);
    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, []);

  return (
    <div className={classNames(Styles.filter, "relative")}>
      <div
        className={classNames(
          Styles.filter_toggle,
          "px-4 flex justify-between items-center"
        )}
        ref={triggerRef}
        onClick={() => setIsShow(!isShow)}
      >
        {title}
        <FontAwesomeIcon icon={isShow ? faAngleUp : faAngleDown} />
      </div>
      {isShow && (
        <nav
          className={classNames(Styles.filter_dropdown, "p-4 absolute")}
          ref={dropdownRef}
        >
          <ul className="p-0 m-0">
            {normalizeToArray(list || count)?.map((item, index) => (
              <li
                className={classNames({
                  "mt-4": index !== 0,
                })}
                key={index}
              >
                <input
                  type="checkbox"
                  id={item?.code || `stop-${index}`}
                  name={item?.code || `stop-${index}`}
                  onChange={() => onSelect(item?.code || index)}
                  checked={
                    selectedFilters?.includes(item?.code || index) || false
                  }
                />
                <label
                  htmlFor={item?.code || `stop-${index}`}
                  className="relative flex gap-2"
                >
                  {slugify(
                    item?.name ||
                      item?.code ||
                      `${index === 0 ? "NonStop" : `${index} Stop`}`,
                    {
                      lower: true,
                      replacement: " ",
                    }
                  )}
                </label>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

export const Sort = ({ sort, setSorted }) => {
  return (
    <select
      className={classNames(Styles.sorting, "px-4")}
      value={sort}
      onChange={(e) => setSorted(e.target.value)}
    >
      <option value="recomended">Recomended</option>
      <option value="departure-earliest">Departure (earliest)</option>
      <option value="departure-latest">Departure (latest)</option>
      <option value="arrival-earliest">Arrival (earliest)</option>
      <option value="arrival-latest">Arrival (latest)</option>
      <option value="price-lowest">Price (lowest to highest)</option>
      <option value="price-highest">Price (highest to lowest)</option>
    </select>
  );
};

export default function Filters({
  filters,
  selectedFilters,
  setSelectedFilters,
  sort,
  setSorted,
}) {
  const { airports, airlines, stops } = filters;
  const { selectedAirports, selectedAirlines, selectedStops } = selectedFilters;

  return (
    <div className={classNames(Styles.filters, "flex flex-row gap-4")}>
      <Filter
        title="Airport"
        list={airports}
        type="selectedAirports"
        selectedFilters={selectedAirports}
        setSelectedFilters={setSelectedFilters}
      />
      <Filter
        title="Airlines"
        list={airlines}
        type="selectedAirlines"
        selectedFilters={selectedAirlines}
        setSelectedFilters={setSelectedFilters}
      />
      <Filter
        title="Stops"
        count={stops}
        type="selectedStops"
        selectedFilters={selectedStops}
        setSelectedFilters={setSelectedFilters}
      />
      <Sort sort={sort} setSorted={setSorted} />
    </div>
  );
}
