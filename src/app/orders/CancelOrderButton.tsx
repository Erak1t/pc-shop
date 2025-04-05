"use client";

import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import styles from "./OrderDetails.module.scss";

interface CancelOrderButtonProps {
  orderId: number;
  status: string;
}

export default function CancelOrderButton({
  orderId,
  status,
}: CancelOrderButtonProps) {
  const router = useRouter();

  const handleCancelOrder = async () => {
    if (status !== "Pending") {
      alert("Only orders with status 'Pending' can be cancelled.");
      return;
    }

    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: "Cancelled" })
        .eq("id", orderId);

      if (error) {
        console.error("Error cancelling order:", error);
        alert("Failed to cancel the order. Please try again.");
        return;
      }

      router.refresh(); // Оновити сторінку
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert("An error occurred while cancelling the order.");
    }
  };

  if (status !== "Pending") {
    return null;
  }

  return (
    <button onClick={handleCancelOrder} className={styles.cancelButton}>
      Cancel Order
    </button>
  );
}
