import { PlayerCharts } from "@/components/dashboard/charts/players";
import { PlayersOnline } from "@/components/dashboard/stats/players-online";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  IconBrandDiscord,
  IconCash,
  IconCircleFilled,
  IconUsers,
} from "@tabler/icons-react";

const getPlayers = async () => {
  const [players, money, members] = await Promise.all([
    fetch(`${process.env.FIVEM_SERVER_URL}/players.json`, {
      cache: "no-cache",
    }),
    fetch(`${process.env.LOCAL_URL}/api/economy/server`, {
      cache: "no-cache",
    }),
    fetch(`${process.env.LOCAL_URL}/api/discord/members`, {
      next: {
        revalidate: 0,
      },
    }),
  ]);

  return {
    players: await players.json(),
    money: await money.json(),
    members: await members.json(),
  };
};

const Home = async () => {
  const { players, money, members } = await getPlayers();

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome back! 👋
          </h2>
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
              <div className="text-2xl font-bold">{players.length}/64</div>
              <p className="text-xs text-muted-foreground">Max today: 64</p>
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
              <TooltipTrigger>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat("sv-SE", {
                    style: "currency",
                    currency: "SEK",
                    notation: "compact",
                  }).format(money)}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {new Intl.NumberFormat("sv-SE", {
                  style: "currency",
                  currency: "SEK",
                }).format(money)}
              </TooltipContent>
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
              <CardDescription>Currently: {players.length}/64</CardDescription>
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
