import { revalidatePath } from "next/cache";
import Image from "next/image";

import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { brp_web_admins_permission_level } from "@prisma/client";
import { IconAlertTriangle, IconX } from "@tabler/icons-react";

/**
 * TODO: Move the addAdmin function to API endpoint and change the add admin component to client so we can disable the button and provide feedback to the user depending on result.
 */

const addAdmin = async (formData: FormData) => {
  try {
    const discord_id = formData.get("discord_id") as string;
    const permission_level = formData.get("permission_level") as string;

    await prisma.brp_web_admins.create({
      data: {
        discord_id: discord_id,
        permission_level: permission_level as brp_web_admins_permission_level,
      },
    });

    return true;
  } catch (err) {
    console.error(err);
    return false;
  } finally {
    await prisma.$disconnect();
  }
};

const getAdmins = async () => {
  const raw = await fetch(`${process.env.LOCAL_URL}/api/admins`);
  const response = await raw.json();

  return response;
};

const Admins = async () => {
  const session = await auth();

  const hasPermission =
    //@ts-expect-error
    session?.user.permission_level === "ROOT";

  const { success, error, admins } = await getAdmins();
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-baseline">
          <h2 className="text-3xl font-bold tracking-tight">Admins</h2>
          <Image
            src="/emoji/Comet.png"
            alt="Waving Hand"
            width="32"
            height="32"
            className="ml-2"
            priority
            unoptimized
          />
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-5">
            <CardHeader>
              <CardTitle>Admins available</CardTitle>
              <CardDescription>
                Admins available: {admins.length}
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">
                      Permission Level
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead className="min-w-[150px]">
                      Added By Name
                    </TableHead>
                    <TableHead className="min-w-[150px]">Added By ID</TableHead>
                    <TableHead className="min-w-[200px]">Added Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((admin: any) => (
                    <TableRow key={admin.id}>
                      <TableCell>
                        <Badge>{admin.permission_level}</Badge>
                      </TableCell>
                      <TableCell>
                        {admin.discord_name === "" ||
                        admin.discord_name === null
                          ? "N/A"
                          : admin.discord_name}
                      </TableCell>
                      <TableCell>
                        {admin.discord_email === "" ||
                        admin.discord_email === null
                          ? "N/A"
                          : admin.discord_email}
                      </TableCell>
                      <TableCell>{admin.discord_id}</TableCell>
                      <TableCell>
                        <Badge>{admin.added_by_name ?? "SYSTEM"}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge>{admin.added_by_id ?? "SYSTEM"}</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(admin.added_timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="icon">
                          <IconX className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="col-span-5 md:col-span-2">
            <CardHeader>
              <CardTitle>Add Admin</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                action={async (formData: FormData) => {
                  "use server";
                  await addAdmin(formData);

                  revalidatePath(`/dashboard/admins`, "layout");
                }}
              >
                <div className="grid w-full max-w-sm items-center gap-2">
                  <div>
                    <Label htmlFor="discord_id">Discord ID</Label>
                    <Input
                      id="discord_id"
                      name="discord_id"
                      type="text"
                      placeholder="228856737959116800"
                      disabled={!hasPermission}
                    />
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="permission_level">Permission Level</Label>
                    <Select disabled={!hasPermission} name="permission_level">
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
                  </div>

                  <div className="mt-4">
                    <Button disabled={!hasPermission} className="w-full">
                      Add admin
                    </Button>
                  </div>
                  {!hasPermission && (
                    <div className="mt-4">
                      <Alert className="border-destructive">
                        <IconAlertTriangle
                          className="h-4 w-4"
                          color="#761b1c"
                        />
                        <AlertTitle>Heads up!</AlertTitle>
                        <AlertDescription>
                          Only ROOT users can add admins!
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
};

export default Admins;
