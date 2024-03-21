import Image from "next/image";

import { PlayerCharts } from "@/components/dashboard/charts/players-online/players";
import { PlayersOnline } from "@/components/dashboard/stats/players-online";
import { ServerEconomy } from "@/components/dashboard/stats/server-economy";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchDashboardData } from "@/lib/fetch";
import {
  IconBrandDiscord,
  IconCash,
  IconCircleFilled,
  IconUsers,
} from "@tabler/icons-react";

const getData = async () => {
  const dashboardData = await fetchDashboardData();

  return dashboardData;
};

/**
 * TODO: Move this to client component so we can use SWR to fetch data at regular interval.
 */
const setHealth = (_system: any) => {
  if (!_system) {
    return {
      services: "Offline",
      status: "All services offline",
      color: "text-red-700",
    };
  }

  let servicesOnline = 0;
  const { database, fivem, bot } = _system;

  if (database) servicesOnline++;
  if (fivem) servicesOnline++;
  if (bot) servicesOnline++;

  switch (servicesOnline) {
    case 1:
      return {
        services: "Outage",
        status: "2 services are offline",
        color: "text-red-700",
      };

    case 2:
      return {
        services: "Outage",
        status: "1 service is offline",
        color: "text-yellow-700",
      };

    case 3:
      return {
        services: "Online",
        status: "All services online",
        color: "text-green-500",
      };

    default:
      return {
        services: "Offline",
        status: "All services offline",
        color: "text-red-700",
      };
  }
};

const Home = async () => {
  const { online, money, members, health } = await getData();
  const { services, status, color } = setHealth(health);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-baseline">
          <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
          <Image
            src="/emoji/Waving-Hand.png"
            alt="Waving Hand"
            width="32"
            height="32"
            className="ml-2"
            priority
            unoptimized
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Players Online
              </CardTitle>
              <IconUsers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {online.players.length}/90
              </div>
              <p className="text-xs text-muted-foreground">
                Max today:{" "}
                {online.players.length > online.today
                  ? online.players.length
                  : online.today}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Server Economy
              </CardTitle>
              <IconCash className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <ServerEconomy economy={money.economy} />
              <p className="text-xs text-muted-foreground">
                {money.percentage} from yesterday
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Discord Members
              </CardTitle>
              <IconBrandDiscord className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {members?.data?.today?.members ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {members.data.difference} from yesterday
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                System Status
              </CardTitle>
              <IconCircleFilled className={`animate-pulse h-4 w-4 ${color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{services}</div>
              <p className="text-xs text-muted-foreground">{status}</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <PlayerCharts />
            </CardContent>
          </Card>
          <PlayersOnline />
        </div>
      </div>
    </ScrollArea>
  );
};

export default Home;
