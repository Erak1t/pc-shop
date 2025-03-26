import Image from "next/image";
import Link from "next/link";
import styles from "./ProductCard.module.scss";

interface Product {
  id: number;
  name: string;
  image: string;
  stock: string;
  rating: number;
  reviews: number;
  price: number;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`} className={styles.productCard}>
      <div className={styles.imageContainer}>
        <Image
          src={product.image}
          alt={product.name}
          width={200}
          height={150}
          className={styles.productImage}
        />
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
      </div>
      <div className={styles.rating}>
        <span className={styles.stars}>
          {"★".repeat(product.rating) + "☆".repeat(5 - product.rating)}
        </span>
        <span className={styles.reviews}>Reviews ({product.reviews})</span>
      </div>
      <h3 className={styles.productName}>{product.name}</h3>
      <span className={styles.price}>${product.price.toFixed(2)}</span>
    </Link>
  );
}
