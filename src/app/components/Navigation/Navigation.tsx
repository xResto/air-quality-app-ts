'use client';
import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import NearestStation from './NearestStation';
import NavigationBtn from './NavigationBtn';
import { useMainContext } from '@/store/MainContext';
import { deleteQueryString } from '@/utils/queryString';
import { AQIProps } from '../Display';


export type StationProps = {
  id: number;
  stationName: string;
  gegrLat: string;
  gegrLon: string;
  city: {
    id: number;
    name: string;
    commune: {
      communeName: string;
      districtName: string;
      provinceName: string;
    };
  };
  addressStreet: null;
  forEach: (arg0: (arg0: any, arg1: number) => void) => void;
};

export type StationsProps = StationProps[];

const Navigation = ({
  stations,
  AQI,
}: {
  stations: StationsProps;
  AQI: AQIProps;
}) => {
  const {
    isSidebarOpen,
    setBookmark,
    setIsMarkerSelected,
    setSelectedStationID,
    setSelectedPollutant,
    setIsRaportActive,
    setIsMobileRankingOpen,
    setIsSidebarOpen,
    setIsLoading,
  } = useMainContext();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div
      className={`flex sm:flex-col sm:justify-start justify-around sm:h-full w-full sm:w-14 lg:w-20 border-t-1 sm:border-r-1 border-blue2 sm:static sm:border-0 bg-blue0 ${
        isSidebarOpen ? '' : ''
      }`}
    >
      {/* Desktop ranking icon */}
      <NavigationBtn
        content='Ranking jakości powietrza'
        bookmarkName='ranking'
        iconSrc='/rank.svg'
        iconAlt='Ikonka podium'
        // priority={true}
      />

      {/* Mobile ranking icon */}
      <div
        className='w-full h-16 sm:h-20 flex sm:hidden justify-center content-center p-2 lg:p-4 hover:bg-blue0v2 hover:cursor-pointer transition-colors'
        onClick={() => {
          deleteQueryString({
            namesToDelete: [
              'stationID',
              'stationAQI',
              'sensorID',
              'dateFrom',
              'dateTo',
            ],
            router: router,
            pathname: pathname,
            searchParams: searchParams,
          });
          setBookmark('ranking');
          setIsLoading(false);
          setIsMarkerSelected(false);
          setSelectedStationID(null);
          setSelectedPollutant('');
          setIsRaportActive(false);
          setIsSidebarOpen(true);
          setIsMobileRankingOpen(true);
        }}
      >
        <Image
          src='/rank.svg'
          alt='Ikonka podium'
          width={50}
          height={50}
          className='w-auto h-auto'
          priority={true}
        />
      </div>

      {/* Find nearest station icon */}
      <NearestStation stations={stations} AQI={AQI} />

      {/* Favorite stations */}
      <NavigationBtn
        content='Ulubione stacje'
        bookmarkName='favorites'
        iconSrc='/fav.svg'
        iconAlt='Ikonka pinezki lokalizacji z sercem'
      />

      {/* Info */}
      <NavigationBtn
        content='Informacje'
        bookmarkName='info'
        iconSrc='/info.svg'
        iconAlt='Ikonka informacji'
      />

      {/* Credits */}
      <NavigationBtn
        content='Credits'
        bookmarkName='credits'
        iconSrc='/credits.svg'
        iconAlt='Ikonka medalu'
      />
    </div>
  );
};

export default Navigation;
