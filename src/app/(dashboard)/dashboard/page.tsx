import styles from "./page.module.css";

export default function DashboardPage() {
  return (
    <section aria-labelledby="dashboard-heading" className={styles.page}>
      <div className={styles.placeholder}>
        <p className={styles.eyebrow}>Super Admin</p>
        <h1 id="dashboard-heading">Dashboard</h1>
        <p>
          Dashboard content is being prepared. This temporary area will be replaced by the approved
          dashboard modules in subsequent implementation chunks.
        </p>
      </div>
    </section>
  );
}
