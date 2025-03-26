import Link from "next/link";
import ProductCard from "../../components/ProductCard/ProductCard";
import styles from "./Laptops.module.scss";
import productsData from "../../data/products.json";

// Тип для продукту
interface Product {
  id: number;
  name: string;
  image: string;
  stock: string;
  rating: number;
  reviews: number;
  price: number;
  category: string;
  color: string;
  priceRange: string;
}

// Фільтруємо лише ноутбуки
const laptops = productsData.filter(
  (product: Product) => product.category === "Laptops"
);

// Генеруємо унікальні категорії, цінові діапазони і кольори для фільтрів
const categories = Array.from(
  new Set(productsData.map((product: Product) => product.category))
);
const priceRanges = Array.from(
  new Set(productsData.map((product: Product) => product.priceRange))
);
const colors = Array.from(
  new Set(productsData.map((product: Product) => product.color))
);

export default function Laptops() {
  return (
    <main>
      <section className={styles.topSection}>
        <div className={styles.breadcrumb}>
          <Link href="/" className={styles.breadcrumbLink}>
            Home
          </Link>
          <span className={styles.breadcrumbSeparator}> &gt; </span>
          <Link href="/laptops" className={styles.breadcrumbLink}>
            Laptops
          </Link>
        </div>
        <div className={styles.header}>
          <h1 className={styles.title}>Laptops ({laptops.length})</h1>
          <div className={styles.navControls}>
            <span className={styles.itemsCount}>
              Items 1-{laptops.length} of {laptops.length}
            </span>
            <div className={styles.sortContainer}>
              <label className={styles.sortLabel}>Sort By:</label>
              <select className={styles.sortSelect}>
                <option value="position">Position</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>
            <div className={styles.viewContainer}>
              <label className={styles.viewLabel}>Show:</label>
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
          <span className={styles.filtersLabel}>Filter</span>
          <div className={styles.filterButtons}>
            <button className={styles.filterButton}>
              Laptops ({laptops.length}){" "}
              <span className={styles.removeFilter}>×</span>
            </button>
            {/* Приклад інших фільтрів */}
            <button className={styles.filterButton}>
              In Stock ({laptops.filter((l) => l.stock === "in stock").length}){" "}
              <span className={styles.removeFilter}>×</span>
            </button>
          </div>
          <button className={styles.clearFiltersButton}>Clear All</button>
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
              {categories.map((category) => {
                const count = productsData.filter(
                  (product: Product) => product.category === category
                ).length;
                return (
                  <li key={category} className={styles.filterItem}>
                    <span className={styles.filterName}>{category}</span>
                    <span className={styles.filterCount}>({count})</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Price</h3>
            <ul className={styles.filterList}>
              {priceRanges.map((range) => {
                const count = productsData.filter(
                  (product: Product) => product.priceRange === range
                ).length;
                return (
                  <li key={range} className={styles.filterItem}>
                    <span className={styles.filterName}>{range}</span>
                    <span className={styles.filterCount}>({count})</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Color</h3>
            <ul className={styles.filterList}>
              <li className={styles.filterItem}>
                {colors.map((color) => (
                  <span
                    key={color}
                    className={styles.colorCircle}
                    style={{ backgroundColor: color }}
                  ></span>
                ))}
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

        <div className={styles.productsGrid}>
          {laptops.map((laptop: Product) => (
            <ProductCard key={laptop.id} product={laptop} />
          ))}
        </div>
      </section>
    </main>
  );
}
