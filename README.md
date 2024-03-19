## Welcome to Bygden RP dashboard

This is a work in progress dashboard that will be used as a control panel for the Discord bot that is available on the Bygden RP Discord server as well as be a data visualization for the administrators on the server.

This project is something I work on my free-time and **will not** be accessible to regular members as this most likely will display information about player characters that should only be obtainable in-game.

This project is build using the following technologies:

- NextJS
- Prisma
- Shadcn
- Tailwind (Shadcn uses Tailwind)
- Next Auth 5
- Radix-UI
- Tabler icons for React
- Zustand

There are some other libraries but those are the main ones, full list is available in the `packages.json` file.

This project may not have been built in the most correct way, the current state is more of a proof of concept / mockup and you can expect a lot of rewriting and interations as time progresses.

## Features so far:

- Authentication through Discord with permission levels.
- Only allow certain users to sign in.
- Display total server economy.
- Fetch online players with name, license ID and ping.
- Display current Discord members count with percentage increase/decrease compared to yesterday.

**\*NOTE:** There is currently an issue with Prisma Accelerate which make it unable to perform SQL operations in a edge server thus resulting in Prisma not being able to connect to a **MariaDB** databse, currently only regular MySQL servers work but we are unable to use a MySQL server.\*

_I solved this issue by creating proxy located in the `app/api/proxy` that can perform said MySQL operation using a non-edge server._

## Deployment:

You can press the button below to deploy this project to your own Vercel account, please note that **you need to supply your own .env variables**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FTheGreyRaven%2Fdashboard&env=AUTH_DISCORD_ID,AUTH_DISCORD_SECRET,NEXTAUTH_SECRET,NEXTAUTH_URL,LOCAL_URL,FIVEM_SERVER_URL,DATABASE_URL_ACCELERATE,DATABASE_URL,BOT_HTTP_URL&envDescription=API%20keys%20and%20other%20variables%20needed%20to%20in%20order%20for%20the%20project%20to%20function%20properly.&envLink=https%3A%2F%2Fgithub.com%2FTheGreyRaven%2Fdashboard%2Fblob%2Fmain%2FREADME.md%23env-variables&project-name=dashboard&repository-name=dashboard)
