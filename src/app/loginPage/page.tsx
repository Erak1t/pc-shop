"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./SignIn.module.scss";
import { Chrome, Facebook, Github, Linkedin } from "lucide-react";

export default function SignInPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.target as any).email.value;
    const password = (e.target as any).password.value;
    console.log("Sign In - Email:", email, "Password:", password);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = (e.target as any).name.value;
    const email = (e.target as any).email.value;
    const password = (e.target as any).password.value;
    console.log(
      "Sign Up - Name:",
      name,
      "Email:",
      email,
      "Password:",
      password
    );
  };

  return (
    <main className="flex justify-center items-center min-h-[calc(100vh-80px)]">
      <div className={`${styles.container} ${isSignUp ? styles.active : ""}`}>
        {/* Форма Sign Up */}
        <div className={`${styles["form-container"]} ${styles["sign-up"]}`}>
          <form onSubmit={handleSignUpSubmit}>
            <h1>Create Account</h1>
            <div className={styles["social-icons"]}>
              <a href="#" className={styles.icon}>
                <Chrome className="h-6 w-6" />
              </a>
              <a href="#" className={styles.icon}>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://github.com/Erak1t" className={styles.icon}>
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className={styles.icon}>
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
            <span>or use your email for registration</span>
            <input type="text" name="name" placeholder="Name" required />
            <input type="email" name="email" placeholder="Email" required />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
            />
            <button type="submit">Sign Up</button>
          </form>
        </div>

        {/* Форма Sign In */}
        <div className={`${styles["form-container"]} ${styles["sign-in"]}`}>
          <form onSubmit={handleSignInSubmit}>
            <h1>Sign In</h1>
            <div className={styles["social-icons"]}>
              <a href="#" className={styles.icon}>
                <Chrome className="h-6 w-6" />
              </a>
              <a href="#" className={styles.icon}>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className={styles.icon}>
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className={styles.icon}>
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
            <span>or use your email password</span>
            <input type="email" name="email" placeholder="Email" required />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
            />
            <Link href="/forgot-password">Forgot Your Password?</Link>
            <button type="submit">Sign In</button>
          </form>
        </div>

        {/* Панель перемикання */}
        <div className={styles["toggle-container"]}>
          <div className={styles.toggle}>
            <div
              className={`${styles["toggle-panel"]} ${styles["toggle-left"]}`}
            >
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all of site features</p>
              <button
                type="button"
                className={styles.hidden}
                onClick={handleToggle}
              >
                Sign In
              </button>
            </div>
            <div
              className={`${styles["toggle-panel"]} ${styles["toggle-right"]}`}
            >
              <h1>Hello Friend!</h1>
              <p>
                Register with your personal details to use all of site features
              </p>
              <button
                type="button"
                className={styles.hidden}
                onClick={handleToggle}
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
