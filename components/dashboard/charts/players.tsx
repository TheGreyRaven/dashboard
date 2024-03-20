"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import useSWR from "swr";

import { Skeleton } from "@/components/ui/skeleton";
import { fetcher } from "@/lib/utils";

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

interface PlayerData {
  id?: number;
  players_online: number;
  timestamp: string;
}

const PlayerCharts = () => {
  const [playerArray, setPlayerArray] = useState<PlayerData[]>([]);
  const {
    data: players,
    error,
    isLoading,
  }: { data: PlayerData[]; error: any; isLoading: boolean } = useSWR(
    "/api/fivem/players-online",
    fetcher,
    { refreshInterval: 1000 }
  );

  useEffect(() => {
    const playerArray: { players_online: number; timestamp: string }[] = [];
    // @ts-expect-error
    const sorted = players?.sort((x, y) => {
      return new Date(x.timestamp) < new Date(y.timestamp);
    });

    sorted?.map((player: PlayerData) => {
      const date = (
        "0" + (new Date(player.timestamp).getHours() % 12 || 12)
      ).slice(-2);

      playerArray.push({
        players_online: player.players_online,
        timestamp: String(date).concat(":00"),
      });
    });

    setPlayerArray(playerArray);
  }, [players]);

  if (isLoading) {
    return <Skeleton className="w-[100%] h-[350px]" />;
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={playerArray}>
        <XAxis
          dataKey="timestamp"
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
        <Bar dataKey="players_online" fill="#ea580c" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export { PlayerCharts };
