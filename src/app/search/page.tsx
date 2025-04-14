import Link from "next/link";
import { Suspense } from "react";
import styles from "./Search.module.scss";
import SearchClient from "./SearchClient";

export default function SearchPage() {
  return (
    <main className={styles.searchPage}>
      <section className={styles.topSection}>
        <div className={styles.breadcrumb}>
          <Link href="/" className={styles.breadcrumbLink}>
            Home
          </Link>
          <span className={styles.breadcrumbSeparator}> &gt; </span>
          <span>Search</span>
        </div>
      </section>

      <Suspense fallback={<p className={styles.loading}>Loading...</p>}>
        <SearchClient />
      </Suspense>
    </main>
  );
}
