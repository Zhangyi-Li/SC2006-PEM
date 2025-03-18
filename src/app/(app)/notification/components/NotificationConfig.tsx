/** @format */
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import NotificationDialog from "./NotificationDialog";

type Notification = {
  time: string;
  park: string;
  date: string[];
  enabled: boolean;
};

const NotificationConfig = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      time: "08:00 AM",
      park: "Pasir Ris Park",
      date: ["Mon", "Wed", "Fri"],
      enabled: false,
    },
    { time: "08:30 AM", park: "Pasir Ris Park", date: ["Mon"], enabled: true },
  ]);

  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  const toggleSwitch = (index: number) => {
    const newNotifications = [...notifications];
    newNotifications[index].enabled = !newNotifications[index].enabled;
    setNotifications(newNotifications);
  };

  const openDialog = (notification: Notification) => {
    setSelectedNotification(notification);
  };

  const closeDialog = () => {
    setSelectedNotification(null);
  };

  const displayDate = (date: string[]) => {
    return date.join(", ");
  };

  return (
    <div>
      {notifications.map((notification, index) => (
        <div key={index}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px",
            }}
            onClick={() => openDialog(notification)}
          >
            <div>
              <h2>{notification.time}</h2>
              <p>
                {notification.park}, {displayDate(notification.date)}
              </p>
            </div>
            <Switch
              checked={notification.enabled}
              onCheckedChange={() => toggleSwitch(index)}
            />
          </div>
          <hr />
        </div>
      ))}
      {selectedNotification && (
        <NotificationDialog
          notification={selectedNotification}
          onClose={closeDialog}
          isOpen={selectedNotification ? true : false}
        />
      )}
    </div>
  );
};

export default NotificationConfig;
