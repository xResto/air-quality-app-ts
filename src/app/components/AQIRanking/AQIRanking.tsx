'use client';
import React from 'react';
// import CloseButtonMobile from '../Sidebar/CloseButtonMobile';
import SingleRankingStation from './SingleRankingStation';
import { useMainContext } from '@/store/MainContext';
import { AQIProps } from '../Display';
import { StationsProps } from '../Navigation/Navigation';

export type SingleRankingStationProps = {
  id: number;
  stCalcDate: string | null;
  stIndexLevel: { id: number; indexLevelName: string } | null;
  stSourceDataDate: string | null;
  so2CalcDate: string | null;
  so2IndexLevel: { id: number; indexLevelName: string } | null;
  so2SourceDataDate: null;
  no2CalcDate: string | null;
  no2IndexLevel: { id: number; indexLevelName: string } | null;
  no2SourceDataDate: string | null;
  pm10CalcDate: string | null;
  pm10IndexLevel: { id: number; indexLevelName: string } | null;
  pm10SourceDataDate: string | null;
  pm25CalcDate: string | null;
  pm25IndexLevel: { id: number; indexLevelName: string } | null;
  pm25SourceDataDate: string | null;
  o3CalcDate: string | null;
  o3IndexLevel: { id: number; indexLevelName: string } | null;
  o3SourceDataDate: string | null;
  stIndexStatus: boolean;
  stIndexCrParam: string | null;
};

const AQIranking = ({
  AQI,
  stations,
}: {
  AQI: AQIProps;
  stations: StationsProps | undefined;
}) => {
  const { isMobileRankingOpen } = useMainContext();

  const sortedAQI = AQI.filter((entry) => entry.stIndexLevel !== null).sort(
    (a: SingleRankingStationProps, b: SingleRankingStationProps) => b.stIndexLevel!.id - a.stIndexLevel!.id
  );

  return (
    <div className={`${isMobileRankingOpen ? 'block' : 'hidden sm:block'}`}>
      <div className='flex gap-1 mb-2'>
        {/* <CloseButtonMobile /> */}
        <div className='flex flex-grow justify-center items-center text-xl sm:text-2xl font-semibold text-center'>
          Ranking jakości powietrza
        </div>
        <div className='h-8 w-8 sm:hidden'></div>
      </div>
      <span className='border border-blue2 mb-2 block'></span>
      <ul>
        {sortedAQI.map((entry:SingleRankingStationProps) => {
         if (!stations) return null;
          const station = stations.find((s) => s.id === entry.id);
          return (
            <SingleRankingStation
              key={entry.id}
              entry={entry}
              station={station}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default AQIranking;
