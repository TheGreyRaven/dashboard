const getPlayers = async () => {
  const raw = await fetch(`${process.env.LOCAL_URL}/api/database/players`, {
    cache: "no-cache",
  });

  const response = await raw.json();

  return response;
};

const PlayersTable = () => {
  const players = getPlayers();

  return <></>;
};
