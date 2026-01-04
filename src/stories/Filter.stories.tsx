import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

// Components
import { Filter } from "@/components/FlightList/Filters";

// Types
import type { SelectedFiltersState } from "@/utils/types";

const meta: Meta<typeof Filter> = {
  title: "List/Filter",
  component: Filter,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Filter>;

export const DefaultFilter: Story = {
  render: (args) => {
    const [selectedFilters, setSelectedFilters] =
      useState<SelectedFiltersState>({
        selectedAirports: [],
        selectedAirlines: [],
        selectedStops: [],
      });

    const airports = [
      { code: "SAW", name: "Sabiha Gökçen" },
      { code: "IST", name: "Istanbul Airport" },
      { code: "ESB", name: "Ankara Esenboğa" },
    ];

    return (
      <Filter
        {...args}
        title="Airport"
        list={airports}
        type="selectedAirports"
        selectedFilters={selectedFilters.selectedAirports}
        setSelectedFilters={setSelectedFilters}
      />
    );
  },
};
