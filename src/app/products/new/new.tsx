import Link from "next/link";
import ProductCard from "../../../components/ProductCard/ProductCard";
import { supabase } from "../../../lib/supabaseClient";
import styles from "./NewProductsPage.module.scss";

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

export default async function NewProductsPage() {
  // Завантажуємо нові продукти з Supabase
  const { data: newProducts, error } = await supabase
    .from("products")
    .select("*")
    .eq("isNew", true);

  if (error) {
    console.error("Error fetching new products:", error);
    return <div>Error loading new products. Please try again later.</div>;
  }

  console.log("New products fetched:", newProducts);

  return (
    <main className={styles.newProductsPage}>
      {/* Хлібні крихти */}
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>
          Home
        </Link>
        <span className={styles.breadcrumbSeparator}> &gt; </span>
        <span>New Products</span>
      </div>

      {/* Заголовок */}
      <h1 className={styles.title}>New Products</h1>

      {/* Сітка продуктів */}
      <div className={styles.productsGrid}>
        {newProducts && newProducts.length > 0 ? (
          newProducts.map((product: Product) => (
            <div key={product.id} className={styles.productCardWrapper}>
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <p>No new products available.</p>
        )}
      </div>
    </main>
  );
}
