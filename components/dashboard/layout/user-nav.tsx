import { auth, signOut } from "@/app/api/auth/[...nextauth]/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserNav = async () => {
  const session = await auth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={
                //@ts-expect-error
                `https://cdn.discordapp.com/avatars/${session?.user?.id}/${session?.user?.avatar}?size=1024` ??
                ""
              }
              alt={session?.user?.name ?? "N/A"}
            />
            <AvatarFallback>{session?.user?.name ?? "N/A"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <DropdownMenuItem>
            <button className="w-full text-start">Log out</button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { UserNav };
