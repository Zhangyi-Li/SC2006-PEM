/** @format */

//https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast
//https://api-open.data.gov.sg/v2/real-time/api/psi
//https://api-open.data.gov.sg/v2/real-time/api/uv

/** @format */

import { NextRequest, NextResponse } from "next/server";
import { ParkData } from "@/lib/parks";

interface UVData {
  value: number;
}

interface PSIData {
  [region: string]: number;
}

interface Forecast {
  area: string;
  forecast: string;
}

interface ParkForecast {
  uvi: { value: number | null; color: string } | null;
  psi: { value: number | null; color: string } | null;
  forecast: { value: string | null; color: string } | null;
  rating: { value: number | null; color: string } | null;
}

interface RequestBody {
  ratingConfig: {
    [key: string]: {
      label: string;
      color: string;
      defaultValue: number;
      userValue: number;
      range?: { min: number; max: number };
    }[];
  };
}

export async function POST(req: NextRequest) {
  try {
    var uvData: UVData | null = null;
    var psiData: PSIData | null = null;
    var forecastData: Forecast[] | null = null;

    const { ratingConfig }: RequestBody = await req.json();

    // fetch data from DATA.GOV API
    const responseUV = await fetch(
      "https://api-open.data.gov.sg/v2/real-time/api/uv"
    );
    const dataUV = await responseUV.json();
    if (responseUV.ok) {
      // if dataUV.code === 0, then retrieve the dataUV.data.records[0].index[0]
      if (dataUV.code === 0) {
        uvData = dataUV.data.records[0].index[0];
      }
    }

    const responsePSI = await fetch(
      "https://api-open.data.gov.sg/v2/real-time/api/psi"
    );
    const dataPSI = await responsePSI.json();
    if (responsePSI.ok) {
      if (dataPSI.code === 0) {
        psiData = dataPSI.data.items[0].readings.psi_twenty_four_hourly;
      }
    }

    const responseForecast = await fetch(
      "https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast"
    );
    const dataForecast = await responseForecast.json();
    if (responseForecast.ok) {
      if (dataForecast.code === 0) {
        forecastData = dataForecast.data.items[0].forecasts as Forecast[];
      }
    }

    //base on parkData, i want each park to be link to the uvData, psiData and forecastData
    const parkData = Object.keys(ParkData).reduce(
      (acc: { [key: string]: ParkForecast }, park) => {
        const forecast = forecastData
          ? forecastData.find((f: Forecast) => f.area === ParkData[park].area)
          : null;

        const uvi = uvData ? uvData.value : null;
        const psi = psiData
          ? psiData[ParkData[park].region.toLowerCase()]
          : null;

        const uviConfig = uvData
          ? ratingConfig["UVI"].find(
              (item) =>
                item.range &&
                (uvi || uvi == 0) &&
                uvi >= item.range.min &&
                uvi <= item.range.max
            )
          : null;

        const psiConfig = ratingConfig["PSI"].find(
          (item) =>
            item.range &&
            (psi || psi == 0) &&
            psi >= item.range.min &&
            psi <= item.range.max
        );

        const forecastConfig = ratingConfig["WEATHER FORECAST"].find(
          (item) => item.label === forecast?.forecast
        );

        //calculate rating base on ratingConfig
        const rating =
          5 +
          (uviConfig ? uviConfig.userValue : 0) +
          (psiConfig ? psiConfig.userValue : 0) +
          (forecastConfig ? forecastConfig.userValue : 0);

        acc[park] = {
          uvi: uvData
            ? { value: uvData.value, color: uviConfig?.color || "" }
            : null,
          psi: psiData ? { value: psi, color: psiConfig?.color || "" } : null,
          forecast: forecast
            ? { value: forecast.forecast, color: forecastConfig?.color || "" }
            : null,
          rating: {
            value: rating,
            color:
              rating <= 2
                ? "text-red-500"
                : rating <= 4
                ? "text-orange-500"
                : "text-green-500",
          },
        };
        return acc;
      },
      {}
    );

    return NextResponse.json(parkData);
  } catch (error) {
    console.error("Error fetching DATA.GOV API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
