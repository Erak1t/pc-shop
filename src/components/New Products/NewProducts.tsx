"use client";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import styles from "./NewProducts.module.scss";

export default function NewProducts() {
  const sliderRef = useRef<HTMLDivElement>(null);

  // Захардкоджені дані про товари
  const products = [
    {
      id: 1,
      name: "EX DISPLAY: MSI Pro 16 Flex-036AU 15.6 MULTITOUCH All-In-On...",
      image: "/images/laptop1.jpg",
      stock: "in stock",
      rating: 5,
      reviews: 4,
      price: 499.0,
    },
    {
      id: 2,
      name: "EX DISPLAY: MSI Pro 16 Flex-036AU 15.6 MULTITOUCH All-In-On...",
      image: "/images/desktop1.jpg",
      stock: "check availability",
      rating: 5,
      reviews: 4,
      price: 499.0,
    },
    {
      id: 3,
      name: "EX DISPLAY: MSI Pro 16 Flex-036AU 15.6 MULTITOUCH All-In-On...",
      image: "/images/desktop2.jpg",
      stock: "in stock",
      rating: 5,
      reviews: 4,
      price: 499.0,
    },
    {
      id: 4,
      name: "EX DISPLAY: MSI Pro 16 Flex-036AU 15.6 MULTITOUCH All-In-On...",
      image: "/images/laptop2.jpg",
      stock: "in stock",
      rating: 5,
      reviews: 4,
      price: 499.0,
    },
    {
      id: 5,
      name: "EX DISPLAY: MSI Pro 16 Flex-036AU 15.6 MULTITOUCH All-In-On...",
      image: "/images/desktop3.jpg",
      stock: "in stock",
      rating: 5,
      reviews: 4,
      price: 499.0,
    },
    {
      id: 6,
      name: "EX DISPLAY: MSI Pro 16 Flex-036AU 15.6 MULTITOUCH All-In-On...",
      image: "/images/desktop4.jpg",
      stock: "in stock",
      rating: 5,
      reviews: 4,
      price: 499.0,
    },
  ];

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
          {products.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.stockStatus}>
                <span
                  className={`${styles.stockText} ${
                    product.stock === "in stock"
                      ? styles.inStock
                      : styles.checkAvailability
                  }`}
                >
                  {product.stock}
                </span>
              </div>
              <Image
                src={product.image}
                alt={product.name}
                width={150}
                height={120}
                className={styles.productImage}
              />
              <div className={styles.rating}>
                <span className={styles.stars}>★★★★★</span>
                <span className={styles.reviews}>
                  Reviews ({product.reviews})
                </span>
              </div>
              <h3 className={styles.productName}>{product.name}</h3>
              <span className={styles.price}>${product.price.toFixed(2)}</span>
            </div>
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
