"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import styles from "./Cart.module.scss";

// Тип для товару в кошику
interface CartItem {
  id: number;
  user_id: string;
  product_id: number;
  quantity: number;
  products: {
    id: number;
    name: string;
    image: string;
    price: number;
  };
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Завантаження товарів із кошика
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError || !userData.user) {
          throw new Error("User not authenticated");
        }

        const userId = userData.user.id;

        const { data, error } = await supabase
          .from("cart_items")
          .select(
            `
            *,
            products (
              id,
              name,
              image,
              price
            )
          `
          )
          .eq("user_id", userId);

        if (error) {
          throw new Error(error.message);
        }

        setCartItems(data || []);
      } catch (err: any) {
        console.error("Error fetching cart items:", err);
        setError(err.message || "Failed to load cart items.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  // Зміна кількості товару
  const updateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return; // Не дозволяємо кількості бути меншою за 1

    try {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
        .eq("id", cartItemId);

      if (error) {
        throw new Error(error.message);
      }

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err: any) {
      console.error("Error updating quantity:", err);
      setError(err.message || "Failed to update quantity.");
    }
  };

  // Видалення товару з кошика
  const removeItem = async (cartItemId: number) => {
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", cartItemId);

      if (error) {
        throw new Error(error.message);
      }

      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== cartItemId)
      );
    } catch (err: any) {
      console.error("Error removing item:", err);
      setError(err.message || "Failed to remove item.");
    }
  };

  // Підрахунок загальної суми
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.products.price * item.quantity,
    0
  );

  // Оформлення замовлення
  const handleCheckout = async () => {
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error("User not authenticated");
      }

      const userId = userData.user.id;

      // Створюємо замовлення
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: userId,
          total: totalPrice,
          created_at: new Date().toISOString(),
          status: "Pending",
        })
        .select()
        .single();

      if (orderError || !orderData) {
        throw new Error(orderError?.message || "Failed to create order");
      }

      const orderId = orderData.id;

      // Додаємо товари до order_items
      const orderItems = cartItems.map((item) => ({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.products.price,
      }));

      const { error: orderItemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (orderItemsError) {
        throw new Error(orderItemsError.message || "Failed to add order items");
      }

      // Очищаємо кошик
      const { error: clearCartError } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", userId);

      if (clearCartError) {
        throw new Error(clearCartError.message || "Failed to clear cart");
      }

      // Перенаправляємо на сторінку замовлення
      router.push(`/orders/${orderId}`);
    } catch (err: any) {
      console.error("Error during checkout:", err);
      setError(err.message || "Failed to complete checkout.");
    }
  };

  if (loading) {
    return <div className={styles.cartPage}>Loading...</div>;
  }

  if (error) {
    return (
      <div className={styles.cartPage}>
        <p className={styles.error}>{error}</p>
        <Link href="/" className={styles.continueShopping}>
          Continue Shopping
        </Link>
      </div>
    );
  }

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
                onClick={handleCheckout}
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
