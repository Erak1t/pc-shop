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
            <button className={styles.filterButton}>Custom PCs (24)</button>
          </div>
        </div>
      </section>

      <section className={styles.mainSection}>
        <aside className={styles.sidebar}>
          <div className={styles.filterGroup}>
            <button className={styles.clearFilterButton}>Clear Filter</button>
          </div>

          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Category</h3>
            <ul className={styles.filterList}>
              <li className={styles.filterItem}>
                <span className={styles.filterName}>Custom PCs</span>
                <span className={styles.filterCount}>(15)</span>
              </li>
              <li className={styles.filterItem}>
                <span className={styles.filterName}>MSI All-in-One PCs</span>
                <span className={styles.filterCount}>(45)</span>
              </li>
              <li className={styles.filterItem}>
                <span className={styles.filterName}>HP/Compaq PCs</span>
                <span className={styles.filterCount}>(1)</span>
              </li>
            </ul>
          </div>

          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Price</h3>
            <ul className={styles.filterList}>
              <li className={styles.filterItem}>
                <span className={styles.filterName}>$0.00 - $1,000.00</span>
                <span className={styles.filterCount}>(19)</span>
              </li>
              <li className={styles.filterItem}>
                <span className={styles.filterName}>$1,000.00 - $2,000.00</span>
                <span className={styles.filterCount}>(21)</span>
              </li>
              <li className={styles.filterItem}>
                <span className={styles.filterName}>$2,000.00 - $3,000.00</span>
                <span className={styles.filterCount}>(9)</span>
              </li>
              <li className={styles.filterItem}>
                <span className={styles.filterName}>$3,000.00 - $4,000.00</span>
                <span className={styles.filterCount}>(6)</span>
              </li>
              <li className={styles.filterItem}>
                <span className={styles.filterName}>$4,000.00 - $5,000.00</span>
                <span className={styles.filterCount}>(3)</span>
              </li>
              <li className={styles.filterItem}>
                <span className={styles.filterName}>$5,000.00 - $6,000.00</span>
                <span className={styles.filterCount}>(1)</span>
              </li>
              <li className={styles.filterItem}>
                <span className={styles.filterName}>$6,000.00 - $7,000.00</span>
                <span className={styles.filterCount}>(1)</span>
              </li>
              <li className={styles.filterItem}>
                <span className={styles.filterName}>$7,000.00 And Above</span>
                <span className={styles.filterCount}>(1)</span>
              </li>
            </ul>
          </div>

          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Color</h3>
            <ul className={styles.filterList}>
              <li className={styles.filterItem}>
                <span
                  className={styles.colorCircle}
                  style={{ backgroundColor: "#000" }}
                ></span>
                <span
                  className={styles.colorCircle}
                  style={{ backgroundColor: "#ff0000" }}
                ></span>
              </li>
            </ul>
          </div>

          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Filter Name</h3>
            <button className={styles.applyFiltersButton}>
              Apply Filters (2)
            </button>
          </div>

          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Brands</h3>
            <ul className={styles.filterList}>
              <li className={styles.filterItem}>
                <span className={styles.filterName}>All Brands</span>
              </li>
            </ul>
          </div>
        </aside>

        {/* Поки що залишимо місце для списку товарів */}
        <div className={styles.productsGrid}>
          {/* Список товарів додамо в наступному кроці */}
        </div>
      </section>
    </main>
  );
}
