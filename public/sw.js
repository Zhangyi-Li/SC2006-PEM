/** @format */

self.addEventListener("push", function (event) {
  const data = event.data?.json();
  event.waitUntil(
    self.registration.showNotification(data.title || "Notification", {
      body: data.body || "Something happened!",
      icon: "/icon.png",
    })
  );
});
