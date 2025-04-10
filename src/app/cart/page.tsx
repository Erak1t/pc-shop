"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./Cart.module.scss";
import { useCart } from "../../lib/CartContext";
import { supabase } from "../../lib/supabaseClient";

export default function CartPage() {
  const router = useRouter();
  const { cartItems, fetchCartItems } = useCart(); // Додаємо fetchCartItems

  // Зміна кількості товару
  const updateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
        .eq("id", cartItemId);

      if (error) throw new Error(error.message);

      // Оновлюємо кошик після зміни
      await fetchCartItems();
    } catch (err: any) {
      console.error("Error updating quantity:", err);
    }
  };

  // Видалення товару з кошика
  const removeItem = async (cartItemId: number) => {
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", cartItemId);

      if (error) throw new Error(error.message);

      // Оновлюємо кошик після видалення
      await fetchCartItems();
    } catch (err: any) {
      console.error("Error removing item:", err);
    }
  };

  // Підрахунок загальної суми
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.products.price * item.quantity,
    0
  );

  // Перенаправлення на сторінку Checkout
  const handleProceedToCheckout = () => {
    router.push("/checkout");
  };

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
        {cartItems.length > 0 ? (
          <>
            <div className={styles.cartItems}>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <Image
                      src={item.products.image}
                      alt={item.products.name}
                      width={100}
                      height={100}
                      className={styles.productImage}
                    />
                  </div>
                  <div className={styles.itemDetails}>
                    <h3 className={styles.itemName}>{item.products.name}</h3>
                    <p className={styles.itemPrice}>
                      ${item.products.price.toFixed(2)} x {item.quantity}
                    </p>
                    <p className={styles.itemTotal}>
                      Total: ${(item.products.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className={styles.itemActions}>
                    <button
                      className={styles.quantityButton}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className={styles.quantity}>{item.quantity}</span>
                    <button
                      className={styles.quantityButton}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      className={styles.removeButton}
                      onClick={() => removeItem(item.id)}
                    >
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
              <button
                className={styles.checkoutButton}
                onClick={handleProceedToCheckout}
              >
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
