import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { ChatProvider } from "@/components/chat-dialog/chat-provider";
import ThemeToggle from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

import { MobileSidebar } from "./mobile-sidebar";
import { UserNav } from "./user-nav";

const Header = async () => {
  const session = await auth();
  // @ts-expect-error
  const hasToken = session?.chat?.key !== null && session?.chat?.token !== null;

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
          {hasToken && (
            <ChatProvider
              //@ts-expect-error
              apiKey={session?.user?.chat?.key}
              //@ts-expect-error
              token={session?.user?.chat?.token}
            />
          )}
          <UserNav />
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
};

export { Header };
