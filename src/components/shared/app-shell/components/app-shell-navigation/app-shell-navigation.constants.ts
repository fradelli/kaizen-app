import type { AppShellNavigationItem } from "./app-shell-navigation.types";

export const APP_SHELL_NAVIGATION_ITEMS = [
  { href: "/dieta", label: "Dieta" },
  { href: "/treino", label: "Treino" },
] as const satisfies readonly AppShellNavigationItem[];
