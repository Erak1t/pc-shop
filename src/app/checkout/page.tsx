"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import { useCart } from "../../lib/CartContext";
import styles from "./Checkout.module.scss";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, fetchCartItems } = useCart();

  // Стан для даних форми
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    paymentMethod: "credit_card", // За замовчуванням
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Обробка змін у формі
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Підрахунок загальної суми
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.products.price * item.quantity,
    0
  );

  // Обробка підтвердження замовлення
  const handleConfirmOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData.user)
        throw new Error("User not authenticated");

      const userId = userData.user.id;

      // Створюємо замовлення в таблиці orders
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: userId,
          total: totalPrice,
          created_at: new Date().toISOString(),
          status: "Pending",
          shipping_details: {
            fullName: formData.fullName,
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
            phone: formData.phone,
          },
          payment_method: formData.paymentMethod,
        })
        .select()
        .single();

      if (orderError || !orderData)
        throw new Error(orderError?.message || "Failed to create order");

      const orderId = orderData.id;

      // Додаємо товари до таблиці order_items
      const orderItems = cartItems.map((item) => ({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.products.price,
      }));

      const { error: orderItemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (orderItemsError)
        throw new Error(orderItemsError.message || "Failed to add order items");

      // Очищаємо кошик
      const { error: clearCartError } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", userId);

      if (clearCartError)
        throw new Error(clearCartError.message || "Failed to clear cart");

      // Оновлюємо кошик
      await fetchCartItems();

      // Перенаправляємо на сторінку замовлення
      router.push(`/orders/${orderId}`);
    } catch (err: any) {
      console.error("Error during checkout:", err);
      setError(err.message || "Failed to process order.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
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
          <div className={styles.emptyCart}>
            <p>Your cart is empty.</p>
            <Link href="/" className={styles.continueShopping}>
              Continue Shopping
            </Link>
          </div>
        </section>
      </main>
    );
  }

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
        <div className={styles.checkoutContainer}>
          <div className={styles.shippingForm}>
            <h2 className={styles.formTitle}>Shipping Information</h2>
            <div className={styles.formGroup}>
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="postalCode">Postal Code</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className={styles.orderSummary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            <div className={styles.summaryItems}>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.summaryItem}>
                  <span>{item.products.name}</span>
                  <span>
                    ${item.products.price.toFixed(2)} x {item.quantity}
                  </span>
                </div>
              ))}
            </div>
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

            <div className={styles.paymentMethod}>
              <h3>Payment Method</h3>
              <div className={styles.formGroup}>
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit_card"
                    checked={formData.paymentMethod === "credit_card"}
                    onChange={handleInputChange}
                  />
                  Credit Card
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === "paypal"}
                    onChange={handleInputChange}
                  />
                  PayPal
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash_on_delivery"
                    checked={formData.paymentMethod === "cash_on_delivery"}
                    onChange={handleInputChange}
                  />
                  Cash on Delivery
                </label>
              </div>
            </div>

            <button
              className={styles.confirmButton}
              onClick={handleConfirmOrder}
              disabled={loading}
            >
              {loading ? "Processing..." : "Confirm Order"}
            </button>
            {error && <p className={styles.error}>{error}</p>}
          </div>
        </div>
      </section>
    </main>
  );
}
