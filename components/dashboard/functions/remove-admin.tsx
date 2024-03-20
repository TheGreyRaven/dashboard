"use client";

import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

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
import { IconX } from "@tabler/icons-react";

const RemoveAdmin = ({ admin }: { admin: any }) => {
  const dialogRef = useRef(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
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
            onClick={() => setOpen(true)}
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
                  This action can not be undone and will delete the following
                  admin
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
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
                            admin.discord_name === ""
                              ? "N/A"
                              : admin.discord_name
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
              </div>
              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button onClick={() => setOpen(false)}>Cancel</Button>
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

    // <AlertDialog>
    //   <AlertDialogTrigger asChild>
    //     <Button
    //       variant="outline"
    //       size="icon"
    //       disabled={!hasPermission}
    //       onClick={() => console.log(admin)}
    //     >
    //       <IconX className="h-4 w-4" />
    //     </Button>
    //   </AlertDialogTrigger>
    //   <AlertDialogContent className="sm:max-w-[425px]">
    //     <AlertDialogHeader>
    //       <AlertDialogTitle>Are you sure?</AlertDialogTitle>
    //       <AlertDialogDescription>
    //         This action can not be undone and will delete the following admin
    //         permanently:
    //         <div className="grid gap-4 py-4">
    //           <div className="grid grid-cols-1 items-center gap-4">
    //             <Label htmlFor="name">Discord name</Label>
    //             <Input
    //               disabled
    //               id="name"
    //               value={admin.discord_name}
    //               className="disabled:opacity-100"
    //             />
    //           </div>
    //           <div className="grid grid-cols-1 items-center gap-4">
    //             <Label htmlFor="username">Discord ID</Label>
    //             <Input
    //               disabled
    //               value={admin.discord_id}
    //               className="disabled:opacity-100"
    //             />
    //           </div>
    //         </div>
    //       </AlertDialogDescription>
    //     </AlertDialogHeader>
    //     <AlertDialogFooter>
    //       <AlertDialogCancel>Cancel</AlertDialogCancel>
    //       <AlertDialogAction
    //         type="submit"
    //         className="hover:bg-red-900 bg-red-700 text-white"
    //       >
    //         Delete
    //       </AlertDialogAction>
    //     </AlertDialogFooter>
    //   </AlertDialogContent>
    // </AlertDialog>
  );
};

export { RemoveAdmin };
