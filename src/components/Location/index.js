"use client";

import { useEffect, useState, useRef } from "react";
import classNames from "classnames";
import slugify from "slugify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlaneDeparture,
  faPlaneArrival,
  faBuilding,
  faPlaneUp,
} from "@fortawesome/free-solid-svg-icons";

// Components
import Loading from "@/components/Loading";
import { SearchControl } from "@/utils/templates";
import Input from "@/components/Input";

// Utils
import { ClientApi } from "@/utils/api";

// Styles
import Styles from "./styles.module.scss";

// Location Dropdown List Item
export const LocationListItem = ({ type, location, onSelect }) => {
  const { name, address } = location;
  const { countryName, cityCode, cityName } = address;

  return (
    <li
      className="flex items-center"
      onClick={() =>
        onSelect({
          name: name,
          cityCode: cityCode,
          cityName: cityName,
        })
      }
    >
      <FontAwesomeIcon icon={type === "AIRPORT" ? faPlaneUp : faBuilding} />
      <article className="flex flex-col justify-center">
        <b>{name}</b>
        <span>{countryName}</span>
      </article>
    </li>
  );
};

// Location Dropdown List
export const LocationList = ({
  id,
  placeholder,
  locationList,
  onSelect,
  ref,
  isShowing,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (locationList?.length > 0) {
      setIsLoading(false);
    }
  }, [locationList]);

  return (
    <div
      className={classNames(
        Styles.search_location_list,
        { hidden: !isShowing, block: isShowing },
        "col-span-2 absolute",
        id
      )}
      ref={ref}
    >
      <div
        className={classNames(
          Styles.search_location_list_title,
          "h-[40px] flex items-center"
        )}
      >
        <FontAwesomeIcon
          icon={id === "departure" ? faPlaneDeparture : faPlaneArrival}
        />
        {placeholder}
      </div>
      {isLoading && <Loading />}
      {!isLoading && !!locationList.length && (
        <ul>
          {locationList?.map((item) => (
            <LocationListItem
              location={item}
              type={item.subType}
              key={item.id}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}

      {!isLoading && !locationList.length && (
        <article className="py-3 mt-3 text-lg font-medium text-center">
          There is no result
        </article>
      )}
    </div>
  );
};

// Location
export default function Location({
  className,
  id,
  label,
  value,
  setValue,
  setCityCode,
}) {
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const timer = useRef();
  const [locationList, setLocationlist] = useState([]);
  const [dropdownStatu, setDropdownStatu] = useState(false);

  const onSearch = (keyword) => {
    if (keyword.length < 2) {
      setDropdownStatu(false);
      setLocationlist([]);
    }

    try {
      const formatValue = slugify(keyword, { lower: true });
      setValue(keyword);

      if (timer.current) {
        clearTimeout(timer.current);
      }

      timer.current = setTimeout(async () => {
        if (keyword.length > 2 && !keyword.startsWith(" ")) {
          const response = await ClientApi.get("/v1/reference-data/locations", {
            subType: "AIRPORT,CITY",
            keyword: formatValue,
          });
          setDropdownStatu(true);
          setLocationlist(response?.data);
        }
      }, 500);
    } catch (error) {}
  };

  const onSelect = (obj) => {
    setValue(obj.name);
    setCityCode(obj.cityCode);
    setDropdownStatu(false);
  };

  const onToogleDropDown = () => {
    if (locationList?.length > 0) setDropdownStatu(true);
  };

  const closeDropdown = (event) => {
    if (
      triggerRef.current &&
      !triggerRef.current.contains(event.target) &&
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setDropdownStatu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeDropdown);
    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  return (
    <div
      className={classNames(Styles.form_group, "relative flex items-center")}
    >
      {/* <Input
        type="text"
        className={className}
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onSearch(e.target.value)}
        onClick={onToogleDropDown}
        ref={triggerRef}
      /> */}

      <SearchControl
        id={id}
        value={value}
        label={label}
        onChange={(e) => onSearch(e.target.value)}
        onClick={onToogleDropDown}
        ref={triggerRef}
      />

      <LocationList
        id={id}
        label={label}
        locationList={locationList}
        ref={dropdownRef}
        onSelect={onSelect}
        isShowing={dropdownStatu}
      />
    </div>
  );
}
