const fetchDashboardData = async (validateTime = 60) => {
  try {
    const [players, money, members] = await Promise.all([
      fetch(`${process.env.LOCAL_URL}/api/fivem/players-online?live=true`, {
        next: {
          revalidate: validateTime,
        },
      }),
      fetch(`${process.env.LOCAL_URL}/api/fivem/server-economy`, {
        next: {
          revalidate: validateTime,
        },
      }),
      fetch(`${process.env.LOCAL_URL}/api/discord/members`, {
        next: {
          revalidate: validateTime,
        },
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
