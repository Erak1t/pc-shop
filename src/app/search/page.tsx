"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import ProductCard from "../../components/ProductCard/ProductCard";
import styles from "./Search.module.scss";

// Інтерфейс продукту, який очікує ProductCard
interface Product {
  id: number;
  name: string;
  image: string;
  stock: string;
  rating: number;
  price: number;
  category: string;
  color: string;
  priceRange: string;
  isNew?: boolean;
  description?: string;
  reviews: number | { count: number }[];
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("products")
          .select(
            "id, name, image, stock, rating, price, category, color, description"
          ) // Видалили is_new
          .ilike("name", `%${query}%`); // Пошук за назвою (регістронезалежний)

        if (error) {
          throw new Error(error.message);
        }

        // Перетворюємо дані з Supabase у формат, який очікує ProductCard
        const formattedProducts: Product[] = (data || []).map((item) => ({
          id: item.id,
          name: item.name,
          image: item.image,
          stock: item.stock || "in stock",
          rating: item.rating || 0,
          price: item.price,
          category: item.category || "",
          color: item.color || "",
          priceRange: "",
          isNew: false, // Встановлюємо значення за замовчуванням, оскільки is_new відсутнє
          description: item.description || "",
          reviews: 0, // Поле reviews відсутнє в таблиці, встановлюємо 0
        }));

        setProducts(formattedProducts);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(err.message || "Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [query]);

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

      <section className={styles.searchSection}>
        <h1 className={styles.searchTitle}>Search Results for '{query}'</h1>
        {loading ? (
          <p className={styles.loading}>Loading...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : products.length > 0 ? (
          <div className={styles.productList}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <p>No products found for '{query}'.</p>
            <Link href="/" className={styles.continueShopping}>
              Continue Shopping
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
