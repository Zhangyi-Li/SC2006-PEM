/** @format */
"use client";
import React, { useState, useEffect } from "react";
import { CircleX } from "lucide-react";
import { ParkData } from "@/lib/parks";

type ParkObj = {
  [key: string]: {
    coordinate: [number, number];
    region: string;
    area: string;
  };
};

interface AddParkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  parkList: {
    name: string;
    id: number;
  }[];
  setParkList: React.Dispatch<
    React.SetStateAction<{ name: string; id: number }[]>
  >;
}

const regions = ["Central", "North", "South", "East", "West"];
const parksByRegion: { [key: string]: string[] } = getParksByRegion(ParkData);

function getParksByRegion(parkObj: ParkObj): { [region: string]: string[] } {
  const parksByRegion: { [region: string]: string[] } = {};

  for (const park in parkObj) {
    const region = parkObj[park].region;
    if (!parksByRegion[region]) {
      parksByRegion[region] = [];
    }
    parksByRegion[region].push(park);
  }

  // Optional: sort parks alphabetically in each region
  for (const region in parksByRegion) {
    parksByRegion[region].sort();
  }

  return parksByRegion;
}

const AddParkDialog: React.FC<AddParkDialogProps> = ({
  isOpen,
  onClose,
  parkList,
  setParkList,
}) => {
  const [selectedParks, setSelectedParks] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    if (isOpen) {
      // initialize selectedParks with parkList
      const selectedParksObj: { [key: string]: boolean } = {};
      parkList.forEach((park) => {
        selectedParksObj[park.name] = true;
      });
      setSelectedParks(selectedParksObj);
    }
  }, [isOpen]);

  const handleCheckboxChange = (park: string) => {
    setSelectedParks((prev) => ({
      ...prev,
      [park]: !prev[park],
    }));

    // append or remove park from parkList and save it to localstorage
    const newParkList = selectedParks[park]
      ? parkList.filter((p) => p.name !== park)
      : [...parkList, { name: park, id: parkList.length }];
    setParkList(newParkList);

    if (typeof window !== "undefined") {
      localStorage.setItem("parkList", JSON.stringify(newParkList));
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-auto p-4 py-24">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Select Parks to View Rating</h2>
          <button onClick={onClose} className="text-red-500">
            <CircleX size={24} />
          </button>
        </div>
        {regions.map((region) => (
          <div key={region} className="mb-4">
            <h3 className="font-bold">{region}</h3>
            {parksByRegion[region].map((park) => (
              <div key={park} className="flex items-center">
                <input
                  type="checkbox"
                  id={park}
                  checked={!!selectedParks[park]}
                  onChange={() => handleCheckboxChange(park)}
                  className="mr-2"
                />
                <label htmlFor={park}>{park}</label>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddParkDialog;
