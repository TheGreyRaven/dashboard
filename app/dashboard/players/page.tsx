import Image from "next/image";

import { PlayersTable } from "@/components/dashboard/tables/all-players";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IconCar, IconHome, IconUser, IconUsers } from "@tabler/icons-react";

const getStats = async () => {
  const data = await fetch(`${process.env.LOCAL_URL}/api/graphs/players`, {
    cache: "no-store",
  });
  const result = await data.json();
  return result;
};

const Players = async () => {
  const { players, characters, vehicles, houses } = await getStats();
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 w-svw lg:w-full">
        <div className="flex items-baseline">
          <h2 className="text-3xl font-bold tracking-tight">Player Overview</h2>
          <Image
            src="/emoji/Baby.png"
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
              <CardTitle className="text-sm font-medium">Characters</CardTitle>
              <IconUsers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{characters}</div>
              <p className="text-xs text-muted-foreground">Placeholder</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Unique players
              </CardTitle>
              <IconUser className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{players}</div>
              <p className="text-xs text-muted-foreground">Placeholder</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Owned Vehicles
              </CardTitle>
              <IconCar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vehicles}</div>
              <p className="text-xs text-muted-foreground">Placeholder</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Owned houses
              </CardTitle>
              <IconHome className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{houses}</div>
              <p className="text-xs text-muted-foreground">Placeholder</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Players</CardTitle>
            </CardHeader>
            <CardContent>
              <PlayersTable />
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
};

export default Players;
export const dynamic = "force-dynamic";
