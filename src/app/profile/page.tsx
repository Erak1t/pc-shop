"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import styles from "./Profile.module.scss";

interface UserData {
  auth_id: string;
  email: string;
  username?: string;
  full_name?: string;
  created_at: string;
}

interface Order {
  id: number;
  user_id: string;
  total: number;
  created_at: string;
  status: string;
}

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      // Тестовий запит для перевірки підключення
      const { data: testData, error: testError } = await supabase
        .from("users")
        .select("auth_id")
        .limit(1);

      if (testError) {
        console.error("Test query error:", testError);
        setError("Error connecting to database.");
        setLoading(false);
        return;
      }

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("Error fetching user:", authError);
        setError("Please log in to view your profile.");
        router.push("/loginPage");
        return;
      }

      setUser(user);
      console.log("Authenticated user ID:", user.id);

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("auth_id, email, username, full_name, created_at")
        .eq("auth_id", user.id)
        .maybeSingle();

      if (userError) {
        console.error("Detailed error fetching user data:", userError);
        console.log("User ID from auth:", user.id);
        setError("Error loading user data.");
      } else if (!userData) {
        console.log("No user data found in users table for auth_id:", user.id);
        setError("User data not found. Please try registering again.");
      } else {
        console.log("User data fetched:", userData);
        setUserData(userData);
      }

      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (ordersError) {
        console.error("Error fetching orders:", ordersError);
      } else {
        setOrders(ordersData || []);
      }

      setLoading(false);
    };

    fetchData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/loginPage");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!user || !userData) {
    return null;
  }

  return (
    <main className={styles.profilePage}>
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>
          Home
        </Link>
        <span className={styles.breadcrumbSeparator}> &gt; </span>
        <span>Profile</span>
      </div>

      <h1 className={styles.title}>My Profile</h1>

      <section className={styles.profileSection}>
        <h2 className={styles.sectionTitle}>Personal Information</h2>
        <div className={styles.profileDetails}>
          <p>
            <strong>Name:</strong> {userData?.full_name || "Not provided"}
          </p>
          <p>
            <strong>Username:</strong> {userData?.username || "Not provided"}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Account Created:</strong>{" "}
            {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className={styles.profileActions}>
          <Link href="/profile/edit" className={styles.editButton}>
            Edit Profile
          </Link>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Log Out
          </button>
        </div>
      </section>

      <section className={styles.ordersSection}>
        <h2 className={styles.sectionTitle}>Order History</h2>
        {orders.length > 0 ? (
          <div className={styles.ordersList}>
            {orders.map((order: Order) => (
              <div key={order.id} className={styles.orderItem}>
                <p>
                  <strong>Order ID:</strong> {order.id}
                </p>
                <p>
                  <strong>Total:</strong> ${order.total.toFixed(2)}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
                <p>
                  <strong>Status:</strong> {order.status}
                </p>
                <Link
                  href={`/orders/${order.id}`}
                  className={styles.viewOrderLink}
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p>No orders found.</p>
        )}
      </section>
    </main>
  );
}
