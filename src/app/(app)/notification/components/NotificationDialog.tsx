/** @format */
import React, { useState } from "react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Notification = {
  time: string;
  park: string;
  date: string[];
  enabled: boolean;
};

type NotificationDialogProps = {
  notification: Notification;
  onClose: () => void;
  isOpen: boolean;
};

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

const TimePicker: React.FC<{
  time: string;
  onChange: (time: string) => void;
}> = ({ time, onChange }) => {
  const [hours, setHours] = useState(parseInt(time.split(":")[0]));
  const [minutes, setMinutes] = useState(parseInt(time.split(":")[1]));

  const handleHoursChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setHours(parseInt(e.target.value));
    onChange(
      `${e.target.value.padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`
    );
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMinutes(parseInt(e.target.value));
    onChange(
      `${hours.toString().padStart(2, "0")}:${e.target.value.padStart(2, "0")}`
    );
  };

  return (
    <div className="flex space-x-2">
      <select value={hours} onChange={handleHoursChange} className="">
        {Array.from({ length: 24 }, (_, i) => (
          <option key={i} value={i}>
            {i.toString().padStart(2, "0")}
          </option>
        ))}
      </select>
      <select value={minutes} onChange={handleMinutesChange} className="">
        {Array.from({ length: 60 }, (_, i) => (
          <option key={i} value={i}>
            {i.toString().padStart(2, "0")}
          </option>
        ))}
      </select>
    </div>
  );
};

const NotificationDialog: React.FC<NotificationDialogProps> = ({
  notification,
  onClose,
  isOpen,
}) => {
  const [selectedDays, setSelectedDays] = useState<string[]>(
    notification.date ? notification.date : []
  );
  const [time, setTime] = useState(notification.time);
  const [selectedPark, setSelectedPark] = useState(notification.park);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex justify-between items-center p-4">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-yellow-500 focus:outline-none"
            >
              Cancel
            </Button>
            <DialogTitle className="text-center">Add Alarm</DialogTitle>
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-yellow-500 focus:outline-none"
            >
              Save
            </Button>
          </div>
          <div className="grid gap-4 py-4 px-4">
            <div>
              <label className="block text-gray-400">Time</label>
              <TimePicker time={time} onChange={setTime} />
            </div>
            <div>
              <label className="block text-gray-400">Repeat every</label>
              <div className="flex space-x-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day, index) => (
                    <button
                      key={index}
                      onClick={() => toggleDay(day)}
                      className={`w-6 h-6 rounded-full border text-sm ${
                        selectedDays.includes(day)
                          ? "bg-gray-500 text-white"
                          : "bg-transparent text-gray-400"
                      }`}
                    >
                      {day[0]}
                    </button>
                  )
                )}
                <button
                  onClick={() => setSelectedDays([])}
                  className={`px-2 h-6 rounded-full border text-sm ${
                    selectedDays.length === 0
                      ? "bg-gray-500 text-white"
                      : "bg-transparent text-gray-400"
                  }`}
                >
                  Never
                </button>
              </div>
            </div>
            <div>
              <label className="block text-gray-400">Park</label>

              <Select value={selectedPark} onValueChange={setSelectedPark}>
                <SelectTrigger className="w-[280px] bg-white">
                  <SelectValue placeholder="Select a park" />
                </SelectTrigger>
                <SelectContent className="bg-white overflow-y-auto max-h-[400px]">
                  {Object.entries(parksByRegion).map(([region, parks]) => (
                    <SelectGroup key={region}>
                      <SelectLabel>{region}</SelectLabel>
                      {parks.map((park) => (
                        <SelectItem key={park} value={park}>
                          {park}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationDialog;
