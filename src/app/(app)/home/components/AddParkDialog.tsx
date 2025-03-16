/** @format */

import React, { useState } from "react";
import { CircleX } from "lucide-react";

interface Park {
  name: string;
  region: string;
}

interface AddParkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPark: (park: Park) => void;
}

const regions = ["Central", "North", "South", "East", "West"];
const parksByRegion: { [key: string]: string[] } = {
  Central: [
    "Singapore Botanic Gardens",
    "Fort Canning Park",
    "MacRitchie Reservoir Park",
  ],
  North: ["Admiralty Park", "Sembawang Park", "Lower Seletar Reservoir Park"],
  South: ["Mount Faber Park", "Labrador Nature Reserve", "Kent Ridge Park"],
  East: ["East Coast Park", "Pasir Ris Park", "Bedok Reservoir Park"],
  West: ["West Coast Park", "Jurong Lake Gardens", "Bukit Batok Nature Park"],
};

const AddParkDialog: React.FC<AddParkDialogProps> = ({
  isOpen,
  onClose,
  onAddPark,
}) => {
  const [selectedParks, setSelectedParks] = useState<{
    [key: string]: boolean;
  }>({});

  const handleCheckboxChange = (park: string) => {
    setSelectedParks((prev) => ({
      ...prev,
      [park]: !prev[park],
    }));
  };

  const handleAddParks = () => {
    const parksToAdd = Object.keys(selectedParks).filter(
      (park) => selectedParks[park]
    );
    parksToAdd.forEach((park) => {
      const region = Object.keys(parksByRegion).find((region) =>
        parksByRegion[region].includes(park)
      );
      if (region) {
        onAddPark({ name: park, region });
      }
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-auto p-4 pt-32 pb-24">
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
        <button
          onClick={handleAddParks}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        >
          Add Selected Parks
        </button>
      </div>
    </div>
  );
};

export default AddParkDialog;
