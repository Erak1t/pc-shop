import styles from "./Banner1.module.scss";

export default function Banner() {
  return (
    <section className={styles.banner}>
      <div className={styles.textContent}>
        <h1>New High-Performance Laptop</h1>
        <p>
          Experience the ultimate gaming and productivity with our latest laptop
          model
        </p>
        <span className={styles.price}>$999.99</span>
        <button className={styles.buyButton}>Buy Now</button>
      </div>
      <div className={styles.imageContent}>
        <img
          src="/images/laptop-placeholder.jpg"
          alt="Product"
          className={styles.productImage}
        />
      </div>
    </section>
  );
}
