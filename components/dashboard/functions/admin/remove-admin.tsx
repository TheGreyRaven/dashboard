"use client";

import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { IconAlertTriangle, IconX } from "@tabler/icons-react";

const RemoveAdmin = ({ admin }: { admin: any }) => {
  const router = useRouter();
  const [_isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { data } = useSession();
  //@ts-expect-error
  const hasPermission = data?.user?.permission_level === "ROOT";

  const form = useForm({
    defaultValues: {
      discord_id: admin.discord_id,
      discord_name: admin.discord_name === "" ? "N/A" : admin.discord_name,
    },
  });

  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      const raw = await fetch(`/api/admins`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "DELETE",
        body: JSON.stringify({
          ...values,
        }),
      });

      const { success } = await raw.json();
      if (success) {
        form.reset();
        toast({
          title: "Success",
          description: "The admin was deleted successfully!",
        });
        startTransition(() => {
          router.refresh();
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete admin",
          variant: "destructive",
        });
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Unable to contact API",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            disabled={!hasPermission || admin.discord_id === data?.user?.id}
          >
            <IconX className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  <Alert className="border-red-600 mt-4">
                    <IconAlertTriangle className="h-4 w-4" color="#721718" />
                    <AlertTitle className="text-sm">Warning!</AlertTitle>
                    <AlertDescription>
                      <p className="text-xs">
                        This action can not be undone and will delete the
                        following admin
                      </p>
                    </AlertDescription>
                  </Alert>
                </DialogDescription>
              </DialogHeader>
              <FormField
                control={form.control}
                name="discord_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discord Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        {...field}
                        value={
                          admin.discord_name === "" ? "N/A" : admin.discord_name
                        }
                        className="disabled:opacity-100"
                      />
                    </FormControl>
                    <FormDescription>
                      This is the Discord name of the admin
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discord_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discord ID</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        {...field}
                        value={admin.discord_id}
                        className="disabled:opacity-100"
                      />
                    </FormControl>
                    <FormDescription>
                      This is the Discord ID of the user you want to add
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={loading}
                  className="hover:bg-red-900 bg-red-700 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Delete admin"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { RemoveAdmin };
