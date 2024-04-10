"use client";

import Image from "next/image";
import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { IconAlertTriangle } from "@tabler/icons-react";

const colors = [
  "#4EB3E5",
  "#8ED081",
  "#F9A03F",
  "#B68CB8",
  "#F76969",
  "#2E5BAC",
  "#3C814A",
  "#E08E4E",
  "#6F4D75",
  "#AC3E3E",
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    const reversed = payload.slice().reverse();
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm px-4 py-2">
        {reversed.map((ele: any, index: any) => (
          <>
            <p
              className="text-sm"
              key={index}
              style={{
                color: ele.color,
              }}
            >
              {ele.name}
              <span className="text-sm text-white">
                :{" "}
                {new Intl.NumberFormat("sv-SE", {
                  style: "currency",
                  currency: "SEK",
                  notation: "standard",
                }).format(ele.payload.total_economy)}
              </span>
            </p>
            <Separator className="my-2" />
          </>
        ))}
        <span className="text-xs italic">
          {new Date(label).toLocaleString()}
        </span>
      </div>
    );
  }
  return null;
};

const formatYAxis = (economy: number) => {
  return new Intl.NumberFormat("sv-SE", {
    notation: "compact",
  })
    .format(economy)
    .toString();
};

/**
 * TODO: The timestamp is wrong which results in duplicates and thus rendering wrong data on hover, something with duplicate category something
 * https://stackoverflow.com/questions/57359903/recharts-tooltip-displays-same-value
 */

const PlayerEconomyClient = ({ data }: { data: any }) => {
  const characterData = useMemo(() => {
    const characterMap = new Map();

    data.forEach((item: any) => {
      const { character_name, timestamp, total_economy } = item;
      if (!characterMap.has(character_name)) {
        characterMap.set(character_name, []);
      }
      characterMap
        .get(character_name)
        .push({ timestamp: new Date(timestamp).getTime(), total_economy });
    });

    return Array.from(characterMap).map(([name, points], index) => ({
      name,
      points,
      color: colors[index],
    }));
  }, [data]);

  const minX = Math.min(
    ...data.map((item: any) => new Date(item.timestamp).getTime())
  );

  const maxX = Math.max(
    ...data.map((item: any) => new Date(item.timestamp).getTime())
  );

  console.log(characterData);

  return (
    <ScrollArea>
      <div className="flex-1 space-y-4 pt-6">
        <Alert className="border-red-600">
          <IconAlertTriangle color="#721718" className="h-4 w-4" />
          <AlertTitle>Warning!</AlertTitle>
          <AlertDescription>
            There is an issue with the hovering results and thus showing
            incorrent data, but the graph itself shows correct data.
          </AlertDescription>
        </Alert>
        <div className="flex items-baseline">
          <h2 className="text-3xl font-bold tracking-tight">Players Economy</h2>
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
              <CardTitle>Top 10 richest</CardTitle>
            </CardHeader>
            <CardContent className="h-[450px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart height={300} data={characterData}>
                  <CartesianGrid className="opacity-25" />
                  <XAxis
                    dataKey="timestamp"
                    allowDuplicatedCategory={false}
                    type="number"
                    domain={[minX, maxX]}
                    tickFormatter={(unixTime) =>
                      new Date(unixTime).toLocaleTimeString("sv-SE", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    }
                  />
                  <YAxis
                    width={50}
                    dataKey="total_economy"
                    tickFormatter={formatYAxis}
                  />
                  <Tooltip
                    cursor={{ fillOpacity: 0.1 }}
                    content={
                      <CustomTooltip active={false} payload={[]} label={""} />
                    }
                  />
                  {characterData.map((character, index) => (
                    <Line
                      key={index}
                      type="monotone"
                      dataKey="total_economy"
                      data={character.points}
                      name={character.name}
                      stroke={character.color}
                      strokeWidth={2}
                      activeDot={{ r: 6 }}
                    />
                  ))}
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
