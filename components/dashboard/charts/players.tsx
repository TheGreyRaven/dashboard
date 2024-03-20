"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import useSWR from "swr";

import { Skeleton } from "@/components/ui/skeleton";
import { fetcher } from "@/lib/utils";

interface PlayerData {
  id?: number;
  players_online: number;
  timestamp: string;
}

const PlayerCharts = () => {
  const [playerArray, setPlayerArray] = useState<PlayerData[]>([]);
  const { data: players }: { data: PlayerData[] } = useSWR(
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
      const date = new Date(player.timestamp).getHours().toLocaleString();

      playerArray.push({
        players_online: player.players_online,
        timestamp: String(date).concat(":00"),
      });
    });

    setPlayerArray(playerArray);
  }, [players]);
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
