"use client";

import { usePathname } from "next/navigation";

import { APP_SHELL_NAVIGATION_ITEMS } from "../app-shell-navigation.constants";
import type { UseAppShellNavigationResult } from "../app-shell-navigation.types";
import { isAppShellNavigationItemActive } from "../app-shell-navigation.utils";

export function useAppShellNavigation(): UseAppShellNavigationResult {
  const pathname = usePathname();

  return APP_SHELL_NAVIGATION_ITEMS.map((item) => ({
    ...item,
    isActive: isAppShellNavigationItemActive(pathname, item.href),
  }));
}
