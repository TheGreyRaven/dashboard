import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

import * as Sentry from "@sentry/nextjs";

const fetchChatToken = async (username: string) => {
  try {
    const raw = await fetch(`${process.env.LOCAL_URL}/api/auth/chat`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        username: username,
      }),
    });

    const res = await raw.json();

    return res;
  } catch (err) {
    Sentry.captureException(err);
    return {
      key: null,
      token: null,
    };
  }
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    Discord({
      clientId: process.env.AUTH_DISCORD_ID ?? "",
      clientSecret: process.env.AUTH_DISCORD_SECRET ?? "",
    }),
  ],
  callbacks: {
    async authorized({ auth }) {
      const isAuthenticated = !!auth?.user;

      return isAuthenticated;
    },
    async signIn({ profile }) {
      if (profile) {
        try {
          const exists = await fetch(
            `${process.env.LOCAL_URL}/api/proxy?id=${profile.id}`,
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              method: "POST",
              body: JSON.stringify({
                discord_email: profile.email,
                discord_name: profile.username,
              }),
            }
          );
          const { success, permission_level } = await exists.json();
          // @ts-expect-error
          const { key, token } = await fetchChatToken(profile.name);

          if (success && permission_level) {
            profile.permission_level = permission_level;
            profile.chat = {
              key: key,
              token: token,
            };
          }

          return success ? success : "/?error=not-admin";
        } catch (err) {
          Sentry.captureException(err);
          return "/?error=failed";
        }
      }

      return "/?error=unknown";
    },
    async jwt({ token, user, profile }) {
      if (user) {
        return {
          token,
          profile,
        };
      }

      return token;
    },
    async session({ session, token: jwt }: any) {
      if (jwt.profile.permission_level && !session.user.permission_level) {
        session.user = {
          id: jwt.profile.id,
          name: jwt.profile.username,
          avatar: jwt.profile.avatar,
          email: jwt.profile.email,
          permission_level: jwt.profile.permission_level,
          chat: jwt.profile.chat,
        };
      }

      return session;
    },
  },
  pages: {
    signIn: "/",
    signOut: "/",
  },
});
