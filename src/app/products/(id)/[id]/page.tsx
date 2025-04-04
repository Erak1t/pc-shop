import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "../../../../lib/supabaseClient";
import styles from "./ProductDetails.module.scss";
import { ClientTabs, ClientSlider } from "./ClientComponents";

// Тип для продукту
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
  reviews: { count: number }[]; // Оновлюємо тип для reviews
}

// Тип для відгуку
interface Review {
  id: number;
  product_id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
  created_at: string;
}

// Параметри сторінки (отримуємо id із URL)
interface ProductPageProps {
  params: { id: string };
}

export default async function ProductDetails({ params }: ProductPageProps) {
  // Перевіряємо, чи params.id є числом
  const productId = parseInt(params.id);
  if (isNaN(productId)) {
    return <div>Invalid product ID</div>;
  }

  // Отримуємо продукт за id із Supabase з підрахунком відгуків
  const { data: product, error: productError } = await supabase
    .from("products")
    .select(
      `
      *,
      reviews:reviews!product_id(count)
    `
    )
    .eq("id", productId)
    .single();

  // Якщо продукт не знайдено або сталася помилка
  if (productError || !product) {
    return <div>Product not found</div>;
  }

  // Отримуємо відгуки для цього продукту, сортуємо за датою (найновіші першими)
  const { data: reviewsData, error: reviewsError } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", product.id)
    .order("date", { ascending: false });

  if (reviewsError) {
    console.error("Error fetching reviews:", reviewsError);
  }

  // Обчислюємо середній рейтинг на основі відгуків
  const averageRating =
    reviewsData && reviewsData.length > 0
      ? Math.round(
          reviewsData.reduce(
            (sum: number, review: Review) => sum + review.rating,
            0
          ) / reviewsData.length
        )
      : product.rating;

  // Оновлюємо рейтинг продукту в базі даних (без reviews, оскільки колонки більше немає)
  const { error: updateError } = await supabase
    .from("products")
    .update({ rating: averageRating })
    .eq("id", product.id);

  if (updateError) {
    console.error("Error updating product rating:", updateError);
  }

  // Оновлюємо продукт із новим рейтингом
  const updatedProduct = {
    ...product,
    rating: averageRating,
  };

  // Отримуємо схожі продукти (з тієї ж категорії, але не поточний продукт) з підрахунком відгуків
  const { data: relatedProducts, error: relatedError } = await supabase
    .from("products")
    .select(
      `
      *,
      reviews:reviews!product_id(count)
    `
    )
    .eq("category", product.category)
    .neq("id", product.id);

  if (relatedError) {
    console.error("Error fetching related products:", relatedError);
  }

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
            {product.category === "others"
              ? "Accessories"
              : product.category.charAt(0).toUpperCase() +
                product.category.slice(1)}
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
              {"★".repeat(updatedProduct.rating) +
                "☆".repeat(5 - updatedProduct.rating)}
            </span>
            <span className={styles.reviews}>
              Reviews ({reviewsData?.length || 0})
            </span>
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
              {product.category === "others"
                ? "Accessories"
                : product.category.charAt(0).toUpperCase() +
                  product.category.slice(1)}
            </p>
            <p>
              <strong>Color:</strong> {product.color}
            </p>
            {product.isNew && <p className={styles.newTag}>New Product</p>}
          </div>
          <button className={styles.addToCartButton}>Add to Cart</button>
        </div>
      </section>

      {/* Вкладки для опису і відгуків */}
      <ClientTabs
        reviewsData={reviewsData || []}
        description={product.description}
      />

      {/* Секція схожих продуктів у вигляді слайдера */}
      <section className={styles.relatedProductsSection}>
        <div className={styles.relatedProductsHeader}>
          <h2 className={styles.relatedProductsTitle}>Related Products</h2>
          {relatedProducts && relatedProducts.length > 0 && (
            <div className={styles.scrollButtons}>
              <button id="scrollLeft" className={styles.scrollButton}>
                <ChevronLeft size={24} />
              </button>
              <button id="scrollRight" className={styles.scrollButton}>
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>
        {relatedProducts && relatedProducts.length > 0 ? (
          <ClientSlider relatedProducts={relatedProducts} />
        ) : (
          <p>No related products found.</p>
        )}
      </section>
    </main>
  );
}
