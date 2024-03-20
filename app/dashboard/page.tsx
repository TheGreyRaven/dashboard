import Image from "next/image";

import { PlayerCharts } from "@/components/dashboard/charts/players";
import { PlayersOnline } from "@/components/dashboard/stats/players-online";
import { ServerEconomy } from "@/components/dashboard/stats/server-economy";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  IconBrandDiscord,
  IconCash,
  IconCircleFilled,
  IconUsers,
} from "@tabler/icons-react";

const REVALIDATE_TIME = process.env.NODE_ENV === "production" ? 60 : 0;

const getPlayers = async () => {
  try {
    const [players, money, members] = await Promise.all([
      fetch(`${process.env.FIVEM_SERVER_URL}/players.json`, {
        next: {
          revalidate: REVALIDATE_TIME,
        },
      }),
      fetch(`${process.env.LOCAL_URL}/api/fivem/server-economy`, {
        next: {
          revalidate: REVALIDATE_TIME,
        },
      }),
      fetch(`${process.env.LOCAL_URL}/api/discord/members`, {
        next: {
          revalidate: REVALIDATE_TIME,
        },
      }),
    ]);

    return {
      players: await players.json(),
      money: await money.json(),
      members: await members.json(),
    };
  } catch (err) {
    console.error(err);

    return {
      players: 0,
      money: 0,
      members: 0,
    };
  }
};

const Home = async () => {
  const { players, money, members } = await getPlayers();

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
              <div className="text-2xl font-bold">{players.length}/90</div>
              <p className="text-xs text-muted-foreground">Max today: 90</p>
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
              <ServerEconomy economy={money} />
              <p className="text-xs text-muted-foreground">
                12% from yesterday
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
              <IconCircleFilled className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Online</div>
              <p className="text-xs text-muted-foreground">
                All systems operational
              </p>
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
          <Card className="col-span-4 md:col-span-3">
            <CardHeader>
              <CardTitle>Online Players</CardTitle>
              <CardDescription>Currently: {players.length}/90</CardDescription>
            </CardHeader>
            <CardContent>
              <PlayersOnline players={players} />
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
};

export default Home;
