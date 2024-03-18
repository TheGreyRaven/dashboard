import type { Metadata } from "next";

import Header from "@/components/dashboard/layout/header";
import Sidebar from "@/components/dashboard/layout/sidebar";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Bygden - Dashboard",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <Header />
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="w-full pt-16">{children}</main>
        </div>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RootLayout;
