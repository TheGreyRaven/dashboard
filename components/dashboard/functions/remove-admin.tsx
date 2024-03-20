"use client";

import { useSession } from "next-auth/react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconX } from "@tabler/icons-react";

const RemoveAdmin = ({ admin }: { admin: any }) => {
  const { data } = useSession();
  //@ts-expect-error
  const hasPermission = data?.user?.permission_level === "ROOT";

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          disabled={!hasPermission}
          onClick={() => console.log(admin)}
        >
          <IconX className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action can not be undone and will delete the following admin
            permanently:
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 items-center gap-4">
                <Label htmlFor="name">Discord name</Label>
                <Input
                  disabled
                  id="name"
                  value={admin.discord_name}
                  className="disabled:opacity-100"
                />
              </div>
              <div className="grid grid-cols-1 items-center gap-4">
                <Label htmlFor="username">Discord ID</Label>
                <Input
                  disabled
                  value={admin.discord_id}
                  className="disabled:opacity-100"
                />
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            type="submit"
            className="hover:bg-red-900 bg-red-700 text-white"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { RemoveAdmin };
