"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import styles from "./EditProfile.module.scss";

interface UserData {
  auth_id: string;
  email: string;
  username?: string;
  full_name?: string;
  created_at: string;
}

export default function EditProfile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [username, setUsername] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("Error fetching user:", authError);
        setError("Please log in to edit your profile.");
        router.push("/loginPage");
        return;
      }

      setUser(user);
      console.log("Authenticated user ID:", user.id);

      let userData: UserData | null = null;

      // Спробуємо знайти запис у таблиці users
      const { data: fetchedData, error: userError } = await supabase
        .from("users")
        .select("auth_id, email, username, full_name, created_at")
        .eq("auth_id", user.id)
        .maybeSingle();

      if (userError) {
        console.error("Detailed error fetching user data:", userError);
        setError("Error loading user data.");
        setLoading(false);
        return;
      }

      if (!fetchedData) {
        console.log("No user data found in users table for auth_id:", user.id);
        // Створюємо новий запис, якщо він не існує
        const { data: insertedData, error: insertError } = await supabase
          .from("users")
          .insert({
            auth_id: user.id,
            email: user.email,
            created_at: new Date().toISOString(),
          })
          .select("auth_id, email, username, full_name, created_at")
          .single();

        if (insertError) {
          console.error("Error inserting user data:", insertError);
          setError("Failed to create user profile. Please try again.");
          setLoading(false);
          return;
        }

        userData = insertedData;
        console.log("User data inserted:", userData);
      } else {
        userData = fetchedData;
        console.log("User data fetched:", userData);
      }

      setUserData(userData);
      setUsername(userData.username || "");
      setFullName(userData.full_name || "");
      setLoading(false);
    };

    fetchData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!user) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from("users")
        .update({
          username: username.trim(),
          full_name: fullName.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("auth_id", user.id);

      if (updateError) {
        console.error("Error updating user data:", updateError);
        throw new Error(updateError.message || "Failed to update profile.");
      }

      console.log("User data updated successfully");
      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (err: any) {
      console.error("Update failed:", err);
      setError(err.message || "An error occurred while updating your profile.");
    } finally {
      setLoading(false);
    }
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
    <main className={styles.editProfilePage}>
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>
          Home
        </Link>
        <span className={styles.breadcrumbSeparator}> &gt; </span>
        <Link href="/profile" className={styles.breadcrumbLink}>
          Profile
        </Link>
        <span className={styles.breadcrumbSeparator}> &gt; </span>
        <span>Edit Profile</span>
      </div>

      <h1 className={styles.title}>Edit Profile</h1>

      <section className={styles.editSection}>
        <form onSubmit={handleSubmit} className={styles.editForm}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="fullName" className={styles.label}>
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={styles.input}
              placeholder="Enter your full name (optional)"
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <Link href="/profile" className={styles.cancelButton}>
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
