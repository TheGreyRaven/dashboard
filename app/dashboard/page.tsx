import Image from "next/image";

import { PlayerList } from "@/components/dashboard/charts/players-online/players";
import { PlayersOnline } from "@/components/dashboard/stats/players-online";
import { ServerEconomy } from "@/components/dashboard/stats/server-economy";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchDashboardData } from "@/lib/fetch";
import {
  IconAlertTriangle,
  IconBrandDiscord,
  IconCash,
  IconUsers,
} from "@tabler/icons-react";

import { auth } from "../api/auth/[...nextauth]/auth";

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
        color: "bg-red-700",
      };

    case 2:
      return {
        services: "Outage",
        status: "1 service is offline",
        color: "bg-yellow-700",
      };

    case 3:
      return {
        services: "Online",
        status: "All services online",
        color: "bg-green-500",
      };

    default:
      return {
        services: "Offline",
        status: "All services offline",
        color: "bg-red-700",
      };
  }
};

const Home = async () => {
  const session = await auth();
  const { online, money, members, health } = await getData();
  const { services, status, color } = setHealth(health);
  //@ts-expect-error
  const hasChat = session?.user?.chat?.token;

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {!hasChat && (
          <div>
            <Alert className="border-red-600">
              <IconAlertTriangle color="#721718" className="h-4 w-4" />
              <AlertTitle>Warning!</AlertTitle>
              <AlertDescription>
                You are missing important session data for the chat function,
                please log out and back in!
              </AlertDescription>
            </Alert>
          </div>
        )}
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
                Max last 24h:{" "}
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
                {members?.data?.difference} from yesterday
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                System Status
              </CardTitle>
              <span className="relative flex h-3 w-3">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 ${color}`}
                ></span>
              </span>
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
              <PlayerList />
            </CardContent>
          </Card>
          <PlayersOnline />
        </div>
      </div>
    </ScrollArea>
  );
};

export default Home;
