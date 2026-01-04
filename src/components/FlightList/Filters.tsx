import {
  useEffect,
  useState,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import slugify from "slugify";
import classNames from "classnames";
import _ from "lodash";

// Components
import { CheckboxControl } from "@/utils/templates";

// Utils
import { normalizeToArray } from "@/utils/shortcuts";

// Types
import type { SelectedFiltersState } from "@/utils/types";

// Styles
import Styles from "./styles.module.scss";

type SortKey =
  | "recomended"
  | "departure-earliest"
  | "departure-latest"
  | "arrival-earliest"
  | "arrival-latest"
  | "price-lowest"
  | "price-highest";

type FilterItem = {
  name?: string;
  code?: string;
};

type FiltersData = {
  airports?: FilterItem[] | null;
  airlines?: FilterItem[] | null;
  stops?: number | null;
};

type FilterType = keyof SelectedFiltersState;

type FilterProps = {
  title: string;
  list?: FilterItem[] | null;
  count?: number | null;
  type: FilterType;
  selectedFilters: string[];
  setSelectedFilters: Dispatch<SetStateAction<SelectedFiltersState>>;
};

type SortProps = {
  sort: SortKey;
  setSorted: Dispatch<SetStateAction<SortKey>>;
};

type FiltersProps = {
  filters: FiltersData;
  selectedFilters: SelectedFiltersState;
  setSelectedFilters: Dispatch<SetStateAction<SelectedFiltersState>>;
  sort: SortKey;
  setSorted: Dispatch<SetStateAction<SortKey>>;
};

export const Filter = ({
  title,
  list,
  count,
  type,
  selectedFilters,
  setSelectedFilters,
}: FilterProps) => {
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isShow, setIsShow] = useState<boolean>(false);

  const closeDropdown = (event: MouseEvent): void => {
    const target = event.target as Node;

    if (
      triggerRef.current &&
      !triggerRef.current.contains(target) &&
      dropdownRef.current &&
      !dropdownRef.current.contains(target)
    ) {
      setIsShow(false);
    }
  };

  const onSelect = (code: string): void => {
    setSelectedFilters((prev) => {
      const current = new Set<string>(prev[type] || []);
      if (current.has(code)) current.delete(code);
      else current.add(code);

      return {
        ...prev,
        [type]: Array.from(current),
      };
    });
  };

  const source = list ?? count;

  const normalized =
    source == null
      ? []
      : typeof source === "number"
      ? _.range(0, source + 1)
      : normalizeToArray<FilterItem>(source);

  useEffect(() => {
    document.addEventListener("mousedown", closeDropdown);
    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, []);

  return (
    <div className={classNames(Styles.filter, "relative inline-block")}>
      <div
        className={classNames(
          Styles.filter_toggle,
          "px-4 flex justify-between items-center hover:cursor-pointer"
        )}
        ref={triggerRef}
        onClick={() => setIsShow(!isShow)}
      >
        {title}
        <FontAwesomeIcon icon={isShow ? faAngleUp : faAngleDown} />
      </div>
      {isShow && (
        <div
          className={classNames(Styles.filter_dropdown, "p-4 absolute")}
          ref={dropdownRef}
        >
          <ul className="p-0 m-0">
            {normalized?.map((item, index) => {
              const isNumber = typeof item === "number";

              const code = isNumber ? String(item) : item.code ?? String(index);
              const name = isNumber
                ? item === 0
                  ? "NonStop"
                  : `${item} ${item === 1 ? "Stop" : "Stops"}`
                : item.name ?? item.code ?? String(index);

              return (
                <li
                  className={classNames({
                    "mt-4": index !== 0,
                  })}
                  key={index}
                >
                  <CheckboxControl
                    id={String(code)}
                    name={String(code)}
                    label={slugify(name, { lower: true, replacement: " " })}
                    checked={selectedFilters.includes(code)}
                    onChange={() => onSelect(code)}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export const Sort = ({ sort, setSorted }: SortProps) => {
  return (
    <select
      className={classNames(Styles.sorting, "px-4 hover:cursor-pointer")}
      value={sort}
      onChange={(e) => setSorted(e.target.value as SortKey)}
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
}: FiltersProps) {
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
