import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "../../../../lib/supabaseClient";
import styles from "./ProductDetails.module.scss";
import { ClientTabs, ClientSlider } from "./ClientComponents";
import AddToCartButton from "./AddToCartButton";

// Тип для сирих даних із Supabase
interface RawProduct {
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
  reviews: { count: number }[];
}

// Тип для нормалізованого продукту (для ProductCard)
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

// Функція для нормалізації продукту
const normalizeProduct = (rawProduct: RawProduct): Product => ({
  ...rawProduct,
  reviews: rawProduct.reviews[0]?.count || 0,
});

export default async function ProductDetails({ params }: ProductPageProps) {
  const productId = parseInt(params.id);
  if (isNaN(productId)) {
    return <div>Invalid product ID</div>;
  }

  const { data: rawProduct, error: productError } = await supabase
    .from("products")
    .select(
      `
      *,
      reviews:reviews!product_id(count)
    `
    )
    .eq("id", productId)
    .single();

  if (productError || !rawProduct) {
    return <div>Product not found</div>;
  }

  const { data: reviewsData, error: reviewsError } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", rawProduct.id)
    .order("date", { ascending: false });

  if (reviewsError) {
    console.error("Error fetching reviews:", reviewsError);
  }

  const averageRating =
    reviewsData && reviewsData.length > 0
      ? Math.round(
          reviewsData.reduce(
            (sum: number, review: Review) => sum + review.rating,
            0
          ) / reviewsData.length
        )
      : rawProduct.rating;

  const { error: updateError } = await supabase
    .from("products")
    .update({ rating: averageRating })
    .eq("id", rawProduct.id);

  if (updateError) {
    console.error("Error updating product rating:", updateError);
  }

  const product: Product = normalizeProduct({
    ...rawProduct,
    rating: averageRating,
  });

  const { data: rawRelatedProducts, error: relatedError } = await supabase
    .from("products")
    .select(
      `
      *,
      reviews:reviews!product_id(count)
    `
    )
    .eq("category", rawProduct.category)
    .neq("id", rawProduct.id);

  if (relatedError) {
    console.error("Error fetching related products:", relatedError);
  }

  const relatedProducts: Product[] =
      rawRelatedProducts?.map((raw) => normalizeProduct(raw)) || [];

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
              {"★".repeat(product.rating) + "☆".repeat(5 - product.rating)}
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
          <AddToCartButton productId={product.id} />
        </div>
      </section>

      <ClientTabs
        reviewsData={reviewsData || []}
        description={product.description}
      />

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
