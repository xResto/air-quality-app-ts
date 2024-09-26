'use client';
import React from 'react';

import Navigation from './Navigation/Navigation';
import Sidebar from './Sidebar/Sidebar';
import { useMainContext } from '@/store/MainContext';
import dynamic from 'next/dynamic';
import { weatherDataProps } from './Sidebar/WeatherComponent';
import { StationsProps } from './Navigation/Navigation';
import { StationProps } from './Navigation/Navigation';
import type { SensorData } from '@/lib/getAirQualityData';

const MapComponent = dynamic(() => import('./Map/MapComponent'), {
  ssr: false,
});

type SensorIDsDataProps = {
  id: number;
  stationId: number;
  param: {
    paramName: string;
    paramFormula: string;
    paramCode: string;
    idParam: number;
  }[];
};

export type AQIProps = {
  stIndexLevel: {
    id: number;
    indexLevelName: string;
  };
  find: (arg0: (arg0: any) => boolean) => any;
  filter: (arg0: (arg0: any) => boolean) => any;
};

type DisplayProps = {
  clickedStationID: string | number;
  sensorData: (SensorData | null)[] | null;
  AQI: any;
  // AQI: AQIProps[];
  stations: StationsProps;
  thisStation: StationProps;
  weatherData: weatherDataProps;
  raport?: any;
  sensorIDsData: SensorIDsDataProps;
};

const Display = ({
  clickedStationID,
  sensorData,
  AQI,
  stations,
  thisStation,
  weatherData,
  // raport,
  sensorIDsData,
}: DisplayProps) => {
  const { isSidebarOpen } = useMainContext();

  return (
    <div className='bg-blue0 sm:flex sm:h-full'>
      <div className='hidden sm:block'>
        <Navigation stations={stations} AQI={AQI} />
      </div>
      <div className='sm:block hidden'>
        <Sidebar
          clickedStationID={+clickedStationID}
          sensorData={sensorData}
          AQI={AQI}
          stations={stations}
          thisStation={thisStation}
          weatherData={weatherData}
          // raport={raport}
          sensorIDsData={sensorIDsData}
        />
      </div>
      <div className='flex flex-col flex-grow h-[100svh]'>
        <div
          className={`sm:hidden overflow-auto ${isSidebarOpen ? '' : 'hidden'}`}
        >
          <Sidebar
            clickedStationID={+clickedStationID}
            sensorData={sensorData}
            AQI={AQI}
            stations={stations}
            thisStation={thisStation}
            weatherData={weatherData}
            // raport={raport}
            sensorIDsData={sensorIDsData}
          />
        </div>
        <MapComponent stations={stations} AQI={AQI} />
        <div className='sm:hidden '>
          <Navigation stations={stations} AQI={AQI} />
        </div>
      </div>
    </div>
  );
};

export default Display;
