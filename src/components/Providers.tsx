"use client";
import { LocaleProvider } from "@/lib/i18n";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return <LocaleProvider>{children}</LocaleProvider>;
}
