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
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
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
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart width={500} height={300} data={data}>
                  <CartesianGrid className="opacity-25" />
                  <XAxis dataKey="timestamp" />
                  <YAxis tick={false} hide />
                  <Tooltip
                    content={
                      <CustomTooltip active={false} payload={[]} label={""} />
                    }
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

export { ServerGraph };
