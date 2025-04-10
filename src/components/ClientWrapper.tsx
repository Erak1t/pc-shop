"use client";

import { CartProvider } from "../lib/CartContext";
import Navbar from "./Navbar";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <Navbar />
      {children}
    </CartProvider>
  );
}
