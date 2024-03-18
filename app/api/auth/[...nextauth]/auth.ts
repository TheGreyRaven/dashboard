import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

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
            `http://localhost:3000/api/proxy?id=${profile.id}`
          );
          const { success } = await exists.json();

          return success ? success : "/?error=not-admin";
        } catch (err) {
          console.error(err);
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
      if (jwt.profile) {
        const id = jwt.profile.id;

        const exists = await fetch(`http://localhost:3000/api/proxy?id=${id}`);
        const { permission_level } = await exists.json();
        session.user = {
          id: jwt.profile.id,
          name: jwt.profile.username,
          avatar: jwt.profile.avatar,
          email: jwt.profile.email,
          permission_level: permission_level,
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
