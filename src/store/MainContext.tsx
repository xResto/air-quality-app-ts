'use client';

import React, { createContext, useContext, useState } from 'react';

interface MainContextType {
  bookmark: string;
  setBookmark: React.Dispatch<React.SetStateAction<string>>;
  coordinate: { lat: number; lng: number };
  setCoordinate: React.Dispatch<
    React.SetStateAction<{ lat: number; lng: number }>
  >;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  userClosestStation: number | null;
  setUserClosestStation: React.Dispatch<React.SetStateAction<number | null>>;
  isMarkerSelected: boolean;
  setIsMarkerSelected: React.Dispatch<React.SetStateAction<boolean>>;
  selectedStationID: number | null;
  setSelectedStationID: React.Dispatch<React.SetStateAction<number | null>>;
  isMapLoaded: boolean;
  setIsMapLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  selectedPollutant: string;
  setSelectedPollutant: React.Dispatch<React.SetStateAction<string>>;
  isRaportActive: boolean;
  setIsRaportActive: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileRankingOpen: boolean;
  setIsMobileRankingOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDateFrom: string | null;
  setSelectedDateFrom: React.Dispatch<React.SetStateAction<string | null>>;
  selectedDateTo: string | null;
  setSelectedDateTo: React.Dispatch<React.SetStateAction<string | null>>;
  findClosest: boolean;
  setFindClosest: React.Dispatch<React.SetStateAction<boolean>>;
}

const MainContext = createContext<MainContextType | undefined>(undefined);

export default function MainContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [coordinate, setCoordinate] = useState({
    lat: 52.077,
    lng: 19,
  });
  const [zoom, setZoom] = useState(7);
  const [bookmark, setBookmark] = useState('ranking');
  const [isLoading, setIsLoading] = useState(false);
  const [userClosestStation, setUserClosestStation] = useState<number | null>(null);
  const [isMarkerSelected, setIsMarkerSelected] = useState(false);
  const [selectedStationID, setSelectedStationID] = useState<number | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedPollutant, setSelectedPollutant] = useState('');
  const [isRaportActive, setIsRaportActive] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileRankingOpen, setIsMobileRankingOpen] = useState(false);
  const [selectedDateFrom, setSelectedDateFrom] = useState<string | null>(null);
  const [selectedDateTo, setSelectedDateTo] = useState<string | null>(null); 
  const [findClosest, setFindClosest] = useState(false);

  return (
    <MainContext.Provider
      value={{
        bookmark,
        setBookmark,
        coordinate,
        setCoordinate,
        zoom,
        setZoom,
        isLoading,
        setIsLoading,
        userClosestStation,
        setUserClosestStation,
        isMarkerSelected,
        setIsMarkerSelected,
        selectedStationID,
        setSelectedStationID,
        isMapLoaded,
        setIsMapLoaded,
        selectedPollutant,
        setSelectedPollutant,
        isRaportActive,
        setIsRaportActive,
        isSidebarOpen,
        setIsSidebarOpen,
        isMobileRankingOpen,
        setIsMobileRankingOpen,
        selectedDateFrom,
        setSelectedDateFrom,
        selectedDateTo,
        setSelectedDateTo,
        findClosest,
        setFindClosest,
      }}
    >
      {children}
    </MainContext.Provider>
  );
}

export function useMainContext() {
  const context = useContext(MainContext);

  if (context === undefined) {
    throw new Error('useArrowFlag must be used within a MainContextProvider');
  }

  return context;
}
