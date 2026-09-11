export type AppShellNavigationItem = Readonly<{
  href: `/${string}`;
  label: string;
}>;

export type AppShellNavigationViewItem = AppShellNavigationItem &
  Readonly<{
    isActive: boolean;
  }>;

export type UseAppShellNavigationResult = readonly AppShellNavigationViewItem[];
