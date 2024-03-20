export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: any;
  label?: string;
  description?: string;
  accessRole: Array<"ROOT" | "ADMIN" | "MOD">;
}

export interface LiveServerObject {
  today: number;
  players: PlayerObject[];
}

export interface PlayerObject {
  endpoint: string;
  id: number;
  identifiers: string[];
  name: string;
  ping: number;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;
