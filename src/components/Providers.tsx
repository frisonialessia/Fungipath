"use client";
import { LocaleProvider } from "@/lib/i18n";
import PwaRegister from "@/components/PwaRegister";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      {children}
      <PwaRegister />
    </LocaleProvider>
  );
}
