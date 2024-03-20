import Image from "next/image";

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
import { IconX } from "@tabler/icons-react";

const ADMIN_USERS = [
  {
    id: 1,
    permission_level: "ROOT",
    discord_name: "thegreyraven",
    discord_email: "oscar.braberg@dotit.se",
    discord_id: "228856737959116800",
    added_by_name: null,
    added_by_id: null,
    added_timestamp: "2024-03-17 19:06:41",
  },
];

const getAdmins = async () => {
  const raw = await fetch(`${process.env.LOCAL_URL}/api/admins`);
  const response = await raw.json();

  return response;
};

const Admins = async () => {
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
                        {admin.discord_name === "" ? "N/A" : admin.discord_name}
                      </TableCell>
                      <TableCell>
                        {admin.discord_email === ""
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
              <form>
                <div className="grid w-full max-w-sm items-center gap-2">
                  <div>
                    <Label htmlFor="discord_id">Discord ID</Label>
                    <Input
                      id="discord_id"
                      type="text"
                      placeholder="228856737959116800"
                    />
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="permission_level">Permission Level</Label>
                    <Select>
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
                    <Button className="w-full">Add admin</Button>
                  </div>
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
