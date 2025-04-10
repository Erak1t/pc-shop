"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import styles from "../navBar.module.scss";

export default function AuthStatus() {
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError) {
          console.error("Error fetching auth user:", authError);
          setUser(null);
          setUsername(null);
          return;
        }

        console.log("Fetched user from auth:", user);

        if (user) {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("username")
            .eq("auth_id", user.id)
            .single();

          if (userError) {
            console.error(
              "Error fetching user data from users table:",
              userError
            );
            setUser(user);
            setUsername(null);
          } else {
            console.log("Fetched user data from users table:", userData);
            setUser(user);
            setUsername(userData?.username || null);
          }
        } else {
          console.log("No user found in auth session");
          setUser(null);
          setUsername(null);
        }
      } catch (error) {
        console.error("Unexpected error in fetchUser:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session);
      fetchUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/loginPage");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return <span className={styles.loading}>Loading...</span>;
  }

  return (
    <div className={styles["auth-status"]}>
      {user ? (
        <div className={styles["user-info"]}>
          <Link
            href="/profile"
            className={styles["user-icon-link"]}
            title={username || user.email}
          >
            <User className={styles["user-icon"]} />
          </Link>
          <button onClick={handleSignOut} className={styles["sign-out-button"]}>
            Sign Out
          </button>
        </div>
      ) : (
        <Link href="/loginPage" className={styles["sign-in-button"]}>
          Sign In
        </Link>
      )}
    </div>
  );
}
