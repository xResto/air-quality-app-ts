import React from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import NavigationTooltip from './NavigationTooltip';
import haversineDistance from 'haversine-distance';
import { useMainContext } from '@/store/MainContext';
import { StationsProps } from './Navigation';
import { AQIProps } from '../Display';

const NearestStation = ({
  stations,
  AQI,
}: {
  stations: StationsProps;
  AQI: AQIProps;
}) => {
  const {
    setBookmark,
    setIsLoading,
    setIsMarkerSelected,
    setSelectedStationID,
    setSelectedPollutant,
    setIsRaportActive,
    setIsSidebarOpen,
    setUserClosestStation,
  } = useMainContext();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const findNearestStation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const userCoordinates = { latitude, longitude };

      let minHaversineDistance = Number.MAX_VALUE;
      let idx = -1;
      let stationID = -1;
      let stationAQI = '-1';

      if (latitude !== 0 && longitude !== 0) {
        stations.forEach((station, index) => {
          const stationCoordinates = {
            latitude: parseFloat(station.gegrLat),
            longitude: parseFloat(station.gegrLon),
          };
          const distance = haversineDistance(
            stationCoordinates,
            userCoordinates
          );

          if (distance < minHaversineDistance) {
            minHaversineDistance = distance;
            idx = index;
          }
        });

        if (idx !== -1) {
          stationID = stations[idx].id;

          const thisStation = AQI.find(
            (aqiStation) => aqiStation.id === stationID
          );
          if (thisStation && thisStation.stIndexLevel) {
            stationAQI = thisStation.stIndexLevel.id;
          }

          if (searchParams.get('stationID') !== stationID.toString()) {
            setIsLoading(true);
            setBookmark('station');
            setIsMarkerSelected(true);
            setSelectedStationID(stationID);
            setSelectedPollutant('');
            setIsRaportActive(false);
            setIsSidebarOpen(true);

            const params = new URLSearchParams(searchParams);
            params.delete('sensorID');
            params.delete('dateFrom');
            params.delete('dateTo');
            params.set('stationID', stationID.toString());
            router.push(`${pathname}?${params.toString()}`);
          } else {
            setIsLoading(false);
            setUserClosestStation(stationID);
          }
        }
      }
    });
  };

  return (
    <NavigationTooltip content='Zlokalizuj najbliższą stację'>
      <div
        className='w-full h-16 sm:h-20 flex justify-center content-center p-2 lg:p-4 hover:bg-blue0v2 hover:cursor-pointer transition-colors'
        onClick={findNearestStation}
      >
        <Image
          src='/user-location.svg'
          alt='Ikonka pinezki lokalizacji'
          width={44}
          height={44}
          className='w-auto h-auto'
        />
      </div>
    </NavigationTooltip>
  );
};

export default NearestStation;
