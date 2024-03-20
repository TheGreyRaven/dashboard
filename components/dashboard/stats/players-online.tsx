"use client";

import { Loader2 } from "lucide-react";
import useSWR from "swr";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FullSkeleton } from "@/components/ui/full-skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { fetcher } from "@/lib/utils";
import { LiveServerObject, PlayerObject } from "@/types";
import { IconAlertTriangle, IconCircleFilled } from "@tabler/icons-react";

const pingThreshold = (ping: number) => {
  if (ping >= 0 && ping <= 60) {
    return "text-green-500";
  }

  if (ping >= 60 && ping <= 80) {
    return "text-yellow-500";
  }

  return "text-red-500";
};

const PlayersOnline = () => {
  const {
    data,
    error,
    isLoading,
  }: {
    data: LiveServerObject;
    error: any;
    isLoading: boolean;
  } = useSWR("/api/fivem/players-online?live=true", fetcher, {
    refreshInterval: 120,
  });

  if (error) {
    console.error(error);
    return (
      <Card className="col-span-4 md:col-span-3">
        <CardHeader>
          <CardTitle>Online Players</CardTitle>
          <CardDescription>Failed to update</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <IconAlertTriangle className="h-4 w-4" color="rgb(220 38 38)" />
            <AlertTitle className="text-sm">Error!</AlertTitle>
            <AlertDescription>
              <p className="text-xs">Could not fetch online players</p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="col-span-4 md:col-span-3">
        <CardHeader>
          <CardTitle>Online Players</CardTitle>
          <CardDescription>Fetching data, please wait...</CardDescription>
        </CardHeader>
        <CardContent>
          <FullSkeleton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-4 md:col-span-3">
      <CardHeader>
        <CardTitle>Online Players</CardTitle>
        <CardDescription>
          Currently: {data?.players.length ?? 0}/90
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80" type="always">
          <div className="space-y-8 pr-4 pb-4">
            {data?.players?.map((player, key: number) => (
              <>
                <div className="flex items-center" key={key}>
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{player?.id}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 grid grid-rows-2 grid-flow-col gap-0 pr-2">
                    <p className="text-sm font-medium leading-none truncate">
                      {player?.name}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {player?.identifiers?.filter((identifier: string) => {
                        return identifier?.includes("license:");
                      })}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center">
                    <p className="font-medium">{player.ping}ms</p>{" "}
                    <IconCircleFilled
                      className={`h-4 w-4 ${pingThreshold(player.ping)} ml-2`}
                    />
                  </div>
                </div>
                {data.players.length !== key + 1 && (
                  <Separator orientation="horizontal" className="w-full" />
                )}
              </>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export { PlayersOnline };
