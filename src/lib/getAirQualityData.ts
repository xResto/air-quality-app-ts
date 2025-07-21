export type Station = {
  id: number;
  stationName: string;
  gegrLat: string;
  gegrLon: string;
  city: {
    name: string;
  };
};

// type AQIData = {
//   id: number;
//   stCalcDate: string;
//   stIndexLevel: {
//     id: number;
//     indexLevelName: string;
//   };
//   stSourceDataDate: string;
// };

type SensorIDData = {
  id: number;
  stationId: number;
  param: {
    paramName: string;
    paramFormula: string;
    paramCode: string;
    idParam: number;
  };
};

export type SensorData = {
  key: string;
  values: {
    date: string;
    value: number | null;
  }[];
};

export const getAllStations = async () => {
  try {
    const res = await fetch(
      'https://api.gios.gov.pl/pjp-api/v1/rest/station/findAll',
      {
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch stations. Status: ${res.status}`);
    }

    const stations = await res.json();

    const stationsID = stations.map((station: Station) => station.id);

    return { stations, stationsID };
  } catch (error) {
    console.error('Error fetching stations:', error);
    return null;
  }
};

export const getAqiData = async (stationsID: number[]) => {
  if (!stationsID) return null;
  try {
    const aqiRequests = stationsID.map(async (stationID) => {
      if (!stationID) return null;

      const res = await fetch(
        `https://api.gios.gov.pl/pjp-api/v1/rest/aqindex/getIndex/${stationID}`,
        {
          next: { revalidate: 900 },
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch AQI data. Status: ${res.status}`);
      }

      const data = await res.json();

      return data;
    });

    const aqi = await Promise.all(aqiRequests);

    return aqi;
  } catch (error) {
    console.error('Error fetching stationsID:', error);
    return null;
  }
};

export const getSensorID = async (stationID: number) => {
  if (!stationID) return null;

  try {
    const res = await fetch(
      `https://api.gios.gov.pl/pjp-api/v1/rest/station/sensors/${stationID}`,
      {
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch sensorIDs. Status: ${res.status}`);
    }

    const sensorIDsData = await res.json();

    const sensorIDs = sensorIDsData.map((data: SensorIDData) => data.id);

    return { sensorIDsData, sensorIDs };
  } catch (error) {
    console.error('Error fetching sensorID:', error);
    return null;
  }
};

export const getSensorData = async (sensorIDs: number[]) => {
  if (!sensorIDs) return null;

  const reformatDateString = (dateStr: string) => {
    const dateTimeParts = dateStr.split(' ');
    const dateParts = dateTimeParts[0].split('-');
    const timePart = dateTimeParts[1];

    const reformattedDate = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;

    return `${reformattedDate} ${timePart}`;
  };

  const sensorDataRequests = sensorIDs.map(async (sensorID) => {
    try {
      const res = await fetch(
        `https://api.gios.gov.pl/pjp-api/v1/rest/data/getData/${sensorID}`,
        {
          cache: 'no-store',
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch sensor data. Status: ${res.status}`);
      }

      const data: SensorData = await res.json();

      if (data && data.values) {
        data.values.forEach((entry) => {
          if (entry.date) {
            entry.date = reformatDateString(entry.date);
          }
        });
      }

      return data;
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      return null;
    }
  });

  const sensorData = await Promise.all(sensorDataRequests);

  const order = ['PM10', 'PM2.5', 'O3', 'NO2', 'SO2', 'C6H6', 'CO'];

  //   sensorData.sort((a, b) => {
  //     if (!a || !b) return null;
  //     return order.indexOf(a.key) - order.indexOf(b.key);
  //   });

  sensorData.sort((a, b) => {
    if (!a || !b) {
      // Handle null cases: you might decide to treat nulls as greater or lesser
      // Here, let's assume that nulls are considered greater and should be sorted to the end
      return !a ? 1 : -1;
    }

    return order.indexOf(a.key) - order.indexOf(b.key);
  });

  return sensorData;
};

type GenerateRaportType = {
  sensorID: number;
  dateFrom: string;
  dateTo: string;
};

export const generateRaport = async ({
  sensorID,
  dateFrom,
  dateTo,
}: GenerateRaportType) => {
  try {
    if (!sensorID) {
      return [];
    }

    let allData: any[] = [];
    let page = 0;
    let totalPages;

    do {
      const res = await fetch(
        `https://api.gios.gov.pl/pjp-api/v1/rest/archivalData/getDataBySensor/${sensorID}?size=500&dateFrom=${dateFrom}&dateTo=${dateTo}&page=${page}`
      );

      const data = await res.json();

      if (data.error_code) {
        console.log('Wykorzystano limit zapytań. Spróbuj ponownie za chwilę.');
        return 'error';
      }

      if (!data.error_code) {
        allData = allData.concat(data['Lista archiwalnych wyników pomiarów']);
        totalPages = data.totalPages;
      }

      page++;
    } while (page < totalPages);

    return allData;
  } catch (error) {
    console.error('Error fetching reports:', error);
    return 'error';
  }
};
