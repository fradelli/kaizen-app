import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.main}>
      <section className={styles.card} aria-labelledby="kaizen-title">
        <p className={styles.eyebrow}>Fundação</p>
        <h1 id="kaizen-title">Kaizen</h1>
        <p>A nova aplicação de dieta e treino está pronta para evoluir por incrementos.</p>
      </section>
    </main>
  );
}
