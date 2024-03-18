"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  {
    time: "01:00",
    number: Math.floor(Math.random() * 64) + 1,
  },
  {
    time: "02:00",
    number: Math.floor(Math.random() * 64) + 1,
  },
  {
    time: "03:00",
    number: Math.floor(Math.random() * 64) + 1,
  },
  {
    time: "04:00",
    number: Math.floor(Math.random() * 64) + 1,
  },
  {
    time: "05:00",
    number: Math.floor(Math.random() * 64) + 1,
  },
  {
    time: "06:00",
    number: Math.floor(Math.random() * 64) + 1,
  },
  {
    time: "07:00",
    number: Math.floor(Math.random() * 64) + 1,
  },
  {
    time: "08:00",
    number: Math.floor(Math.random() * 64) + 1,
  },
  {
    time: "09:00",
    number: Math.floor(Math.random() * 64) + 1,
  },
  {
    time: "10:00",
    number: Math.floor(Math.random() * 64) + 1,
  },
  {
    time: "11:00",
    number: Math.floor(Math.random() * 64) + 1,
  },
  {
    time: "12:00",
    number: Math.floor(Math.random() * 64) + 1,
  },
  {
    time: "13:00",
    number: Math.floor(Math.random() * 64) + 1,
  },
  {
    time: "14:00",
    number: Math.floor(Math.random() * 64) + 1,
  },
  {
    time: "15:00",
    number: Math.floor(Math.random() * 64) + 1,
  },
  {
    time: "16:00",
    number: Math.floor(Math.random() * 64) + 1,
  },
  {
    time: "17:00",
    number: Math.floor(Math.random() * 64) + 1,
  },
  {
    time: "18:00",
    number: Math.floor(Math.random() * 64) + 1,
  },
  {
    time: "19:00",
    number: Math.floor(Math.random() * 64) + 1,
  },
  {
    time: "20:00",
    number: Math.floor(Math.random() * 64) + 1,
  },
  {
    time: "21:00",
    number: Math.floor(Math.random() * 64) + 1,
  },
  {
    time: "22:00",
    number: Math.floor(Math.random() * 64) + 1,
  },
  {
    time: "23:00",
    number: Math.floor(Math.random() * 64) + 1,
  },
  {
    time: "00:00",
    number: Math.floor(Math.random() * 64) + 1,
  },
];

const PlayerCharts = () => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="time"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar dataKey="number" fill="#ea580c" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export { PlayerCharts };
