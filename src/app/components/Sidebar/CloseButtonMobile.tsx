import React from 'react';
import Image from 'next/image';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { deleteQueryString } from '@/utils/queryString';
import { useMainContext } from '@/store/MainContext';

const CloseButtonMobile = () => {
  const {
    bookmark,
    setIsSidebarOpen,
    setIsMarkerSelected,
    setSelectedStationID,
    setIsRaportActive,
    setBookmark,
  } = useMainContext();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <Image
      src='close.svg'
      width={50}
      height={50}
      alt='Ikonka X'
      className={`sm:hidden h-8 w-8 ${
        bookmark === 'ranking' ||
        bookmark === 'favorites' ||
        bookmark === 'credits' ||
        bookmark === 'info'
          ? 'block'
          : 'absolute top-2 left-4'
      }`}
      onClick={() => {
        deleteQueryString({
          namesToDelete: [
            'stationID',
            'stationAQI',
            'sensorID',
            'dateFrom',
            'dateTo',
          ],
          router,
          pathname,
          searchParams,
        });
        setIsSidebarOpen(false);
        setIsMarkerSelected(false);
        setSelectedStationID(null);
        setIsRaportActive(false);
        setBookmark('ranking');
      }}
    />
  );
};

export default CloseButtonMobile;
