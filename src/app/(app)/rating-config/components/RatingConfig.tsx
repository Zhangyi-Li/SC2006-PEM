/** @format */

"use client";

import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ConfigItem {
  label: string;
  color: string;
  defaultValue: number;
  userValue: number;
}

const configData = {
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
      defaultValue: -0.5,
      userValue: -0.5,
    },
    {
      label: "Fog",
      color: "text-green-500",
      defaultValue: -0.5,
      userValue: -0.5,
    },
    {
      label: "Slightly Hazy",
      color: "text-yellow-500",
      defaultValue: -1,
      userValue: -1,
    },
    {
      label: "Hazy",
      color: "text-yellow-500",
      defaultValue: -1,
      userValue: -1,
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
    },
    {
      label: "Moderate ( 51 - 100 )",
      color: "text-blue-500",
      defaultValue: -0.5,
      userValue: -0.5,
    },
    {
      label: "Unhealthy ( 101 - 200 )",
      color: "text-yellow-500",
      defaultValue: -2,
      userValue: -2,
    },
    {
      label: "Very unhealthy ( 201 - 300 )",
      color: "text-orange-500",
      defaultValue: -3,
      userValue: -3,
    },
    {
      label: "Hazardous ( Above 300 )",
      color: "text-red-500",
      defaultValue: -5,
      userValue: -5,
    },
  ],
  UVI: [
    {
      label: "Low ( 0 - 2 )",
      color: "text-green-500",
      defaultValue: 0,
      userValue: 0,
    },
    {
      label: "Moderate ( 3 - 5 )",
      color: "text-yellow-500",
      defaultValue: -0.5,
      userValue: -0.5,
    },
    {
      label: "High ( 3 - 5 )",
      color: "text-orange-500",
      defaultValue: -2,
      userValue: -2,
    },
    {
      label: "Very High ( 3 - 5 )",
      color: "text-red-500",
      defaultValue: -2,
      userValue: -2,
    },
    {
      label: "Extreme ( 11 - ∞ )",
      color: "text-purple-500",
      defaultValue: -5,
      userValue: -5,
    },
  ],
};

export const RatingConfig: React.FC = () => {
  const [userConfigData, setUserConfigData] =
    useState<typeof configData>(configData);

  const handleSliderChange = (key: string, index: number, value: number) => {
    const updatedConfigData = { ...userConfigData };
    updatedConfigData[key as keyof typeof configData][index].userValue = value;
    setUserConfigData(updatedConfigData);
  };

  return (
    <div>
      <Accordion type="single" collapsible>
        {Object.keys(userConfigData).map((key) => (
          <div key={key}>
            <AccordionItem value={key} className="p-4">
              <AccordionTrigger>
                <p className="font-semibold">{key}</p>
              </AccordionTrigger>
              <AccordionContent className="bg-zinc-100 p-4 rounded-2xl">
                {userConfigData[key as keyof typeof configData].map(
                  (item, index) => (
                    <div key={index} className="mb-4">
                      <div className={`text-md font-semibold ${item.color}`}>
                        {item.label}
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm">Rating Deduction</span>

                        <Slider
                          value={[item.userValue]}
                          min={-5}
                          max={0}
                          step={0.5}
                          onValueChange={(e) => {
                            handleSliderChange(key, index, Number(e));
                          }}
                          className="w-full"
                        />

                        <div className="min-w-[50px] text-center">
                          {item.userValue}
                        </div>
                        <button
                          onClick={() =>
                            handleSliderChange(key, index, item.defaultValue)
                          }
                          className=" bg-black text-white p-1 px-2 text-xs rounded"
                        >
                          DEFAULT
                        </button>
                      </div>
                    </div>
                  )
                )}
              </AccordionContent>
            </AccordionItem>
          </div>
        ))}
      </Accordion>
    </div>
  );
};
