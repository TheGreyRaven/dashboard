"use client";
import Image from "next/image";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const PlayerEconomyClient = ({ data }: { data: any }) => {
  console.log(data);
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-baseline">
          <h2 className="text-3xl font-bold tracking-tight">
            Players Economy Graph
          </h2>
          <Image
            src="/emoji/Money-Bag.png"
            alt="Money Bag"
            width="32"
            height="32"
            className="ml-2"
            priority
            unoptimized
          />
        </div>
        <div>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Last 24 hours</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart width={500} height={300} data={data}>
                  <CartesianGrid className="opacity-25" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(value: string) => {
                      const date = new Date(value);
                      return `${date.getHours()}:${date.getMinutes()}`;
                    }}
                  />
                  <YAxis dataKey="total_economy" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="total_economy"
                    stroke="#ea580c"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="total_economy"
                    stroke="#ea580c"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
};

export { PlayerEconomyClient };
