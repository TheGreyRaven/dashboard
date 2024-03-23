"use client";

import Image from "next/image";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm px-4 py-2">
        {payload.map((ele: any, index: any) => (
          <span className="text-sm" key={index}>
            Economy:{" "}
            {new Intl.NumberFormat("sv-SE", {
              style: "currency",
              currency: "SEK",
              notation: "standard",
            }).format(ele.value)}
          </span>
        ))}
        <br />
        <span className="text-xs">Time: {label}</span>
      </div>
    );
  }
  return null;
};

const ServerGraph = ({ data }: { data: any }) => {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 pt-6">
        <div className="flex items-baseline">
          <h2 className="text-3xl font-bold tracking-tight">
            Server Economy Graph
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
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid className="opacity-25" />
                  <XAxis
                    dataKey="time"
                    stroke="#888888"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fillOpacity: 0.1 }}
                    content={
                      <CustomTooltip active={false} payload={[]} label={""} />
                    }
                  />
                  <YAxis
                    width={60}
                    dataKey="total_economy"
                    type="number"
                    domain={[0, "dataMax + 3000000"]}
                    tickFormatter={(value) => {
                      return new Intl.NumberFormat("sv-SE", {
                        notation: "compact",
                      })
                        .format(value)
                        .toString();
                    }}
                    stroke="#888888"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Bar
                    dataKey="total_economy"
                    fill="#ea580c"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
};

export { ServerGraph };
