"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react"; // Додаємо useRef для скрол-контейнера
import { ChevronLeft, ChevronRight } from "lucide-react"; // Іконки для кнопок
import productsData from "../../../data/products.json";
import styles from "./ProductDetails.module.scss";
import ProductCard from "../../../components/ProductCard/ProductCard";

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

// Фіктивний масив відгуків (можна замінити на реальні дані з бекенду)
const reviewsData: Review[] = [
  {
    id: 1,
    author: "John Doe",
    rating: 5,
    comment: "Amazing product! Works perfectly and looks great.",
    date: "2025-03-20",
  },
  {
    id: 2,
    author: "Jane Smith",
    rating: 4,
    comment: "Really good quality, but the delivery took a bit long.",
    date: "2025-03-18",
  },
  {
    id: 3,
    author: "Alex Brown",
    rating: 3,
    comment: "It's okay, but I expected better performance for the price.",
    date: "2025-03-15",
  },
];

// Параметри сторінки (отримуємо id із URL)
interface ProductPageProps {
  params: { id: string };
}

export default function ProductDetails({ params }: ProductPageProps) {
  // Знаходимо продукт за id
  const product = productsData.find(
    (p: Product) => p.id === parseInt(params.id)
  );

  // Якщо продукт не знайдено, показуємо повідомлення
  if (!product) {
    return <div>Product not found</div>;
  }

  // Знаходимо схожі продукти (з тієї ж категорії, але не поточний продукт)
  const relatedProducts = productsData
    .filter(
      (p: Product) => p.category === product.category && p.id !== product.id
    )
    .slice(0, 7); // Показуємо лише перші 7 схожих продуктів

  // Стан для активної вкладки
  const [activeTab, setActiveTab] = useState<"description" | "reviews">(
    "description"
  );

  // Ref для скрол-контейнера
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Функції для прокрутки
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300, // Прокрутка на 300px вліво
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300, // Прокрутка на 300px вправо
        behavior: "smooth",
      });
    }
  };

  return (
    <main className={styles.productPage}>
      <section className={styles.topSection}>
        <div className={styles.breadcrumb}>
          <Link href="/" className={styles.breadcrumbLink}>
            Home
          </Link>
          <span className={styles.breadcrumbSeparator}> &gt; </span>
          <Link
            href={`/${product.category.toLowerCase()}`}
            className={styles.breadcrumbLink}
          >
            {product.category === "others" ? "Accessories" : product.category}
          </Link>
          <span className={styles.breadcrumbSeparator}> &gt; </span>
          <span>{product.name}</span>
        </div>
      </section>

      <section className={styles.mainSection}>
        <div className={styles.imageSection}>
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={300}
            className={styles.productImage}
          />
        </div>
        <div className={styles.detailsSection}>
          <h1 className={styles.productName}>{product.name}</h1>
          <div className={styles.rating}>
            <span className={styles.stars}>
              {"★".repeat(product.rating) + "☆".repeat(5 - product.rating)}
            </span>
            <span className={styles.reviews}>Reviews ({product.reviews})</span>
          </div>
          <div className={styles.price}>${product.price.toFixed(2)}</div>
          <div className={styles.stockStatus}>
            <span
              className={`${styles.stockText} ${
                product.stock === "in stock"
                  ? styles.inStock
                  : styles.outOfStock
              }`}
            >
              {product.stock}
            </span>
          </div>
          <div className={styles.details}>
            <p>
              <strong>Category:</strong>{" "}
              {product.category === "others" ? "Accessories" : product.category}
            </p>
            <p>
              <strong>Color:</strong> {product.color}
            </p>
            <p>
              <strong>Price Range:</strong> {product.priceRange}
            </p>
            {product.isNew && <p className={styles.newTag}>New Product</p>}
          </div>
          <button className={styles.addToCartButton}>Add to Cart</button>
        </div>
      </section>

      {/* Вкладки для опису і відгуків */}
      <section className={styles.tabsSection}>
        <div className={styles.Tabs}>
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
              {product.description ||
                "No description available for this product."}
            </p>
          ) : (
            <div className={styles.reviewsList}>
              {reviewsData.length > 0 ? (
                reviewsData.map((review) => (
                  <div key={review.id} className={styles.reviewItem}>
                    <div className={styles.reviewHeader}>
                      <span className={styles.reviewAuthor}>
                        {review.author}
                      </span>
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

      {/* Секція схожих продуктів у вигляді слайдера */}
      <section className={styles.relatedProductsSection}>
        <div className={styles.relatedProductsHeader}>
          <h2 className={styles.relatedProductsTitle}>Related Products</h2>
          {relatedProducts.length > 0 && (
            <div className={styles.scrollButtons}>
              <button onClick={scrollLeft} className={styles.scrollButton}>
                <ChevronLeft size={24} />
              </button>
              <button onClick={scrollRight} className={styles.scrollButton}>
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>
        {relatedProducts.length > 0 ? (
          <div
            className={styles.relatedProductsSlider}
            ref={scrollContainerRef}
          >
            {relatedProducts.map((relatedProduct: Product) => (
              <div key={relatedProduct.id} className={styles.sliderItem}>
                <ProductCard product={relatedProduct} />
              </div>
            ))}
          </div>
        ) : (
          <p>No related products found.</p>
        )}
      </section>
    </main>
  );
}
