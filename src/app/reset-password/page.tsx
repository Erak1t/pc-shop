"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import styles from "./ResetPassword.module.scss";

export default function ResetPassword() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Перевіряємо, чи є подія скидання пароля
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        console.log("Password recovery event detected:", session);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error("Error updating password:", error);
        throw new Error(error.message || "Failed to update password.");
      }

      console.log("Password updated successfully");
      setSuccess("Your password has been updated successfully!");
      setTimeout(() => {
        router.push("/loginPage");
      }, 3000); // Redirect to login page after 3 seconds
    } catch (err: any) {
      console.error("Password update failed:", err);
      setError(
        err.message || "An error occurred while updating your password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.resetPasswordPage}>
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>
          Home
        </Link>
        <span className={styles.breadcrumbSeparator}> &gt; </span>
        <Link href="/loginPage" className={styles.breadcrumbLink}>
          Login
        </Link>
        <span className={styles.breadcrumbSeparator}> &gt; </span>
        <span>Reset Password</span>
      </div>

      <h1 className={styles.title}>Reset Password</h1>

      <section className={styles.formSection}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="newPassword" className={styles.label}>
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={styles.input}
              placeholder="Enter your new password"
              required
              minLength={6}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <p className={styles.backToLogin}>
          <Link href="/loginPage" className={styles.loginLink}>
            Back to Login
          </Link>
        </p>
      </section>
    </main>
  );
}
