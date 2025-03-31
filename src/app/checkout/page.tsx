import Link from "next/link";
import Image from "next/image";
import styles from "./Checkout.module.scss";

// Тип для товару в кошику
interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

// Фіктивні дані кошика (поки що для прикладу)
const mockCartItems: CartItem[] = [
  {
    id: 1,
    name: "MacBook Air M1",
    image: "/images/macbook-air-m1.jpg",
    price: 999.99,
    quantity: 1,
  },
  {
    id: 2,
    name: "Gaming Mouse",
    image: "/images/gaming-mouse.jpg",
    price: 49.99,
    quantity: 2,
  },
];

export default function CheckoutPage() {
  // Підрахунок загальної суми (поки що статично)
  const subtotal = mockCartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shippingCost = 0; // Поки що безкоштовна доставка
  const totalPrice = subtotal + shippingCost;

  return (
    <main className={styles.checkoutPage}>
      <section className={styles.topSection}>
        <div className={styles.breadcrumb}>
          <Link href="/" className={styles.breadcrumbLink}>
            Home
          </Link>
          <span className={styles.breadcrumbSeparator}> &gt; </span>
          <Link href="/cart" className={styles.breadcrumbLink}>
            Cart
          </Link>
          <span className={styles.breadcrumbSeparator}> &gt; </span>
          <span>Checkout</span>
        </div>
      </section>

      <section className={styles.checkoutSection}>
        <h1 className={styles.checkoutTitle}>Checkout</h1>
        <div className={styles.checkoutContent}>
          {/* Форма для введення даних */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Shipping Information</h2>
            <form className={styles.checkoutForm}>
              <div className={styles.formGroup}>
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  placeholder="John Doe"
                  disabled
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="john.doe@example.com"
                  disabled
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  placeholder="123 Main St, City, Country"
                  disabled
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="+1234567890"
                  disabled
                />
              </div>

              <h2 className={styles.sectionTitle}>Payment Method</h2>
              <div className={styles.formGroup}>
                <label>
                  <input type="radio" name="payment" value="card" disabled />
                  Credit/Debit Card
                </label>
                <label>
                  <input type="radio" name="payment" value="paypal" disabled />
                  PayPal
                </label>
                <label>
                  <input type="radio" name="payment" value="cash" disabled />
                  Cash on Delivery
                </label>
              </div>
            </form>
          </div>

          {/* Підсумок замовлення */}
          <div className={styles.summarySection}>
            <h2 className={styles.sectionTitle}>Order Summary</h2>
            <div className={styles.orderItems}>
              {mockCartItems.map((item) => (
                <div key={item.id} className={styles.orderItem}>
                  <div className={styles.itemImage}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={60}
                      height={60}
                      className={styles.productImage}
                    />
                  </div>
                  <div className={styles.itemDetails}>
                    <p className={styles.itemName}>{item.name}</p>
                    <p className={styles.itemPrice}>
                      ${item.price.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.summaryDetails}>
              <p>
                Subtotal: <span>${subtotal.toFixed(2)}</span>
              </p>
              <p>
                Shipping:{" "}
                <span>
                  {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
                </span>
              </p>
              <p className={styles.total}>
                Total: <span>${totalPrice.toFixed(2)}</span>
              </p>
            </div>
            <button className={styles.placeOrderButton} disabled>
              Place Order
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
