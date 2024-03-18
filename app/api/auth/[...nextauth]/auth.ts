import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

import { prisma } from "@/lib/prisma";

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
    async signIn(data: any) {
      try {
        const adminUser = await prisma.brp_web_admins.findFirst({
          where: {
            discord_id: data.profile.id,
          },
          select: {
            permission_level: true,
          },
        });

        if (adminUser) {
          return true;
        }

        return false;
      } catch (err) {
        console.error(err);
        return false;
      } finally {
        await prisma.$disconnect();
      }
    },
    async jwt({ token, profile }) {
      return { token, profile };
    },
    async session({ session, token: jwt }: any) {
      try {
        const adminUser = await prisma.brp_web_admins.findFirst({
          where: {
            discord_id: jwt.token.profile.id,
          },
          select: {
            permission_level: true,
          },
        });

        session.user = {
          id: jwt.token.profile.id,
          name: jwt.token.profile.username,
          avatar: jwt.token.profile.avatar,
          email: jwt.token.profile.email,
          permission_level: adminUser?.permission_level,
        };

        return session;
      } catch (err) {
        console.error(err);
        return null;
      } finally {
        await prisma.$disconnect();
      }
    },
  },
  pages: {
    signIn: "/",
    signOut: "/",
  },
});
