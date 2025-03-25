/** @format */

import React from "react";
import dynamic from "next/dynamic";
import { ParkData } from "@/lib/parks";

type ParkObj = {
  [key: string]: {
    coordinate: [number, number];
    region: string;
    area: string;
  };
};

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

const parkCoordinates: { [key: string]: [number, number] } =
  getParkCoordinates(ParkData);

function getParkCoordinates(parkObj: ParkObj): {
  [parkName: string]: [number, number];
} {
  const parkCoordinates: { [parkName: string]: [number, number] } = {};

  for (const park in parkObj) {
    parkCoordinates[park] = parkObj[park].coordinate;
  }

  return parkCoordinates;
}

const ParkMarkers = () => {
  return (
    <>
      {Object.keys(parkCoordinates).map((park) => (
        <Marker key={park} position={parkCoordinates[park]}>
          <Popup>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                "Singapore " + park
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {park}
            </a>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default ParkMarkers;
