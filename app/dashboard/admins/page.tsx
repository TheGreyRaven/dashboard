import { DashboardAdmins } from "@/components/admins/DashboardAdmins";
// import { TxAdmins } from "@/components/admins/TxAdmins";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const getAdmins = async () => {
  const raw = await fetch(`${process.env.LOCAL_URL}/api/admins`, {
    cache: "no-cache",
  });
  const response = await raw.json();

  return response;
};

const getTxAdmins = async () => {
  const raw = await fetch(`${process.env.LOCAL_URL}/api/txadmin/admins`, {
    cache: "no-cache",
  });
  const response = await raw.json();

  return response;
};

const Admins = async () => {
  const { success, error, admins } = await getAdmins();
  const txAdmins = await getTxAdmins();

  return (
    <ScrollArea className="h-full">
      <div className="grid gap-4 grid-cols-1">
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="dashboard">Dashboard Admins</TabsTrigger>
              <TabsTrigger value="txadmin">TX Admins</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard">
              <DashboardAdmins admins={admins} />
            </TabsContent>
            <TabsContent value="txadmin">
              {/* <TxAdmins txAdmins={txAdmins} /> */}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ScrollArea>
  );
};

export default Admins;
