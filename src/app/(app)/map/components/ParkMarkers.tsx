/** @format */

import React from "react";
import dynamic from "next/dynamic";

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

const parkCoordinates: { [key: string]: [number, number] } = {
  "Singapore Botanic Gardens": [1.3138, 103.8159],
  "Fort Canning Park": [1.2932, 103.8465],
  "MacRitchie Reservoir Park": [1.3433, 103.8271],
  "Admiralty Park": [1.4494, 103.7814],
  "Sembawang Park": [1.4617, 103.8254],
  "Lower Seletar Reservoir Park": [1.4011, 103.8138],
  "Mount Faber Park": [1.2766, 103.8198],
  "Labrador Nature Reserve": [1.2653, 103.8022],
  "Kent Ridge Park": [1.2906, 103.7843],
  "East Coast Park": [1.3039, 103.9125],
  "Pasir Ris Park": [1.3813, 103.9455],
  "Bedok Reservoir Park": [1.3375, 103.9273],
  "West Coast Park": [1.2936, 103.7654],
  "Jurong Lake Gardens": [1.3382, 103.7295],
  "Bukit Batok Nature Park": [1.3496, 103.7635],
};

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
