import NewProducts from "../components/New Products/NewProducts";
import ProductCard from "../components/ProductCard/ProductCard";
import { supabase } from "../lib/supabaseClient";
import styles from "./Home.module.scss";
import Link from "next/link";
import Banner1 from "../components/Banner1/Banner1";

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

export default async function Home() {
  // Завантажуємо всі продукти з Supabase
  const { data: products, error } = await supabase.from("products").select("*");

  if (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <main className={styles.main}>
      {/* Секція New Products (уже є) */}
      <Banner1 />
      <NewProducts />

      {/* Секція All Products */}
      <section className={styles.allProducts}>
        <div className={styles.header}>
          <h2 className={styles.title}>All Products</h2>
          <Link href="/products" className={styles.seeAllLink}>
            See All Products
          </Link>
        </div>
        <div className={styles.productsGrid}>
          {products && products.length > 0 ? (
            products
              .map((product: Product) => (
                <div key={product.id} className={styles.productCardWrapper}>
                  <ProductCard product={product} />
                </div>
              ))
              .slice(0, 12)
          ) : (
            <p>No products available.</p>
          )}
        </div>
      </section>
    </main>
  );
}
