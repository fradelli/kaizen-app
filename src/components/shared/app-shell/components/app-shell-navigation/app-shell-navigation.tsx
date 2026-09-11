"use client";

import { Button } from "@fradelli/ui/button";
import Link from "next/link";

import styles from "./app-shell-navigation.module.css";
import { useAppShellNavigation } from "./hooks/use-app-shell-navigation";

export function AppShellNavigation() {
  const navigationItems = useAppShellNavigation();

  return (
    <nav aria-label="Navegação principal">
      <ul className={styles.navigationList}>
        {navigationItems.map((item) => (
          <li key={item.href}>
            <Button
              asChild
              className={styles.navigationLink}
              variant={item.isActive ? "secondary" : "ghost"}
            >
              <Link href={item.href} aria-current={item.isActive ? "page" : undefined}>
                {item.label}
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
