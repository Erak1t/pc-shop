import Link from "next/link";
import { notFound } from "next/navigation"; // Для обробки 404
import { supabase } from "../../../lib/supabaseClient";
import styles from "./OrderDetails.module.scss";
import CancelOrderButton from "./CancelOrderButton";

// Тип для продукту в замовленні
interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
}

// Тип для елемента замовлення
interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  products: Product;
}

// Тип для замовлення
interface Order {
  id: number;
  user_id: string;
  total: number;
  created_at: string;
  status: string;
  order_items: OrderItem[];
}

// Параметри сторінки (отримуємо id із URL)
interface OrderDetailsProps {
  params: { id: string };
}

export default async function OrderDetails({ params }: OrderDetailsProps) {
  // Перевіряємо, чи params.id є числом
  const orderId = parseInt(params.id);
  if (isNaN(orderId)) {
    notFound(); // Повертаємо 404, якщо ID некоректний
  }

  // Отримуємо замовлення за id із Supabase разом із продуктами
  const { data: order, error: orderError } = await supabase
    .from<Order>("orders")
    .select(
      `
      *,
      order_items (
        *,
        products (
          id,
          name,
          image,
          price
        )
      )
    `
    )
    .eq("id", orderId)
    .single();

  // Якщо замовлення не знайдено або сталася помилка
  if (orderError || !order) {
    console.error("Error fetching order:", orderError?.message);
    notFound(); // Повертаємо 404
  }

  // Перетворюємо замовлення у тип Order (не потрібно, якщо типізовано через from<Order>)
  const orderData: Order = order;

  return (
    <main className={styles.orderDetailsPage}>
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>
          Home
        </Link>
        <span className={styles.breadcrumbSeparator}> &gt; </span>
        <Link href="/profile" className={styles.breadcrumbLink}>
          Profile
        </Link>
        <span className={styles.breadcrumbSeparator}> &gt; </span>
        <span>Order #{orderData.id}</span>
      </div>

      <h1 className={styles.title}>Order #{orderData.id}</h1>

      <section className={styles.orderSummary}>
        <div className={styles.orderInfo}>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(orderData.created_at).toLocaleDateString()}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`${styles.status} ${
                orderData.status === "Delivered"
                  ? styles.statusDelivered
                  : orderData.status === "Shipped"
                  ? styles.statusShipped
                  : styles.statusPending
              }`}
            >
              {orderData.status}
            </span>
          </p>
          <p>
            <strong>Total:</strong> ${orderData.total.toFixed(2)}
          </p>
          <CancelOrderButton orderId={orderData.id} status={orderData.status} />
        </div>
      </section>

      <section className={styles.orderItems}>
        <h2 className={styles.sectionTitle}>Items in this Order</h2>
        {orderData.order_items.length > 0 ? (
          <div className={styles.itemsList}>
            {orderData.order_items.map((item) => (
              <div key={item.id} className={styles.item}>
                <div className={styles.itemImage}>
                  {item.products?.image ? (
                    <img
                      src={item.products.image}
                      alt={item.products.name}
                      className={styles.productImage}
                    />
                  ) : (
                    <div className={styles.placeholderImage}>No Image</div>
                  )}
                </div>
                <div className={styles.itemDetails}>
                  <Link
                    href={`/products/${item.product_id}`}
                    className={styles.itemName}
                  >
                    {item.products?.name || "Unknown Product"}
                  </Link>
                  <p>
                    <strong>Quantity:</strong> {item.quantity}
                  </p>
                  <p>
                    <strong>Price per unit:</strong> $
                    {(item.price || 0).toFixed(2)}
                  </p>
                  <p>
                    <strong>Subtotal:</strong> $
                    {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No items found in this order.</p>
        )}
      </section>

      <div className={styles.backToProfile}>
        <Link href="/profile" className={styles.backLink}>
          Back to Profile
        </Link>
      </div>
    </main>
  );
}
