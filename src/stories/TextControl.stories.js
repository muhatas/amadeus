import { TextControl } from "../utils/templates";

export default {
  title: "Form/TextControl",
  component: TextControl,
  args: {
    name: "firstName",
    label: "First Name",
    value: "",
    error: null,
  },
};

export const Empty = {};

export const WithValue = {
  args: {
    value: "Ataş",
  },
};

export const WithError = {
  args: {
    error: { message: "This field is required" },
  },
};
