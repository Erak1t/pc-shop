import styles from "./Banner1.module.scss";
import productsData from "../../data/products.json";
import Link from "next/link";

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

// Знаходимо продукт "Apple MacBook Air 13-inch M2 2023"
const featuredProduct = productsData.find(
  (product: Product) => product.id === 2
) as Product;

export default function Banner() {
  if (!featuredProduct) {
    return <div>Product not found</div>;
  }

  return (
    <section className={styles.banner}>
      <div className={styles.textContent}>
        <h1>{featuredProduct.name}</h1>
        <p>{featuredProduct.description || "No description available"}</p>
        <span className={styles.price}>
          ${featuredProduct.price.toFixed(2)}
        </span>
        <Link href={`/products/${featuredProduct.id}`}>
          <button className={styles.buyButton}>Buy Now</button>
        </Link>
      </div>
      <div className={styles.imageContent}>
        <img
          src={featuredProduct.image}
          alt={featuredProduct.name}
          className={styles.productImage}
        />
      </div>
    </section>
  );
}
