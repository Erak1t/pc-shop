"use client";
import Link from "next/link";
import { useRef } from "react";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./NewProducts.module.scss";
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
  isNew?: boolean;
}

// Фільтруємо лише нові продукти
const newProducts = productsData.filter(
  (product: Product) => product.isNew === true
);

export default function NewProducts() {
  const sliderRef = useRef<HTMLDivElement>(null);

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
        <Link href="/products/new" className={styles.seeAllLink}>
          See All New Products
        </Link>
      </div>
      <div className={styles.sliderContainer}>
        <div className={styles.slider} ref={sliderRef}>
          {newProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <button className={styles.prevButton} onClick={scrollLeft}>
          ←
        </button>
        <button className={styles.nextButton} onClick={scrollRight}>
          →
        </button>
      </div>
    </section>
  );
}
