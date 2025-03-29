import Link from "next/link";
import Image from "next/image";
import styles from "./Cart.module.scss";

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

export default function CartPage() {
  // Підрахунок загальної суми (поки що статично)
  const totalPrice = mockCartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <main className={styles.cartPage}>
      <section className={styles.topSection}>
        <div className={styles.breadcrumb}>
          <Link href="/" className={styles.breadcrumbLink}>
            Home
          </Link>
          <span className={styles.breadcrumbSeparator}> &gt; </span>
          <span>Cart</span>
        </div>
      </section>

      <section className={styles.cartSection}>
        <h1 className={styles.cartTitle}>Your Cart</h1>
        {mockCartItems.length > 0 ? (
          <>
            <div className={styles.cartItems}>
              {mockCartItems.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={100}
                      height={100}
                      className={styles.productImage}
                    />
                  </div>
                  <div className={styles.itemDetails}>
                    <h3 className={styles.itemName}>{item.name}</h3>
                    <p className={styles.itemPrice}>
                      ${item.price.toFixed(2)} x {item.quantity}
                    </p>
                    <p className={styles.itemTotal}>
                      Total: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className={styles.itemActions}>
                    <button className={styles.quantityButton} disabled>
                      -
                    </button>
                    <span className={styles.quantity}>{item.quantity}</span>
                    <button className={styles.quantityButton} disabled>
                      +
                    </button>
                    <button className={styles.removeButton} disabled>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.cartSummary}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>
              <div className={styles.summaryDetails}>
                <p>
                  Subtotal: <span>${totalPrice.toFixed(2)}</span>
                </p>
                <p>
                  Shipping: <span>Free</span>
                </p>
                <p className={styles.total}>
                  Total: <span>${totalPrice.toFixed(2)}</span>
                </p>
              </div>
              <button className={styles.checkoutButton} disabled>
                Proceed to Checkout
              </button>
            </div>
          </>
        ) : (
          <div className={styles.emptyCart}>
            <p>Your cart is empty.</p>
            <Link href="/" className={styles.continueShopping}>
              Continue Shopping
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
