"use client";
import { useAppShellNavigation } from "../../hooks/use-app-shell-navigation";
import { AppShellNavigationLinks } from "../app-shell-navigation-links/app-shell-navigation-links";
export function AppShellNavigationRoutes() {
  const items = useAppShellNavigation();
  return <AppShellNavigationLinks items={items} />;
}
