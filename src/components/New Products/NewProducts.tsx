"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./NewProducts.module.scss";
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

export default function NewProducts() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Завантажуємо нові продукти з Supabase
  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);

        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("isnew", true);

        if (error) {
          console.error("Error fetching new products:", error);
          setErrorMessage(
            error.message || "An error occurred while fetching new products."
          );
          return;
        }

        setNewProducts(data || []);
      } catch (err) {
        console.error("Unexpected error:", err);
        setErrorMessage(
          "Unexpected error occurred while fetching new products."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNewProducts();
  }, []);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <section className={styles.newProducts}>
      <div className={styles.header}>
        <h2 className={styles.title}>New Products</h2>
        <Link href="/new-products" className={styles.seeAllLink}>
          See All New Products
        </Link>
      </div>
      <div className={styles.sliderContainer}>
        {loading ? (
          <p>Loading new products...</p>
        ) : errorMessage ? (
          <p className={styles.error}>{errorMessage}</p>
        ) : newProducts.length > 0 ? (
          <>
            <div className={styles.slider} ref={sliderRef}>
              {newProducts.map((product: Product) => (
                <div className={styles.productCardWrapper} key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            <button className={styles.prevButton} onClick={scrollLeft}>
              ←
            </button>
            <button className={styles.nextButton} onClick={scrollRight}>
              →
            </button>
          </>
        ) : (
          <p>No new products available.</p>
        )}
      </div>
    </section>
  );
}
