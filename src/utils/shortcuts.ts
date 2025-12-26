import moment from "moment";
import "moment-duration-format";

export const durationFormat = (value?: string | number): string => {
  if (!value) return "";

  const duration = moment.duration(value);
  return (duration as any).format("H[h] m[m]");
};

export const formatDateForOrder = (value?: string): string => {
  if (!value) return "-";

  const formattedDate = moment(value, "MM.DD.YYYY").format("YYYY-MM-DD");
  return formattedDate;
};

export const getYear = (value: number): number => {
  const year = new Date().getFullYear();

  return year - value;
};

export const normalizeToArray = <T>(value: T[] | number): T[] => {
  return Array.isArray(value) ? value : (Array.from({ length: value }) as T[]);
};
