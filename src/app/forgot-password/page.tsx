"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import styles from "./ForgotPassword.module.scss";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error("Error sending password reset email:", error);
        throw new Error(error.message || "Failed to send reset email.");
      }

      console.log("Password reset email sent successfully to:", email);
      setSuccess(
        "A password reset link has been sent to your email. Please check your inbox (and spam folder)."
      );
      setTimeout(() => {
        router.push("/loginPage");
      }, 3000); // Redirect to login page after 3 seconds
    } catch (err: any) {
      console.error("Reset password failed:", err);
      setError(
        err.message || "An error occurred while sending the reset email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.forgotPasswordPage}>
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>
          Home
        </Link>
        <span className={styles.breadcrumbSeparator}> &gt; </span>
        <Link href="/loginPage" className={styles.breadcrumbLink}>
          Login
        </Link>
        <span className={styles.breadcrumbSeparator}> &gt; </span>
        <span>Forgot Password</span>
      </div>

      <h1 className={styles.title}>Forgot Password</h1>

      <section className={styles.formSection}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="Enter your email"
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className={styles.backToLogin}>
          Remember your password?{" "}
          <Link href="/loginPage" className={styles.loginLink}>
            Back to Login
          </Link>
        </p>
      </section>
    </main>
  );
}
