import moment from "moment";
import Image from "next/image";

import { AddAdmin } from "@/components/dashboard/functions/admin/add-admin";
import { RemoveAdmin } from "@/components/dashboard/functions/admin/remove-admin";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DashboardAdmins = ({ admins }: { admins: any }) => {
  return (
    <div className="flex-1 space-y-4 pt-6">
      <div className="flex items-baseline justify-between">
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
        <AddAdmin />
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Available admins</CardTitle>
            <CardDescription>Number of admins: {admins.length}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>
                These are just the admins with dashboard access.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">
                    Permission Level
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead className="min-w-[150px]">Added By Name</TableHead>
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
                      {admin.discord_name === "" || admin.discord_name === null
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
                      {moment(admin.added_timestamp)
                        .utc()
                        .format("YYYY-MM-DD HH:mm:ss")}
                    </TableCell>
                    <TableCell>
                      <RemoveAdmin admin={admin} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { DashboardAdmins };
