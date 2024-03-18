import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { IconCircleFilled } from "@tabler/icons-react";

const PingThreshold = ({ ping }: { ping: number }) => {
  if (ping > 0 && ping < 40) {
    return (
      <div className="ml-auto flex items-center">
        <p className="font-medium">{ping}ms</p>{" "}
        <IconCircleFilled className="h-4 w-4 text-green-500 ml-2" />
      </div>
    );
  }

  if (ping > 40 && ping < 80) {
    return (
      <div className="ml-auto flex items-center">
        <p className="font-medium">{ping}ms</p>{" "}
        <IconCircleFilled className="h-4 w-4 text-yellow-500 ml-2" />
      </div>
    );
  }

  return (
    <div className="ml-auto flex items-center">
      <p className="font-medium">{ping}ms</p>{" "}
      <IconCircleFilled className="h-4 w-4 text-red-500 ml-2" />
    </div>
  );
};

const PlayersOnline = ({ players }: { players: any }) => {
  return (
    <ScrollArea className="h-80" type="always">
      <div className="space-y-8 pr-4">
        {players?.map((player: any, key: number) => (
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
            <PingThreshold ping={player.ping} />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export { PlayersOnline };
