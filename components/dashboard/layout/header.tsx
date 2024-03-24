import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { ChatProvider } from "@/components/chat-dialog/chat-provider";
import ThemeToggle from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

import { MobileSidebar } from "./mobile-sidebar";
import { UserNav } from "./user-nav";

const fetchAuthToken = async (username: string) => {
  const raw = await fetch(`${process.env.LOCAL_URL}/api/auth/chat/`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      username: username,
    }),
  });

  const response = await raw.json();

  return {
    key: response.key,
    token: response.token,
  };
};

const Header = async () => {
  const session = await auth();
  const username = session?.user?.name!;
  const { key, token } = await fetchAuthToken(username);

  return (
    <div className="fixed top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20">
      <nav className="h-14 flex items-center justify-between px-4">
        <div className="hidden lg:block">
          <h1 className="text-lg">Bygden RP</h1>
        </div>
        <div className={cn("block lg:!hidden")}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-2">
          <ChatProvider
            apiKey={key}
            user={{
              id: username,
              name: username,
              // @ts-expect-error
              image: `https://cdn.discordapp.com/avatars/${session?.user?.id}/${session?.user?.avatar}`,
            }}
            token={token}
          />
          <UserNav />
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
};

export { Header };
