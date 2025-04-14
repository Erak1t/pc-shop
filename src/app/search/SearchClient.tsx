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

export default function SearchClient() {
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
          )
          .ilike("name", `%${query}%`);

        if (error) {
          throw new Error(error.message);
        }

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
          isNew: false,
          description: item.description || "",
          reviews: 0,
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
  );
}
