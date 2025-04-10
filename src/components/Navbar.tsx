"use client";

import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";
import styles from "./Navbar.module.scss";
import AuthStatus from "./AuthStatus/AuthStatus";
import { useCart } from "../lib/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { cartCount } = useCart();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(""); // Стан для пошукового запиту

  // Обробка введення в поле пошуку
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Обробка пошуку при натисканні Enter
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Обробка кліку на іконку пошуку
  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

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
        <form onSubmit={handleSearchSubmit} className={styles.searchContainer}>
          <Search className={styles.searchIcon} onClick={handleSearchClick} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchInput}
          />
        </form>
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
