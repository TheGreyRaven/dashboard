const fetchDashboardData = async () => {
  try {
    const [online, money, members] = await Promise.all([
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
      online: await online.json(),
      money: await money.json(),
      members: await members.json(),
    };
  } catch (err) {
    console.error(err);

    return {
      online: {
        today: 0,
        players: [],
      },
      money: 0,
      members: 0,
    };
  }
};

export { fetchDashboardData };
