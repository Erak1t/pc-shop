import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
import styles from "./ProductDetails.module.scss";
import { ClientTabs, ClientSlider } from "./ClientComponents";

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

export default async function ProductDetails({ params }: ProductPageProps) {
  // Отримуємо продукт за id із Supabase
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*")
    .eq("id", parseInt(params.id))
    .single();

  // Якщо продукт не знайдено або сталася помилка
  if (productError || !product) {
    return <div>Product not found</div>;
  }

  // Отримуємо схожі продукти (з тієї ж категорії, але не поточний продукт)
  const { data: relatedProducts, error: relatedError } = await supabase
    .from("products")
    .select("*")
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
      <ClientTabs reviewsData={reviewsData} description={product.description} />

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
