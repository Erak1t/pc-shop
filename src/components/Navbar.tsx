"use client";

import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";
import styles from "./Navbar.module.scss";
import AuthStatus from "./AuthStatus/AuthStatus";
import { useCart } from "../lib/CartContext";

export default function Navbar() {
  const { cartCount } = useCart();

  return (
    <nav className={styles.navbar}>
      <div className={styles.leftSection}>
        <Link href="/" className={styles.logo}>
          PC-Shop
        </Link>
        <div className={styles.navLinks}>
          <Link href="/laptops">Laptops</Link>
          <Link href="/desktopPCs">Desktop PCs</Link>
          <Link href="/partsPC">PC Parts</Link>
          <Link href="/others">All Other Products</Link>
        </div>
      </div>
      <div className={styles.rightSection}>
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search"
          />
        </div>
        <Link href="/cart" className={styles.cartLink}>
          <ShoppingCart />
          {cartCount > 0 && (
            <span className={styles.cartCount}>{cartCount}</span>
          )}
        </Link>
        <AuthStatus />
      </div>
    </nav>
  );
}
