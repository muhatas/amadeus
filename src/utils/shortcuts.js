import moment from "moment";

// export const durationFormat = (value) => {
//   const duration = moment.duration(value);
//   const hours = duration.hours() && `${duration.hours()}h`;
//   const minutes = duration.minutes() > 0 ? `${duration.minutes()}m` : "";

//   if (!value) return "";

//   return `${hours} ${minutes}`.trim();
// };

export function durationFormat(duration) {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?/;
  const matches = duration.match(regex);

  if (!matches) return "";

  const hours = matches[1] ? `${matches[1]}h` : "";
  const minutes = matches[2] ? `${matches[2]}m` : "";

  return `${hours} ${minutes}`.trim();
}

export const formatDateForOrder = (date) => {
  if (date) {
    const formattedDate = moment(date, "MM.DD.YYYY").format("YYYY-MM-DD");
    return formattedDate;
  }

  return "-";
};

export const getYear = (number) => {
  const year = new Date().getFullYear();

  return year - number;
};

export const normalizeToArray = (value) => {
  return Array.isArray(value) ? value : Array.from({ length: value });
};
