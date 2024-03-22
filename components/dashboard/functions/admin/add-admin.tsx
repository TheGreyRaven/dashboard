"use client";

import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconAlertTriangle } from "@tabler/icons-react";

const formSchema = z.object({
  discord_id: z.string().min(17, {
    message: "Discord IDs are minumum 17 numbers long",
  }),
  permission_level: z.enum(["ROOT", "ADMIN", "MOD"], {
    errorMap: () => ({
      message: "You must select a permission level",
    }),
  }),
});

const AddAdmin = () => {
  const router = useRouter();
  const [_isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { data } = useSession();
  //@ts-expect-error
  const hasPermission = data?.user?.permission_level === "ROOT";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      discord_id: "",
      permission_level: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    if (!data?.user) {
      toast({
        title: "Error",
        description: "Your session is invalid, please log out and back in!",
      });

      return;
    }

    try {
      const raw = await fetch(`/api/admins`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          ...values,
          added_by_name: data?.user.name,
          added_by_id: data?.user.id,
        }),
      });

      const { success } = await raw.json();
      if (success) {
        form.reset();
        toast({
          title: "Success",
          description: "The admin was added successfully!",
        });
        startTransition(() => {
          router.refresh();
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add admin",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Unable to contact API",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" disabled={!hasPermission}>
            Add admin
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <DialogHeader>
                <DialogTitle>Add new admin</DialogTitle>
                <DialogDescription>
                  <Alert className="border-red-600 mt-4">
                    <IconAlertTriangle className="h-4 w-4" color="red" />
                    <AlertTitle className="text-sm">Heads up!</AlertTitle>
                    <AlertDescription>
                      <p className="text-xs">
                        Make sure you have the right Discord ID when adding a
                        new admin!
                      </p>
                    </AlertDescription>
                  </Alert>
                </DialogDescription>
              </DialogHeader>

              <FormField
                control={form.control}
                name="permission_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permission level</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) =>
                          form.setValue("permission_level", value as any)
                        }
                        {...field}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select permission level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="ROOT">ROOT</SelectItem>
                            <SelectItem value="ADMIN">ADMIN</SelectItem>
                            <SelectItem value="MOD">MOD</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      This is the permission level of the user
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
                      <Input placeholder="228856737959116800" {...field} />
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
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Add admin"
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

export { AddAdmin };
