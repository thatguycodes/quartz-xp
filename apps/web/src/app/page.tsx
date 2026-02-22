import styles from './page.module.css';
import { Button } from '@thatguycodes/quartz-ui';

export default function Index() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Enterprise Nx Monorepo</h1>
          <p>Powered by Next.js, Storybook, and Shared Component Libraries</p>
        </header>

        <main className={styles.main}>
          <section className={styles.section}>
            <h2>Lego Component Library Demonstration</h2>
            <div className={styles.buttonGroup}>
              <Button variant="primary" size="large">
                Primary Button
              </Button>
              <Button variant="secondary" size="medium">
                Secondary Button
              </Button>
              <Button variant="outline" size="small">
                Outline Button
              </Button>
            </div>
          </section>

          <section className={styles.info}>
            <div className={styles.card}>
              <h3>Next.js (TypeScript)</h3>
              <p>The main application container for our enterprise solution.</p>
            </div>
            <div className={styles.card}>
              <h3>Shared UI Library</h3>
              <p>Reusable components styled with SCSS and documented with Storybook.</p>
            </div>
            <div className={styles.card}>
              <h3>Nx Monorepo</h3>
              <p>Scalable, enterprise-grade tooling for modern web development.</p>
            </div>
          </section>
        </main>

        <footer className={styles.footer}>
          <p>Built with ❤️ using Nx and Next.js</p>
        </footer>
      </div>
    </div>
  );
}
