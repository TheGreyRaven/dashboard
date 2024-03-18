import { NavItem } from "@/types";
import {
  IconDatabase,
  IconHome,
  IconTools,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";

export const navItems: NavItem[] = [
  {
    title: "Home",
    href: "/dashboard",
    icon: <IconHome className="mr-2 h-4 w-4" />,
    label: "home",
  },
  {
    title: "Admins",
    href: "/dashboard/admins",
    icon: <IconUser className="mr-2 h-4 w-4" />,
    label: "admins",
    accessRole: "ADMIN",
  },
  {
    title: "Players",
    href: "/dashboard/players",
    icon: <IconUsers className="mr-2 h-4 w-4" />,
    label: "players",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <IconTools className="mr-2 h-4 w-4" />,
    label: "settings",
    accessRole: "ROOT",
  },
  {
    title: "Logs",
    href: "/dashboard/logs",
    icon: <IconDatabase className="mr-2 h-4 w-4" />,
    label: "logs",
    accessRole: "ADMIN",
  },
];
