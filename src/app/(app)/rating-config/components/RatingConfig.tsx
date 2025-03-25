/** @format */

"use client";

import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RatingConfigObj } from "@/lib/ratingConfig";

interface ConfigItem {
  label: string;
  color: string;
  defaultValue: number;
  userValue: number;
  range?: { min: number; max: number };
}

interface ConfigData {
  [key: string]: ConfigItem[];
}

export const RatingConfig: React.FC = () => {
  // retrieve localstorage ratingConfigData
  const localRatingConfigData =
    typeof window !== "undefined"
      ? localStorage.getItem("ratingConfigData")
      : null;

  const [userConfigData, setUserConfigData] = useState<ConfigData>(
    localRatingConfigData ? JSON.parse(localRatingConfigData) : RatingConfigObj
  );

  const handleSliderChange = (key: string, index: number, value: number) => {
    const updatedConfigData = { ...userConfigData };
    updatedConfigData[key as keyof ConfigData][index].userValue = value;
    setUserConfigData(updatedConfigData);
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "ratingConfigData",
        JSON.stringify(updatedConfigData)
      );
    }
  };

  const handleResetToDefault = () => {
    console.log("reset");
    setUserConfigData(RatingConfigObj);
    if (typeof window !== "undefined") {
      localStorage.setItem("ratingConfigData", JSON.stringify(RatingConfigObj));
    }
  };

  useEffect(() => {
    if (!localRatingConfigData && typeof window !== "undefined") {
      localStorage.setItem("ratingConfigData", JSON.stringify(RatingConfigObj));
    }
  }, []);

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
                {userConfigData[key as keyof ConfigData].map((item, index) => (
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
                ))}
              </AccordionContent>
            </AccordionItem>
          </div>
        ))}
      </Accordion>

      <button
        onClick={() => {
          handleResetToDefault();
        }}
        className="bg-black text-white p-2 rounded mb-4 fixed bottom-24 right-4 shadow-lg"
      >
        Reset to Default
      </button>
    </div>
  );
};
