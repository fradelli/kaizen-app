import type { ReactNode } from "react";

export type AppShellProps = Readonly<{
  children: ReactNode;
}>;

export type AppShellNavigationItem = Readonly<{
  href: `/${string}`;
  label: string;
}>;

export type AppShellNavigationViewItem = AppShellNavigationItem &
  Readonly<{
    isActive: boolean;
  }>;

export type UseAppShellNavigationResult = readonly AppShellNavigationViewItem[];
