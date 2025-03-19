/** @format */
"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import ParkMarkers from "./components/ParkMarkers";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const MapPage = () => {
  useEffect(() => {
    const L = require("leaflet");

    L.Icon.Default.imagePath = "/images/";
  }, []);

  return (
    <>
      <MapContainer
        center={[1.3521, 103.8198]}
        zoom={12}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ParkMarkers />
      </MapContainer>
    </>
  );
};

export default MapPage;
