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
import { Input } from "@/components/ui/input";
import { ParkData } from "@/lib/parks";

type ParkObj = {
  [key: string]: {
    coordinate: [number, number];
    region: string;
    area: string;
  };
};

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

const LocalTimePicker: React.FC<{
  time: string;
  onChange: (time: string) => void;
}> = ({ time, onChange }) => {
  return (
    <div className="flex justify-center space-x-2">
      <Input
        type="time"
        id="time"
        aria-label="Choose time"
        className="focus-visible:outline-none focus-visible:ring-0 min-w-full"
        value={time}
        onChange={(e) => onChange(e.target.value)}
      />
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
            <DialogTitle className="text-center">
              {notification ? "Edit" : "Add"} Notification
            </DialogTitle>
          </div>
          <div className="grid gap-4 py-2 px-4">
            <div>
              <label className="block text-gray-400">Time</label>
              <LocalTimePicker time={time} onChange={setTime} />
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
                          ? "bg-zinc-500 text-white"
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
                      ? "bg-zinc-500 text-white"
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
                <SelectTrigger className="w-full bg-white">
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

            <Button onClick={onClose} variant="outline" className="mt-4">
              Save
            </Button>
          </div>
        </DialogContent>
        <DialogFooter></DialogFooter>
      </Dialog>
    </div>
  );
};

export default NotificationDialog;
