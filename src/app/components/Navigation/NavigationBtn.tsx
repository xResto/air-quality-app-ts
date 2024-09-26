'use client';
import React from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import NavigationTooltip from './NavigationTooltip';
import { deleteQueryString } from '@/utils/queryString';
import { useMainContext } from '@/store/MainContext';

type NavigationBtnProps = {
  content: string;
  bookmarkName: string;
  iconSrc: string;
  iconAlt: string;
};

const NavigationBtn = ({
  content,
  bookmarkName,
  iconSrc,
  iconAlt,
}: NavigationBtnProps) => {
  const {
    setBookmark,
    setIsMarkerSelected,
    setSelectedStationID,
    setSelectedPollutant,
    setIsRaportActive,
    setIsSidebarOpen,
    setIsLoading,
  } = useMainContext();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <NavigationTooltip content={content}>
      <div
        className={`${
          bookmarkName === 'ranking' ? 'hidden sm:flex' : 'flex'
        } w-full h-16 sm:h-20 justify-center content-center p-2 lg:p-4 hover:bg-blue0v2 hover:cursor-pointer transition-colors`}
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
          setBookmark(bookmarkName);
          setIsLoading(false);
          setIsMarkerSelected(false);
          setSelectedStationID(null);
          setSelectedPollutant('');
          setIsRaportActive(false);
          bookmarkName === 'ranking'
            ? setIsSidebarOpen(false)
            : setIsSidebarOpen(true);
        }}
      >
        <Image
          src={iconSrc}
          alt={iconAlt}
          width={50}
          height={50}
          className='w-auto h-auto'
        />
      </div>
    </NavigationTooltip>
  );
};

export default NavigationBtn;
