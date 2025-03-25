import Link from "next/link";
import styles from "./laptops.module.scss";

export default function Laptops() {
  return (
    <main>
      <section className={styles.topSection}>
        <div className={styles.header}>
          <div className={styles.breadcrumb}>
            <Link href="/" className={styles.backLink}>
              Back
            </Link>
          </div>
          <h1 className={styles.title}>MSI PS Series (20)</h1>
          <div className={styles.navControls}>
            <span className={styles.itemsCount}>Items 1-35 of 61</span>
            <div className={styles.sortContainer}>
              <label className={styles.sortLabel}>Sort By</label>
              <select className={styles.sortSelect}>
                <option value="position">Position</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>
            <div className={styles.viewContainer}>
              <label className={styles.viewLabel}>Show</label>
              <select className={styles.viewSelect}>
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="35">35 per page</option>
              </select>
              <div className={styles.viewToggle}>
                <button className={styles.gridViewButton}>🖼️</button>
                <button className={styles.listViewButton}>📜</button>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.filters}>
          <span className={styles.filtersLabel}>Filters</span>
          <button className={styles.clearFiltersButton}>Clear All</button>
          <div className={styles.filterButtons}>
            <button className={styles.filterButton}>Custom PCs (15)</button>
            <button className={styles.filterButton}>HP/Compaq PCs (24)</button>
          </div>
        </div>
      </section>
    </main>
  );
}
