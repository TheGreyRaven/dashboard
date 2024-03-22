"use client";

import moment from "moment";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useSWR from "swr";

import { fetcher } from "@/lib/utils";

interface PlayerData {
  id?: number;
  players_online: number;
  timestamp: string;
}

const PlayerList = () => {
  const { data: players }: { data: PlayerData[] } = useSWR(
    "/api/fivem/players-online",
    fetcher,
    { refreshInterval: 1000 }
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      const found = players.filter((value: any) => {
        return value.id === label;
      });

      return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm px-4 py-2">
          {payload.map((ele: any, index: any) => (
            <span className="text-sm" key={index}>
              Online: {ele.value}
            </span>
          ))}
          <br />
          <span className="text-xs">
            Time: {moment(found[0].timestamp).utc().format("YYYY-MM-DD HH:mm")}
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={players}>
        <CartesianGrid className="opacity-25" />
        <XAxis
          dataKey="id"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(id) => {
            const found = players.filter((value: any) => {
              return value.id === id;
            });

            return moment(found[0].timestamp).utc().format("HH:mm");
          }}
        />
        <Tooltip
          cursor={{ fillOpacity: 0.1 }}
          content={<CustomTooltip active={false} payload={[]} label={""} />}
        />
        <YAxis
          width={35}
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

export { PlayerList };
