import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  type Dispatch,
  type SetStateAction,
} from "react";
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
import { TextControl } from "@/utils/templates";

// Utils
import { ClientApi } from "@/utils/api";

// Styles
import Styles from "./styles.module.scss";

type LocationProps = {
  fieldClassNames?: string;
  id: string;
  label: string;
  value?: string | null;
  setValue: Dispatch<SetStateAction<string | null>>;
  setCityCode: Dispatch<SetStateAction<string | null>>;
};

type LocationApiItem = {
  id: string;
  name: string;
  subType: "AIRPORT" | "CITY" | string;
  address: {
    countryName?: string;
    cityCode: string;
    cityName?: string;
  };
};

type LocationListProps = {
  id: string;
  label: string;
  locationList: LocationApiItem[];
  onSelect: (selected: SelectedLocation) => void;
  isShowing: boolean;
};

type LocationListItemProps = {
  type: string;
  location: LocationApiItem;
  onSelect: (selected: SelectedLocation) => void;
};

type SelectedLocation = {
  name: string;
  cityName?: string;
  cityCode: string;
};

// Location Dropdown List Item
export const LocationListItem = ({
  type,
  location,
  onSelect,
}: LocationListItemProps) => {
  const { name, address } = location;
  const { countryName, cityCode, cityName } = address;

  return (
    <li
      className="flex items-center"
      onClick={() =>
        onSelect({
          name,
          cityCode,
          cityName,
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
export const LocationList = forwardRef<HTMLDivElement, LocationListProps>(
  ({ id, label, locationList, onSelect, isShowing }, ref) => {
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
          {label}
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
  }
);

LocationList.displayName = "LocationList";

// Location
export default function Location({
  fieldClassNames,
  id,
  label,
  value,
  setValue,
  setCityCode,
}: LocationProps) {
  const triggerRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [locationList, setLocationlist] = useState<LocationApiItem[]>([]);
  const [dropdownStatu, setDropdownStatu] = useState(false);

  const onSearch = (keyword: string): void => {
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
          const response = await ClientApi.get<{ data: LocationApiItem[] }>(
            "/v1/reference-data/locations",
            {
              subType: "AIRPORT,CITY",
              keyword: formatValue,
            }
          );
          
          setDropdownStatu(true);
          setLocationlist(response?.data);
        }
      }, 500);
    } catch (error) {}
  };

  const onSelect = (payload: SelectedLocation): void => {
    setValue(payload.name);
    setCityCode(payload.cityCode);
    setDropdownStatu(false);
  };

  const onToogleDropDown = () => {
    if (locationList?.length > 0) setDropdownStatu(true);
  };

  const closeDropdown = (event: MouseEvent): void => {
    const target = event.target as Node;

    if (
      triggerRef.current &&
      !triggerRef.current.contains(target) &&
      dropdownRef.current &&
      !dropdownRef.current.contains(target)
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
      <TextControl
        ref={triggerRef}
        fieldClassNames={fieldClassNames}
        id={id}
        name={id}
        value={value}
        label={label}
        onChange={(e) => onSearch(e.target.value)}
        onClick={onToogleDropDown}
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
