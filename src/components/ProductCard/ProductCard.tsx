import Image from "next/image";
import Link from "next/link";
import styles from "./ProductCard.module.scss";

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

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Отримуємо кількість відгуків, враховуючи різні формати
  const reviewCount =
    typeof product.reviews === "number"
      ? product.reviews
      : Array.isArray(product.reviews) && product.reviews[0]?.count
      ? product.reviews[0].count
      : 0;

  return (
    <Link href={`/products/${product.id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        {product.isNew && <span className={styles.newTag}>New</span>}
        <Image
          src={product.image}
          alt={product.name}
          width={200}
          height={150}
          className={styles.productImage}
        />
      </div>
      <div className={styles.details}>
        <h3 className={styles.name}>{product.name}</h3>
        <div className={styles.rating}>
          <span className={styles.stars}>
            {"★".repeat(product.rating) + "☆".repeat(5 - product.rating)}
          </span>
          <span className={styles.reviews}>({reviewCount})</span>
        </div>
        <div className={styles.price}>${product.price.toFixed(2)}</div>
        <div className={styles.stock}>
          <span
            className={`${styles.stockText} ${
              product.stock === "in stock" ? styles.inStock : styles.outOfStock
            }`}
          >
            {product.stock}
          </span>
        </div>
      </div>
    </Link>
  );
}
