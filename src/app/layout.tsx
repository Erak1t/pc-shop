import { Montserrat } from "next/font/google";
import Link from "next/link";
import "./globals.scss";
import { Search, ShoppingCart } from "lucide-react";
import styles from "./Navbar.module.scss";
import AuthStatus from "../components/AuthStatus/AuthStatus";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--Montserrat",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
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
            </Link>
            <AuthStatus />
          </div>
        </nav>
        {children}
        <footer className="info-footer">
          <p className="info-copyright">
            © 2025 Erik Sodel. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
