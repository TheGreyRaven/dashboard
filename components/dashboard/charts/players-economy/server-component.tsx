import { PlayerEconomyClient } from "./players-economy";

const getPlayersEconomy = async () => {
  const raw = await fetch(
    `${process.env.LOCAL_URL}/api/graphs/players-economy`,
    {
      cache: "no-store",
    }
  );
  const { success, error, data } = await raw.json();

  return {
    success,
    error,
    data,
  };
};

const PlayersEconomy = async () => {
  const { success, error, data } = await getPlayersEconomy();
  return <PlayerEconomyClient data={data} />;
};

export { PlayersEconomy };
