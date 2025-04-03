"use client";

import { useState, useEffect } from "react";
import styles from "./Banner1.module.scss";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

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

export default function Banner() {
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Завантажуємо продукт з Supabase
  useEffect(() => {
    const fetchFeaturedProduct = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);

        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", 2) // Отримуємо продукт з id=2
          .single(); // Очікуємо один запис

        if (error) {
          console.error("Error fetching featured product:", error);
          setErrorMessage(
            error.message || "An error occurred while fetching the product."
          );
          return;
        }

        setFeaturedProduct(data);
      } catch (err) {
        console.error("Unexpected error:", err);
        setErrorMessage("Unexpected error occurred while fetching product.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProduct();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return <div className={styles.error}>{errorMessage}</div>;
  }

  if (!featuredProduct) {
    return <div>Product not found</div>;
  }

  return (
    <section className={styles.banner}>
      <div className={styles.textContent}>
        <h1>{featuredProduct.name}</h1>
        <p>{featuredProduct.description || "No description available"}</p>
        <span className={styles.price}>
          ${featuredProduct.price.toFixed(2)}
        </span>
        <Link href={`/products/${featuredProduct.id}`}>
          <button className={styles.buyButton}>Buy Now</button>
        </Link>
      </div>
      <div className={styles.imageContent}>
        <img
          src={featuredProduct.image}
          alt={featuredProduct.name}
          className={styles.productImage}
        />
      </div>
    </section>
  );
}
