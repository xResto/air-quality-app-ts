import React from 'react';
import {
  getAllStations,
  getAqiData,
  getSensorID,
  getSensorData,
  generateRaport,
} from '@/lib/getAirQualityData';
import { getWeatherData } from '@/lib/getWeatherData';
import Display from './components/Display';
import { ReadonlyURLSearchParams } from 'next/navigation';
import { Station } from '@/lib/getAirQualityData';

type SearchParamsProps = {
  searchParams: ReadonlyURLSearchParams & {
    stationID?: number;
    sensorID: number;
    dateFrom?: string;
    dateTo?: string;
  };
};

export default async function Page({ searchParams }: SearchParamsProps) {
  // Map
  // const { stations, stationsID } = await getAllStations();
  const response = await getAllStations();
  const { stations, stationsID } = response || {};
  const AQI = await getAqiData(stationsID);

  // Sidebar
  const clickedStationID = searchParams?.stationID ?? '';

  const thisStation = clickedStationID
    ? stations.find((station: Station) => station.id == clickedStationID)
    : null;

  const sensorIDResult = await getSensorID(Number(clickedStationID));
  const { sensorIDsData, sensorIDs } = sensorIDResult || {};
  const sensorData = await getSensorData(sensorIDs);

  //  WeatherData
  const weatherData = thisStation
    ? await getWeatherData({
        lat: thisStation.gegrLat,
        lon: thisStation.gegrLon,
      })
    : null;

  const [resolvedSensorData, resolvedWeatherData] = await Promise.all([
    sensorData,
    weatherData,
  ]);

  // Raport
  const sensorQueryID = searchParams?.sensorID ?? '';
  const dateFrom = searchParams?.dateFrom ?? '';
  const dateTo = searchParams?.dateTo ?? '';

  const raport = await generateRaport({
    sensorID: sensorQueryID,
    dateFrom: dateFrom,
    dateTo: dateTo,
  });

  return (
    <Display
      clickedStationID={clickedStationID}
      sensorData={resolvedSensorData}
      AQI={AQI}
      stations={stations}
      thisStation={thisStation}
      weatherData={resolvedWeatherData}
      raport={raport}
      sensorIDsData={sensorIDsData}
    />
  );
}
