"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./SignIn.module.scss";
import { Chrome, Facebook, Github, Linkedin } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
    setError(null);
  };

  // Функція для входу через email та пароль
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const email = (e.target as any).email.value;
    const password = (e.target as any).password.value;

    try {
      console.log("Attempting to sign in with:", { email });

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("Sign-in error:", signInError);
        throw new Error(signInError.message || "Failed to sign in");
      }

      console.log("User signed in successfully");
      router.push("/");
    } catch (err: any) {
      console.error("Sign-in failed:", err);
      setError(err.message || "An error occurred during sign-in.");
    } finally {
      setLoading(false);
    }
  };

  // Функція для реєстрації через email та пароль
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const name = (e.target as any).name.value;
    const email = (e.target as any).email.value;
    const password = (e.target as any).password.value;

    try {
      console.log("Attempting to sign up with:", { email, name });

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        console.error("Sign-up error:", signUpError);
        throw new Error(signUpError.message || "Failed to sign up");
      }

      const user = data.user;

      if (!user) {
        console.error("No user returned after sign-up:", data);
        throw new Error("No user data returned after sign-up");
      }

      console.log("User signed up successfully:", user);

      // Ручна вставка в таблицю users
      const { error: insertError } = await supabase.from("users").insert({
        auth_id: user.id,
        email: user.email,
        username: name,
        created_at: new Date().toISOString(),
      });

      if (insertError) {
        console.error("Error inserting user into users table:", insertError);
        throw new Error(insertError.message || "Failed to insert user data");
      }

      console.log("User data inserted successfully");
      router.push("/");
    } catch (err: any) {
      console.error("Sign-up failed:", err);
      setError(err.message || "An error occurred during sign-up.");
    } finally {
      setLoading(false);
    }
  };

  // Функція для входу/реєстрації через соціальні мережі
  const handleSocialAuth = async (
    provider: "google" | "facebook" | "github" | "linkedin"
  ) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (err: any) {
      console.error(`Social auth failed with ${provider}:`, err);
      setError(
        err.message || `An error occurred during ${provider} authentication.`
      );
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={`${styles.container} ${isSignUp ? styles.active : ""}`}>
        {/* Форма Sign Up */}
        <div className={`${styles["form-container"]} ${styles["sign-up"]}`}>
          <form onSubmit={handleSignUpSubmit}>
            <h1>Create Account</h1>
            <div className={styles["social-icons"]}>
              <button
                type="button"
                className={styles.icon}
                onClick={() => handleSocialAuth("google")}
                disabled={loading}
              >
                <Chrome className="h-6 w-6" />
              </button>
              <button
                type="button"
                className={styles.icon}
                onClick={() => handleSocialAuth("facebook")}
                disabled={loading}
              >
                <Facebook className="h-6 w-6" />
              </button>
              <button
                type="button"
                className={styles.icon}
                onClick={() => handleSocialAuth("github")}
                disabled={loading}
              >
                <Github className="h-6 w-6" />
              </button>
              <button
                type="button"
                className={styles.icon}
                onClick={() => handleSocialAuth("linkedin")}
                disabled={loading}
              >
                <Linkedin className="h-6 w-6" />
              </button>
            </div>
            <span>or use your email for registration</span>
            <input type="text" name="name" placeholder="Username" required />
            <input type="email" name="email" placeholder="Email" required />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
            />
            {error && isSignUp && <p className={styles.error}>{error}</p>}
            <button type="submit" disabled={loading}>
              {loading && isSignUp ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        </div>

        {/* Форма Sign In */}
        <div className={`${styles["form-container"]} ${styles["sign-in"]}`}>
          <form onSubmit={handleSignInSubmit}>
            <h1>Sign In</h1>
            <div className={styles["social-icons"]}>
              <button
                type="button"
                className={styles.icon}
                onClick={() => handleSocialAuth("google")}
                disabled={loading}
              >
                <Chrome className="h-6 w-6" />
              </button>
              <button
                type="button"
                className={styles.icon}
                onClick={() => handleSocialAuth("facebook")}
                disabled={loading}
              >
                <Facebook className="h-6 w-6" />
              </button>
              <button
                type="button"
                className={styles.icon}
                onClick={() => handleSocialAuth("github")}
                disabled={loading}
              >
                <Github className="h-6 w-6" />
              </button>
              <button
                type="button"
                className={styles.icon}
                onClick={() => handleSocialAuth("linkedin")}
                disabled={loading}
              >
                <Linkedin className="h-6 w-6" />
              </button>
            </div>
            <span>or use your email password</span>
            <input type="email" name="email" placeholder="Email" required />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
            />
            {error && !isSignUp && <p className={styles.error}>{error}</p>}
            <Link href="/forgot-password">Forgot Your Password?</Link>
            <button type="submit" disabled={loading}>
              {loading && !isSignUp ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* Панель перемикання */}
        <div className={styles["toggle-container"]}>
          <div className={styles.toggle}>
            <div
              className={`${styles["toggle-panel"]} ${styles["toggle-left"]}`}
            >
              <h1>Hello Friend!</h1>
              <p>
                Register with your personal details to use all of site features
              </p>
              <button
                type="button"
                className={styles.hidden}
                onClick={handleToggle}
                disabled={loading}
              >
                Sign In
              </button>
            </div>
            <div
              className={`${styles["toggle-panel"]} ${styles["toggle-right"]}`}
            >
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all of site features</p>
              <button
                type="button"
                className={styles.hidden}
                onClick={handleToggle}
                disabled={loading}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
