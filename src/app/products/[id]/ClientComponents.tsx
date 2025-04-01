"use client";

import { useState, useRef, useEffect } from "react";
import ProductCard from "../../../components/ProductCard/ProductCard";
import styles from "./ProductDetails.module.scss";

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

// Тип для відгуку
interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

// Клієнтський компонент для вкладок
export function ClientTabs({
  reviewsData,
  description,
}: {
  reviewsData: Review[];
  description: string | null;
}) {
  const [activeTab, setActiveTab] = useState<"description" | "reviews">(
    "description"
  );

  return (
    <section className={styles.tabsSection}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${
            activeTab === "description" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("description")}
        >
          Description
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "reviews" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews ({reviewsData.length})
        </button>
      </div>
      <div className={styles.tabContent}>
        {activeTab === "description" ? (
          <p className={styles.description}>
            {description || "No description available for this product."}
          </p>
        ) : (
          <div className={styles.reviewsList}>
            {reviewsData.length > 0 ? (
              reviewsData.map((review) => (
                <div key={review.id} className={styles.reviewItem}>
                  <div className={styles.reviewHeader}>
                    <span className={styles.reviewAuthor}>{review.author}</span>
                    <span className={styles.reviewRating}>
                      {"★".repeat(review.rating) +
                        "☆".repeat(5 - review.rating)}
                    </span>
                    <span className={styles.reviewDate}>{review.date}</span>
                  </div>
                  <p className={styles.reviewComment}>{review.comment}</p>
                </div>
              ))
            ) : (
              <p>No reviews available for this product.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

// Клієнтський компонент для слайдера
export function ClientSlider({
  relatedProducts,
}: {
  relatedProducts: Product[];
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  // Додаємо слухачі подій для кнопок після монтування компонента
  useEffect(() => {
    const leftButton = document.getElementById("scrollLeft");
    const rightButton = document.getElementById("scrollRight");

    if (leftButton) leftButton.addEventListener("click", scrollLeft);
    if (rightButton) rightButton.addEventListener("click", scrollRight);

    return () => {
      if (leftButton) leftButton.removeEventListener("click", scrollLeft);
      if (rightButton) rightButton.removeEventListener("click", scrollRight);
    };
  }, []);

  return (
    <div className={styles.relatedProductsSlider} ref={scrollContainerRef}>
      {relatedProducts.map((relatedProduct: Product) => (
        <div key={relatedProduct.id} className={styles.sliderItem}>
          <ProductCard product={relatedProduct} />
        </div>
      ))}
    </div>
  );
}
