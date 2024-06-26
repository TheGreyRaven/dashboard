import { NavItem } from "@/types";
import {
    IconDatabase, IconDiamond, IconGraph, IconHome, IconTools, IconUser, IconUsers
} from "@tabler/icons-react";

export const navItems: NavItem[] = [
  {
    title: "Home",
    href: "/dashboard",
    icon: <IconHome className="mr-2 h-4 w-4" />,
    label: "home",
    accessRole: ["ROOT", "ADMIN", "MOD"],
  },
  {
    title: "Admins",
    href: "/dashboard/admins",
    icon: <IconUser className="mr-2 h-4 w-4" />,
    label: "admins",
    accessRole: ["ROOT", "ADMIN", "MOD"],
  },
  {
    title: "Graphs",
    href: "/dashboard/graphs",
    icon: <IconGraph className="mr-2 h-4 w-4" />,
    label: "graphs",
    accessRole: ["ROOT", "ADMIN", "MOD"]
  },
  {
    title: "Players",
    href: "/dashboard/players",
    icon: <IconUsers className="mr-2 h-4 w-4" />,
    label: "players",
    accessRole: ["ROOT", "ADMIN", "MOD"],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <IconTools className="mr-2 h-4 w-4" />,
    label: "settings",
    accessRole: ["ROOT"],
  },
  {
    title: "Logs",
    href: "/dashboard/logs",
    icon: <IconDatabase className="mr-2 h-4 w-4" />,
    label: "logs",
    accessRole: ["ROOT", "ADMIN"],
  },
  {
    title: "Tebex",
    href: "/dashboard/tebex",
    icon: <IconDiamond className="mr-2 h-4 w-4" />,
    label: "tebex",
    accessRole: ["ROOT"],
  },
];
