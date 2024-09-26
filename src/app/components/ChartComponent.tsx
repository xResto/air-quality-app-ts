import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js';
import { SensorDataProps } from './Sidebar/Sidebar';
import { SingleSensorProps } from './Sidebar/Sidebar';
import { SensorData } from '@/lib/getAirQualityData';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

// interface ChartComponentProps {
//   sensorData: SensorDataProps;
// }

const ChartComponent = ({
  sensorData,
}: {
  sensorData: (SensorData | null)[] | null;
}) => {
  if (!sensorData || sensorData.length === 0) {
    return <p>No sensor data available</p>;
  }

  const filteredSensorData = sensorData.filter(
    (sensor): sensor is SingleSensorProps =>
      sensor !== null &&
      sensor.key !== 'CO' &&
      sensor.key !== 'C6H6' &&
      sensor.values.length !== 0
  );

  const getDataset = filteredSensorData.map((sensor: SingleSensorProps) => {
    const key = sensor.key;
    let colorRanges: number[] = [];

    //  const valuesArray = sensor.values.map((entry) => entry.value);
    //  const nullFlags = sensor.values.map((entry) => entry.value === null);
    const valuesArray = sensor.values
      .map((entry) => entry.value)
      .filter((value): value is number => value !== null);

    const maxSensorValue =
      valuesArray.length > 0 ? Math.max(...valuesArray) : 0;

    switch (key) {
      case 'PM10':
        colorRanges = [20, 50, 80, 110, 150, maxSensorValue + 1];
        break;
      case 'PM2.5':
        colorRanges = [13, 35, 55, 75, 110, maxSensorValue + 1];
        break;
      case 'O3':
        colorRanges = [70, 120, 150, 180, 240, maxSensorValue + 1];
        break;
      case 'NO2':
        colorRanges = [40, 100, 150, 230, 400, maxSensorValue + 1];
        break;
      case 'SO2':
        colorRanges = [50, 100, 200, 350, 500, maxSensorValue + 1];
        break;
      default:
        colorRanges = [];
    }

    const colorPalette = [
      '#108404',
      '#18cc04',
      '#f4f804',
      '#ff7c04',
      '#e00404',
      '#98046c',
    ];

    const color = sensor.values.map((entry) => {
      const value = entry.value ?? 0;
      const colorIndex = colorRanges.findIndex((range) => value <= range);
      return entry.value != null ? colorPalette[colorIndex] : '#888484';
    });

    const data = {
      labels: sensor.values.map((entry) => entry.date),
      datasets: [
        {
          data: sensor.values.map((entry) =>
            entry.value != null ? entry.value : 0.07 * maxSensorValue
          ),
          backgroundColor: color,
        },
      ],
    };

    const reformatNonNullSensorDataValue = (index: number) => {
      const [date, time] = sensor.values[index].date.split(' ');
      const [day, month] = date.split('.');
      return `${day}.${month}, ${time.slice(0, -3)}`;
    };

    const latestDate = `Dziś, ${sensor.values[0].date.slice(-8, -3)}`;
    const middleDateIndex = Math.floor(sensor.values.length / 2);
    const middleDate = reformatNonNullSensorDataValue(middleDateIndex);
    const oldestDate = reformatNonNullSensorDataValue(sensor.values.length - 1);
    return {
      key,
      data,
      latestDate,
      middleDate,
      oldestDate,
      valuesArray,
      nullFlags: sensor.values.map((entry) => entry.value === null),
    };
  });

  const dataset = getDataset;

  return (
    <section>
      {dataset.map(
        (
          { key, data, latestDate, middleDate, oldestDate, nullFlags },
          index
        ) => (
          <div key={index}>
            <Bar
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: key,
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        if (nullFlags[context.dataIndex]) {
                          return 'Brak pomiaru';
                        }
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    display: false,
                  },
                },
              }}
              data={data}
            />
            <div className='flex justify-between text-xs mb-2'>
              <p>{latestDate}</p>
              <p>{middleDate}</p>
              <p>{oldestDate}</p>
            </div>
          </div>
        )
      )}
    </section>
  );
};

export default ChartComponent;
