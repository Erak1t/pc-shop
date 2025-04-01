import Link from "next/link";
import ProductCard from "../../components/ProductCard/ProductCard";
import { supabase } from "../../lib/supabaseClient";
import styles from "./ProductsPage.module.scss";

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
  isNew?: boolean;
  description?: string;
}

export default async function ProductsPage() {
  // Завантажуємо всі продукти з Supabase
  const { data: products, error } = await supabase.from("products").select("*");

  if (error) {
    console.error("Error fetching products:", error);
    return <div>Error loading products. Please try again later.</div>;
  }

  return (
    <main className={styles.productsPage}>
      {/* Хлібні крихти */}
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>
          Home
        </Link>
        <span className={styles.breadcrumbSeparator}> &gt;</span>
        <span>All Products</span>
      </div>

      {/* Заголовок */}
      <h1 className={styles.title}>All Products</h1>

      {/* Сітка продуктів */}
      <div className={styles.productsGrid}>
        {products && products.length > 0 ? (
          products.map((product: Product) => (
            <div key={product.id} className={styles.productCardWrapper}>
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </main>
  );
}
