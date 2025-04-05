"use client";

import { useState } from "react";
import { supabase } from "../../../../lib/supabaseClient";
import styles from "./ProductDetails.module.scss";

interface AddToCartButtonProps {
  productId: number;
}

export default function AddToCartButton({ productId }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAddToCart = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error("Please log in to add items to your cart.");
      }

      const userId = userData.user.id;

      // Перевіряємо, чи товар уже є в кошику
      const { data: existingItem, error: fetchError } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", userId)
        .eq("product_id", productId)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw new Error(fetchError.message);
      }

      if (existingItem) {
        // Якщо товар уже є, оновлюємо кількість
        const { error: updateError } = await supabase
          .from("cart_items")
          .update({
            quantity: existingItem.quantity + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingItem.id);

        if (updateError) {
          throw new Error(updateError.message);
        }
      } else {
        // Якщо товару немає, додаємо новий
        const { error: insertError } = await supabase
          .from("cart_items")
          .insert({
            user_id: userId,
            product_id: productId,
            quantity: 1,
          });

        if (insertError) {
          throw new Error(insertError.message);
        }
      }

      setSuccess("Item added to cart!");
    } catch (err: any) {
      console.error("Error adding to cart:", err);
      setError(err.message || "Failed to add item to cart.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        className={styles.addToCartButton}
        onClick={handleAddToCart}
        disabled={loading}
      >
        {loading ? "Adding..." : "Add to Cart"}
      </button>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
    </div>
  );
}
