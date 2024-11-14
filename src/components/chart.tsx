"use client"; // if you use app dir, don't forget this line

import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface chartProps {
  type?: "column" | "line";
  label: string;
  lineSeries?: any;
  columnSeries?: any;
  showTopLabel?: boolean;
}

export function Chart({
  type = "line",
  label,
  lineSeries,
  columnSeries,
  showTopLabel = true,
}: chartProps) {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getDaysInMonth = (month: number, year: number) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(dayjs(date).format("DD-MM-YYYY"));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const categoriesColumn = getDaysInMonth(currentMonth, currentYear);

  const lineOption = {
    chart: {
      id: "apexchart-example",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: ["#041B63"],
    stroke: {
      width: [2],
    },
    xaxis: {
      categories: [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ],
    },
    yaxis: {
      labels: {
        formatter: (value: any) => `${value}`,
      },
    },
  };

  const columnOption = {
    chart: {
      height: 350,
      type: "line",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: "smooth",
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.9,
      },
    },
    xaxis: {
      // categories: categoriesColumn,
      type: "dateTime",
    },

    tooltip: {
      enabled: false, // Certifique-se de que a tooltip esteja habilitada
      onDatasetHover: {
        highlightDataSeries: true, // Evita o destaque da série de dados
      },
    },
    markers: {
      hover: {
        sizeOffset: 4, // Ajusta o tamanho do marcador ao passar o mouse
      },
    },
  };

  const generateRandomData = (length: number) => {
    return Array.from({ length }, () => Math.floor(Math.random() * 101));
  };

  return (
    <div className="lg:w-[49%] max-lg:mb-2 flex flex-col h-auto ">
      {showTopLabel && (
        <div className="h-6 flex flex-row mb-2">
          <label className="text-base text-gray-600 font-medium">{label}</label>
        </div>
      )}
      <div className="rounded-lg shadow-lg h-auto">
        <div className="overflow-x-auto">
          <div className="flex flex-grow w-full items-center justify-center">
            {type === "line" ? (
              <ApexChart
                type="bar"
                options={lineOption}
                series={lineSeries || { name: "", data: [] }}
                height={200}
                width={
                  windowSize.height > windowSize.width ||
                  windowSize.width <= 1024
                    ? (windowSize.width * 3) / 4
                    : (windowSize.width - 330) / 2
                }
              />
            ) : (
              <>
                <ApexChart
                  type="line"
                  //@ts-expect-error
                  options={columnOption}
                  series={columnSeries}
                  height={200}
                  width={
                    windowSize.height > windowSize.width ||
                    windowSize.width <= 1024
                      ? (windowSize.width * 3) / 4
                      : (windowSize.width - 330) / 2
                  }
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
