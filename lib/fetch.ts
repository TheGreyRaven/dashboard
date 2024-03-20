const fetchDashboardData = async () => {
  try {
    const [players, money, members] = await Promise.all([
      fetch(`${process.env.LOCAL_URL}/api/fivem/players-online?live=true`, {
        cache: "no-cache",
      }),
      fetch(`${process.env.LOCAL_URL}/api/fivem/server-economy`, {
        cache: "no-cache",
      }),
      fetch(`${process.env.LOCAL_URL}/api/discord/members`, {
        cache: "no-cache",
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

export { fetchDashboardData };
