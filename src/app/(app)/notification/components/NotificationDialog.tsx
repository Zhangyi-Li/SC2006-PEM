/** @format */
import React, { useState, useEffect, use } from "react";

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
  id: number;
  time: string;
  park: string;
  date: string[];
  enabled: boolean;
  called: boolean; // New property to track if the notification has been called
};

type NotificationDialogProps = {
  notification: Notification | null;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
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
  setNotifications,
  onClose,
  isOpen,
}) => {
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [time, setTime] = useState("00:00");
  const [selectedPark, setSelectedPark] = useState("");

  const toggleDay = (day: string) => {
    const daysOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const isSelected = selectedDays.includes(day);
    const newSelectedDays = isSelected
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    newSelectedDays.sort((a, b) => {
      return daysOrder.indexOf(a) - daysOrder.indexOf(b);
    });
    setSelectedDays(newSelectedDays);
  };

  const closeDialog = () => {
    setSelectedDays([]);
    setTime("00:00");
    setSelectedPark("");
    onClose();
  };

  const handleSaveNotification = () => {
    if (!selectedPark) {
      alert("Please select a park.");
      return;
    }
    if (!time) {
      alert("Please select the time.");
      return;
    }

    const newNotification: Notification = {
      id: notification ? notification.id : Date.now(),
      time: time,
      park: selectedPark,
      date: selectedDays,
      enabled: true,
      called: false, // Initialize called to true when creating a new notification
    };

    // set notification in order of time and if id exists, update it
    if (notification) {
      setNotifications((prev) => {
        const updatedNotifications = prev.map((n) =>
          n.id === notification.id ? newNotification : n
        );
        updatedNotifications.sort((a, b) => {
          return a.time.localeCompare(b.time);
        });
        localStorage.setItem(
          "notificationList",
          JSON.stringify(updatedNotifications)
        );
        return updatedNotifications;
      });
      closeDialog();
      return;
    } else {
      // if id does not exist, add it to the list
      setNotifications((prev) => {
        const updatedNotifications = [...prev, newNotification];
        updatedNotifications.sort((a, b) => {
          return a.time.localeCompare(b.time);
        });
        localStorage.setItem(
          "notificationList",
          JSON.stringify(updatedNotifications)
        );
        return updatedNotifications;
      });
    }

    closeDialog();
  };

  const handleDeleteNotification = (id: number) => {
    setNotifications((prev) => {
      const updatedNotifications = prev.filter((n) => n.id !== id);
      localStorage.setItem(
        "notificationList",
        JSON.stringify(updatedNotifications)
      );
      return updatedNotifications;
    });
    closeDialog();
  };

  useEffect(() => {
    console.log("isOpen", isOpen);
    if (isOpen && notification) {
      setTime(notification?.time ?? getCurrentTime());
      setSelectedDays(notification?.date ?? []);
      setSelectedPark(notification?.park ?? "");
    } else if (isOpen) {
      setTime(getCurrentTime());
    }
  }, [isOpen, notification]);

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
            <Button
              onClick={handleSaveNotification}
              variant="outline"
              className="mt-4 text-green-500 "
            >
              Save
            </Button>
            {notification && (
              <Button
                variant="outline"
                className="text-red-500 "
                onClick={() => {
                  handleDeleteNotification(notification.id);
                }}
              >
                Delete Notification
              </Button>
            )}
          </div>
        </DialogContent>
        <DialogFooter></DialogFooter>
      </Dialog>
    </div>
  );
};

export default NotificationDialog;
