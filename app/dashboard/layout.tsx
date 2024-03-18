import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/dashboard/layout/header";
import Sidebar from "@/components/dashboard/layout/sidebar";

export const metadata: Metadata = {
  title: "Bygden - Dashboard",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="w-full pt-16">{children}</main>
      </div>
    </>
  );
};

export default RootLayout;
