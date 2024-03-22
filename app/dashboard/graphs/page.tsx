import { PlayersEconomy } from "@/components/dashboard/charts/players-economy/server-component";
import { ServerGraph } from "@/components/dashboard/charts/server-money/server-graph";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const getServerEconomy = async () => {
  const raw = await fetch(
    `${process.env.LOCAL_URL}/api/graphs/server-economy`,
    {
      cache: "no-cache",
    }
  );
  const { success, error, data } = await raw.json();

  return {
    success,
    error,
    data,
  };
};

const GraphPage = async () => {
  const { success, error, data } = await getServerEconomy();

  //console.log(data);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Tabs defaultValue="server" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="server">Server</TabsTrigger>
          <TabsTrigger value="players">Players</TabsTrigger>
          <TabsTrigger value="discord">Discord</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="tebex">Tebex</TabsTrigger>
        </TabsList>
        <TabsContent value="server">
          <ServerGraph data={data} />
        </TabsContent>
        <TabsContent value="players">
          <PlayersEconomy />
        </TabsContent>
        <TabsContent value="discord"></TabsContent>
        <TabsContent value="logs"></TabsContent>
        <TabsContent value="tebex"></TabsContent>
      </Tabs>
    </div>
  );
  //return <PlayersEconomy />;
};

export default GraphPage;
