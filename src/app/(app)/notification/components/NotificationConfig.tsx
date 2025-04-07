/** @format */
import React, { useState, useEffect, useRef } from "react";
import { Switch } from "@/components/ui/switch";
import NotificationDialog from "./NotificationDialog";
import { Plus } from "lucide-react";
import { RatingConfigObj } from "@/lib/ratingConfig";

type Notification = {
  id: number;
  time: string;
  park: string;
  date: string[];
  enabled: boolean;
  called: boolean; // New property to track if the notification has been called
};

interface ParkForecast {
  uvi: { value: number | null; color: string } | null;
  psi: { value: number | null; color: string } | null;
  forecast: { value: string | null; color: string } | null;
  rating: { value: number | null; color: string } | null;
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

const NotificationConfig = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [isClient, setIsClient] = useState(false);

  const subscriptionRef = useRef<PushSubscription | null>(null);

  // retrieve localstorage ratingConfigData
  const localRatingConfigData =
    typeof window !== "undefined"
      ? localStorage.getItem("ratingConfigData")
      : null;

  useEffect(() => {
    // Ensure this runs only on the client
    setIsClient(true);
    const localNotificationList = localStorage.getItem("notificationList");
    if (localNotificationList) {
      setNotifications(JSON.parse(localNotificationList));
      console.log(localNotificationList);
    }

    const setup = async () => {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        try {
          console.log("Checking for existing service worker registration...");
          const existingRegistration =
            await navigator.serviceWorker.getRegistration();
          if (existingRegistration) {
            console.log(
              "Service worker already registered:",
              existingRegistration
            );
            subscriptionRef.current =
              await existingRegistration.pushManager.getSubscription();
            if (subscriptionRef.current) {
              console.log(
                "Existing push subscription found:",
                subscriptionRef.current
              );
              return;
            }
          }

          console.log("Registering new service worker...");
          const registration = await navigator.serviceWorker.register("/sw.js");
          console.log("Service worker registered:", registration);

          const reg = await navigator.serviceWorker.ready;
          if (!reg) {
            throw new Error("Service worker is not ready.");
          }
          console.log("Service worker ready:", reg);

          // Check if the service worker is active
          if (registration.active) {
            console.log("Service worker sw.js is loaded and active.");
          } else {
            console.warn("Service worker sw.js is not active yet.");
          }

          if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
            throw new Error(
              "VAPID public key is missing in environment variables."
            );
          }

          const sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
              process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
            ),
          });

          console.log("Subscribed to push notifications:", sub);
          subscriptionRef.current = sub;
        } catch (error) {
          console.error("Error during service worker setup:", error);
          if (error instanceof DOMException) {
            console.error("DOMException details:", error.message);
          }
        }
      } else {
        console.warn("Push notifications are not supported in this browser.");
      }
    };
    setup();
  }, []);

  useEffect(() => {
    // Timer to check for matching notifications
    const timer = setInterval(() => {
      const now = new Date();
      now.setSeconds(now.getSeconds() + 15); // Add 15 seconds to the current time
      const currentTime = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      // Check if the notification date matches today's day in term of mon tue wed thu fri sat sun
      const today = new Date();
      const dayOfWeek = today.toLocaleString("en-US", {
        weekday: "long",
      });
      const dayOfWeekAbbr = dayOfWeek.substring(0, 3); //.toLowerCase(); // Get the first three letters of the day

      notifications.forEach((notification, index) => {
        if (
          notification.enabled &&
          notification.time === currentTime &&
          !notification.called
        ) {
          if (
            notification.date.length === 0 ||
            notification.date.includes(dayOfWeekAbbr)
          ) {
            console.log(
              `Notification triggered for park: ${notification.park}`
            );

            const postData = async () => {
              const response = await fetch("/api/retrieveCurrentRating", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  ratingConfig: localRatingConfigData
                    ? JSON.parse(localRatingConfigData)
                    : RatingConfigObj,
                }),
              });

              return response.json();
            };

            postData().then((data) => {
              const parkData = data[notification.park];
              sendNotification(notification, parkData).then(() => {
                // Update the notification state to called
                const updatedNotifications = [...notifications];
                updatedNotifications[index] = {
                  ...notification,
                  called: true, // Mark as called
                };
                setNotifications(updatedNotifications);

                localStorage.setItem(
                  "notificationList",
                  JSON.stringify(updatedNotifications)
                );
                console.log("Updated notifications:", updatedNotifications);
              });
            });
          }
        }
      });
    }, 5000); // Check every 5 sec

    return () => clearInterval(timer); // Cleanup on component unmount
  }, [notifications]);

  const sendNotification = async (
    notification: Notification,
    parkData: ParkForecast
  ) => {
    console.log("sendNotification", notification, parkData);
    console.log("subscriptionRef", subscriptionRef.current);

    if (!subscriptionRef.current) return; // Use the ref
    const response = await fetch("/api/webPush", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscription: subscriptionRef.current, // Use the ref
        message: `Alarm for ${notification.park} at ${notification.time} with UVI of ${parkData.uvi?.value}, PSI of ${parkData.psi?.value} and 2hr weather forecast of ${parkData.forecast?.value}, hence rating of ${parkData.rating?.value} `,
      }),
    });
    if (!response.ok) {
      console.error("Failed to send notification:", response.statusText);
    }
  };

  const toggleSwitch = (index: number) => {
    const newNotifications = [...notifications];
    newNotifications[index].enabled = !newNotifications[index].enabled;
    setNotifications(newNotifications);
  };

  const openDialog = (notification: Notification | null) => {
    setSelectedNotification(notification);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setSelectedNotification(null);
    setIsDialogOpen(false);
  };

  const displayDate = (date: string[]) => {
    return date.join(", ");
  };

  if (!isClient) {
    // Prevent rendering until client-side
    return null;
  }

  return (
    <div>
      <button
        onClick={() => {
          openDialog(null);
        }}
        className="fixed bottom-24 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg"
      >
        <Plus size={24} />
      </button>

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
            <div onClick={() => openDialog(notification)} className="w-full">
              <p className="text-4xl font-semibold">{notification.time}</p>
              <p>
                {notification.park}
                {notification.date.length > 0 ? "," : ""}{" "}
                {displayDate(notification.date)}
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
      <NotificationDialog
        notification={selectedNotification}
        setNotifications={setNotifications}
        onClose={closeDialog}
        isOpen={isDialogOpen}
      />
    </div>
  );
};

export default NotificationConfig;
