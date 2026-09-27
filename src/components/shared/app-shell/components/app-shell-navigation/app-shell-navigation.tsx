import { Suspense } from "react";
import { APP_SHELL_NAVIGATION_ITEMS } from "./app-shell-navigation.constants";
import { AppShellNavigationLinks } from "./components/app-shell-navigation-links/app-shell-navigation-links";
import { AppShellNavigationRoutes } from "./components/app-shell-navigation-routes/app-shell-navigation-routes";

export function AppShellNavigation() {
  const fallbackItems = APP_SHELL_NAVIGATION_ITEMS.map((item) => ({
    ...item,
    isActive: false,
    destination: item.href,
  }));

  return (
    <Suspense fallback={<AppShellNavigationLinks items={fallbackItems} />}>
      <AppShellNavigationRoutes />
    </Suspense>
  );
}
