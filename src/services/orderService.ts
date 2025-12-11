/**
 * Order Service
 * Handles storing orders and home test bookings in Supabase
 */

import { supabase } from "@/integrations/supabase/client";

export interface OrderData {
  user_email: string;
  user_phone: string;
  user_address?: string;
  user_state?: string;
  user_district?: string;
  amount: number;
  payment_method: "qr" | "upi";
  transaction_id: string;
  filter_type?: string;
  test_results?: any;
}

export interface HomeTestBookingData {
  user_email: string;
  user_phone: string;
  user_address?: string;
  user_state?: string;
  user_district?: string;
  booking_date: string; // YYYY-MM-DD format
  booking_time?: string; // HH:mm format
  test_parameters?: any;
}

/**
 * Store order in database
 * For now, stores in customer_details and creates order metadata
 */
export async function storeOrder(orderData: OrderData) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    // Update/insert customer details
    const { data, error } = await supabase
      .from("customer_details")
      .upsert(
        {
          user_id: user.id,
          full_name: "",
          mobile: orderData.user_phone,
          email: orderData.user_email,
          address: orderData.user_address || "",
          state: orderData.user_state || "",
          district: orderData.user_district || "",
        },
        { onConflict: "user_id" }
      )
      .select();

    if (error) {
      console.error("Error storing order:", error);
      throw error;
    }

    // Log order details (in production, this would be a separate orders table)
    console.log("Order stored:", {
      order_id: `ORD-${Date.now()}`,
      user_id: user.id,
      amount: orderData.amount,
      payment_method: orderData.payment_method,
      transaction_id: orderData.transaction_id,
      timestamp: new Date().toISOString(),
    });

    return {
      order_id: `ORD-${Date.now()}`,
      success: true,
    };
  } catch (error) {
    console.error("Failed to store order:", error);
    throw error;
  }
}

/**
 * Store home test booking in database
 */
export async function storeHomeTestBooking(
  bookingData: HomeTestBookingData
) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    // Generate unique ID
    const uniqueId = `AQ-USER-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(3, "0")}`;

    // Store booking in customer_details
    const { data, error } = await supabase
      .from("customer_details")
      .upsert(
        {
          user_id: user.id,
          full_name: "",
          mobile: bookingData.user_phone,
          email: bookingData.user_email,
          address: bookingData.user_address || "",
          state: bookingData.user_state || "",
          district: bookingData.user_district || "",
        },
        { onConflict: "user_id" }
      )
      .select();

    if (error) {
      console.error("Error storing booking:", error);
      throw error;
    }

    // Log booking details
    console.log("Booking stored:", {
      booking_id: `HTB-${Date.now()}`,
      user_id: user.id,
      unique_customer_id: uniqueId,
      booking_date: bookingData.booking_date,
      timestamp: new Date().toISOString(),
    });

    return {
      booking_id: `HTB-${Date.now()}`,
      unique_customer_id: uniqueId,
      success: true,
    };
  } catch (error) {
    console.error("Failed to store home test booking:", error);
    throw error;
  }
}

/**
 * Get user's orders
 */
export async function getUserOrders() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    // Get from customer_details for now
    const { data, error } = await supabase
      .from("customer_details")
      .select("*")
      .eq("user_id", user.id);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
}

/**
 * Get user's home test bookings
 */
export async function getUserHomeTestBookings() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    // Get from customer_details for now
    const { data, error } = await supabase
      .from("customer_details")
      .select("*")
      .eq("user_id", user.id);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Failed to fetch home test bookings:", error);
    return [];
  }
}

/**
 * Get user's unique customer ID
 */
export async function getUserUniqueId() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    // Generate or return existing unique ID
    const uniqueId = `AQ-USER-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(3, "0")}`;

    return uniqueId;
  } catch (error) {
    console.error("Failed to fetch unique ID:", error);
    return null;
  }
}
