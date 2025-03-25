/** @format */

export const RatingConfigObj: {
  [key: string]: {
    label: string;
    color: string;
    defaultValue: number;
    userValue: number;
    range?: { min: number; max: number };
  }[];
} = {
  "WEATHER FORECAST": [
    { label: "Fair", color: "text-green-500", defaultValue: 0, userValue: 0 },
    {
      label: "Fair (Day)",
      color: "text-green-500",
      defaultValue: 0,
      userValue: 0,
    },
    {
      label: "Fair (Night)",
      color: "text-green-500",
      defaultValue: 0,
      userValue: 0,
    },
    {
      label: "Fair and Warm",
      color: "text-green-500",
      defaultValue: 0,
      userValue: 0,
    },
    {
      label: "Partly Cloudy",
      color: "text-green-500",
      defaultValue: 0,
      userValue: 0,
    },
    {
      label: "Partly Cloudy (Day)",
      color: "text-green-500",
      defaultValue: 0,
      userValue: 0,
    },
    {
      label: "Partly Cloudy (Night)",
      color: "text-green-500",
      defaultValue: 0,
      userValue: 0,
    },
    {
      label: "Cloudy",
      color: "text-green-500",
      defaultValue: 0,
      userValue: 0,
    },
    {
      label: "Windy",
      color: "text-green-500",
      defaultValue: 0,
      userValue: 0,
    },
    {
      label: "Mist",
      color: "text-green-500",
      defaultValue: 0,
      userValue: 0,
    },
    {
      label: "Fog",
      color: "text-green-500",
      defaultValue: 0,
      userValue: 0,
    },
    {
      label: "Slightly Hazy",
      color: "text-yellow-500",
      defaultValue: -0.5,
      userValue: -0.5,
    },
    {
      label: "Hazy",
      color: "text-yellow-500",
      defaultValue: -0.5,
      userValue: -0.5,
    },
    {
      label: "Passing Showers",
      color: "text-yellow-500",
      defaultValue: -1,
      userValue: -1,
    },
    {
      label: "Light Showers",
      color: "text-yellow-500",
      defaultValue: -1,
      userValue: -1,
    },
    {
      label: "Showers",
      color: "text-orange-500",
      defaultValue: -1,
      userValue: -1,
    },
    {
      label: "Light Rain",
      color: "text-orange-500",
      defaultValue: -1,
      userValue: -1,
    },
    {
      label: "Moderate Rain",
      color: "text-orange-500",
      defaultValue: -2,
      userValue: -2,
    },
    {
      label: "Heavy Showers",
      color: "text-red-500",
      defaultValue: -3,
      userValue: -3,
    },
    {
      label: "Heavy Rain",
      color: "text-red-500",
      defaultValue: -3,
      userValue: -3,
    },
    {
      label: "Thundery Showers",
      color: "text-red-500",
      defaultValue: -4,
      userValue: -4,
    },
    {
      label: "Heavy Thundery Showers",
      color: "text-purple-500",
      defaultValue: -5,
      userValue: -5,
    },
    {
      label: "Heavy Thundery Showers with Gusty Winds",
      color: "text-purple-500",
      defaultValue: -5,
      userValue: -5,
    },
  ],
  PSI: [
    {
      label: "Good ( 0 - 50 )",
      color: "text-green-500",
      defaultValue: 0,
      userValue: 0,
      range: { min: 0, max: 50 },
    },
    {
      label: "Moderate ( 51 - 100 )",
      color: "text-blue-500",
      defaultValue: 0,
      userValue: 0,
      range: { min: 51, max: 100 },
    },
    {
      label: "Unhealthy ( 101 - 200 )",
      color: "text-yellow-500",
      defaultValue: -1,
      userValue: -1,
      range: { min: 101, max: 200 },
    },
    {
      label: "Very unhealthy ( 201 - 300 )",
      color: "text-orange-500",
      defaultValue: -2,
      userValue: -2,
      range: { min: 201, max: 300 },
    },
    {
      label: "Hazardous ( Above 300 )",
      color: "text-red-500",
      defaultValue: -5,
      userValue: -5,
      range: { min: 301, max: 1000 },
    },
  ],
  UVI: [
    {
      label: "Low ( 0 - 2 )",
      color: "text-green-500",
      defaultValue: 0,
      userValue: 0,
      range: { min: 0, max: 2 },
    },
    {
      label: "Moderate ( 3 - 5 )",
      color: "text-yellow-500",
      defaultValue: 0,
      userValue: 0,
      range: { min: 3, max: 5 },
    },
    {
      label: "High ( 6 - 7 )",
      color: "text-orange-500",
      defaultValue: -1.5,
      userValue: -1.5,
      range: { min: 6, max: 7 },
    },
    {
      label: "Very High ( 8 - 10 )",
      color: "text-red-500",
      defaultValue: -2,
      userValue: -2,
      range: { min: 8, max: 10 },
    },
    {
      label: "Extreme ( 11 - ∞ )",
      color: "text-purple-500",
      defaultValue: -5,
      userValue: -5,
      range: { min: 11, max: 1000 },
    },
  ],
};
