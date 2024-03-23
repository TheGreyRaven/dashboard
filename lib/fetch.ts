import * as Sentry from "@sentry/nextjs";

const fetchDashboardData = async () => {
  /**
   * TODO: This should probably be split up in order to prevent everything failing if once of the services does not respond.
   */
  try {
    const [online, money, members, system] = await Promise.all([
      fetch(`${process.env.LOCAL_URL}/api/fivem/players-online?live=true`, {
        cache: "no-cache",
      }),
      fetch(`${process.env.LOCAL_URL}/api/fivem/server-economy`, {
        cache: "no-cache",
      }),
      fetch(`${process.env.LOCAL_URL}/api/discord/members`, {
        cache: "no-cache",
      }),
      fetch(`${process.env.LOCAL_URL}/api/systems`),
    ]);

    return {
      online: await online.json(),
      money: await money.json(),
      members: await members.json(),
      health: await system.json(),
    };
  } catch (err) {
    Sentry.captureException(err);

    return {
      online: {
        today: 0,
        players: [],
      },
      money: 0,
      members: 0,
      system: {
        database: false,
        fivem: false,
        bot: false,
      },
    };
  }
};

export { fetchDashboardData };
