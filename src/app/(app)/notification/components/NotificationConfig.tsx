/** @format */
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";

const NotificationConfig = () => {
  const [notifications, setNotifications] = useState([
    {
      time: "08:00 AM",
      label: "Pasir Ris Park",
      date: "Mon, Wed, and Fri",
      enabled: false,
    },
    { time: "08:30 AM", label: "Pasir Ris Park", date: "Mon", enabled: true },
  ]);

  const toggleSwitch = (index: number) => {
    const newNotifications = [...notifications];
    newNotifications[index].enabled = !newNotifications[index].enabled;
    console.log(newNotifications);
    console.log(index);
    setNotifications(newNotifications);
  };

  //   const addNotification = () => {
  //     setNotifications([
  //       ...notifications,
  //       { time: "09:00 AM", label: "New Notification", enabled: false },
  //     ]);
  //   };

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
          >
            <div>
              <h2>{notification.time}</h2>
              <p>
                {notification.label}, {notification.date}
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
      {/* <button onClick={addNotification}>Add Notification</button> */}
    </div>
  );
};

export default NotificationConfig;
