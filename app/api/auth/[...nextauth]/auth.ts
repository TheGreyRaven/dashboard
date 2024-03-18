import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Discord({
      clientId: process.env.AUTH_DISCORD_ID ?? "",
      clientSecret: process.env.AUTH_DISCORD_SECRET ?? "",
    }),
  ],
  callbacks: {
    async jwt({ token, profile }) {
      return { token, profile };
    },
    async session({ session, token: jwt }: any) {
      session.user = {
        id: jwt.token.profile.id,
        name: jwt.token.profile.username,
        avatar: jwt.token.profile.avatar,
        email: jwt.token.profile.email,
      };

      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});
