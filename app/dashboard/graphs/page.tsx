import { ServerGraph } from "@/components/dashboard/charts/server-money/server-graph";

const getServerEconomy = async () => {
  const raw = await fetch(`${process.env.LOCAL_URL}/api/graphs/server-economy`);
  const { success, error, data } = await raw.json();

  return {
    success,
    error,
    data,
  };
};

const GraphPage = async () => {
  const { success, error, data } = await getServerEconomy();

  return <ServerGraph data={data} />;
};

export default GraphPage;
