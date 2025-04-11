"use client";

import Link from "next/link";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import styles from "./navBar.module.scss";
import AuthStatus from "./AuthStatus/AuthStatus";
import { useCart } from "../lib/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { cartCount } = useCart();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(""); // Стан для пошукового запиту
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Стан для бургер-меню

  // Обробка введення в поле пошуку
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Обробка пошуку при натисканні Enter
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false); // Закриваємо меню після пошуку
    }
  };

  // Обробка кліку на іконку пошуку
  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false); // Закриваємо меню після пошуку
    }
  };

  // Перемикання бургер-меню
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.leftSection}>
        <Link href="/" className={styles.logo}>
          PC-Shop
        </Link>
        <button className={styles.menuToggle} onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div
          className={`${styles.navLinks} ${isMenuOpen ? styles.active : ""}`}
        >
          <Link href="/laptops" onClick={() => setIsMenuOpen(false)}>
            Laptops
          </Link>
          <Link href="/desktopPCs" onClick={() => setIsMenuOpen(false)}>
            Desktop PCs
          </Link>
          <Link href="/partsPC" onClick={() => setIsMenuOpen(false)}>
            PC Parts
          </Link>
          <Link href="/others" onClick={() => setIsMenuOpen(false)}>
            All Other Products
          </Link>
          <form
            onSubmit={handleSearchSubmit}
            className={styles.searchContainerMobile}
          >
            <Search className={styles.searchIcon} onClick={handleSearchClick} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchInput}
            />
          </form>
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
