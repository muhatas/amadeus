import type { Meta, StoryObj } from "@storybook/react";
import { TextControl } from "@/utils/templates";

const meta: Meta<typeof TextControl> = {
  title: "Form/TextControl",
  component: TextControl,
  tags: ['autodocs'],
  args: {
    fieldClassNames: "rounded-md",
    name: "firstName",
    label: "First Name",
    value: "",
    error: null,
  },
};

export default meta;

type Story = StoryObj<typeof TextControl>;

export const Empty: Story = {};

export const WithValue: Story = {
  args: {
    value: "Ataş",
  },
};

export const WithError: Story = {
  args: {
    error: { message: "This field is required" },
  },
};
