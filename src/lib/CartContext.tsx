"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

// Тип для товару в кошику
interface CartItem {
  id: number;
  user_id: string;
  product_id: number;
  quantity: number;
  products: {
    id: number;
    name: string;
    image: string;
    price: number;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  fetchCartItems: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);

  const fetchCartItems = async () => {
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData.user) {
        setCartItems([]);
        setCartCount(0);
        return;
      }

      const userId = userData.user.id;

      const { data, error } = await supabase
        .from("cart_items")
        .select(
          `
          *,
          products (
            id,
            name,
            image,
            price
          )
        `
        )
        .eq("user_id", userId)
        .order("id", { ascending: true }); // Додаємо сортування за id

      if (error) {
        throw new Error(error.message);
      }

      setCartItems(data || []);
      const totalCount = (data || []).reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setCartCount(totalCount);
    } catch (err: any) {
      console.error("Error fetching cart items:", err);
      setCartItems([]);
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCartItems();

    const channel = supabase
      .channel("cart-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cart_items" },
        () => {
          fetchCartItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, cartCount, fetchCartItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
