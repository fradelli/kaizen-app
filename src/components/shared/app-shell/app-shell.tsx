import styles from "./app-shell.module.css";
import type { AppShellProps } from "./app-shell.types";
import { AppShellNavigation } from "./components/app-shell-navigation";

export function AppShell({ children }: AppShellProps) {
  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#conteudo-principal">
        Pular para o conteúdo
      </a>

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <p className={styles.brand}>Kaizen</p>
          <AppShellNavigation />
        </div>
      </header>

      <main id="conteudo-principal" className={styles.content} tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
