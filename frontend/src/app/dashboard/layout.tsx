"use client";

import QueryProvider from "@/providers/QueryProvider";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </QueryProvider>
  );
}