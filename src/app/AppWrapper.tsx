"use client";

import Navbar from "@/components/Navbar";
import { AppShell } from "@mantine/core";
import { AuthProvider } from "./context/AuthContext";
import { Analytics } from "@vercel/analytics/react"

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppShell
        header={{ height: 60 }}
        padding="md"
        navbar={{ width: 0, breakpoint: "sm" }}
      >
        <Navbar />
        {children}
        <Analytics />
      </AppShell>
    </AuthProvider>
  );
}
