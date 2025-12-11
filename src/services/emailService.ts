/**
 * Email Service
 * Sends notification emails to user and owner
 */

import {
  orderConfirmationUserTemplate,
  orderConfirmationOwnerTemplate,
  bookingConfirmationUserTemplate,
  bookingConfirmationOwnerTemplate,
} from "./emailTemplates";

interface EmailParams {
  userEmail: string;
  userName: string;
  ownerEmail: string;
  orderData: {
    orderId: string;
    amount: number;
    paymentMethod: string;
    transactionId: string;
    bookingDate?: string;
    bookingTime?: string;
  };
  type: "order" | "booking";
}

/**
 * Send confirmation emails via email service API
 */
export const sendConfirmationEmail = async (params: EmailParams) => {
  try {
    // User email
    const userEmailTemplate = params.type === "order"
      ? orderConfirmationUserTemplate({
          userEmail: params.userEmail,
          userName: params.userName,
          ownerEmail: params.ownerEmail,
          orderId: params.orderData.orderId,
          amount: params.orderData.amount,
          paymentMethod: params.orderData.paymentMethod,
          transactionId: params.orderData.transactionId,
        })
      : bookingConfirmationUserTemplate({
          userEmail: params.userEmail,
          userName: params.userName,
          ownerEmail: params.ownerEmail,
          bookingId: params.orderData.orderId,
          bookingDate: params.orderData.bookingDate || "",
          bookingTime: params.orderData.bookingTime,
        });

    // Owner email
    const ownerEmailTemplate = params.type === "order"
      ? orderConfirmationOwnerTemplate({
          userEmail: params.userEmail,
          userName: params.userName,
          ownerEmail: params.ownerEmail,
          orderId: params.orderData.orderId,
          amount: params.orderData.amount,
          paymentMethod: params.orderData.paymentMethod,
          transactionId: params.orderData.transactionId,
        })
      : bookingConfirmationOwnerTemplate({
          userEmail: params.userEmail,
          userName: params.userName,
          ownerEmail: params.ownerEmail,
          bookingId: params.orderData.orderId,
          bookingDate: params.orderData.bookingDate || "",
          bookingTime: params.orderData.bookingTime,
        });

    // Get Supabase URL from environment
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const emailEndpoint = `${supabaseUrl}/functions/v1/send-email`;

    // Call backend email service for user
    const userResponse = await fetch(emailEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: params.userEmail,
        subject: userEmailTemplate.subject,
        html: userEmailTemplate.html,
      }),
    });

    // Call backend email service for owner
    const ownerResponse = await fetch(emailEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: params.ownerEmail,
        subject: ownerEmailTemplate.subject,
        html: ownerEmailTemplate.html,
      }),
    });

    if (!userResponse.ok || !ownerResponse.ok) {
      console.error("Email service error");
      return false;
    }

    console.log("✓ Emails sent to user and owner");
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

/**
 * Send order confirmation email
 * Email to user: Order placed confirmation
 * Email to owner: New order received
 */
export const sendOrderConfirmationEmails = async (
  userEmail: string,
  userName: string,
  ownerEmail: string,
  orderData: {
    orderId: string;
    amount: number;
    paymentMethod: string;
    transactionId: string;
  }
) => {
  return sendConfirmationEmail({
    userEmail,
    userName,
    ownerEmail,
    orderData,
    type: "order",
  });
};

/**
 * Send booking confirmation email
 * Email to user: Booking confirmed
 * Email to owner: New booking received
 */
export const sendBookingConfirmationEmails = async (
  userEmail: string,
  userName: string,
  ownerEmail: string,
  bookingData: {
    bookingId: string;
    bookingDate: string;
    bookingTime?: string;
  }
) => {
  return sendConfirmationEmail({
    userEmail,
    userName,
    ownerEmail,
    orderData: {
      orderId: bookingData.bookingId,
      amount: 0,
      paymentMethod: "booking",
      transactionId: "",
      bookingDate: bookingData.bookingDate,
      bookingTime: bookingData.bookingTime,
    },
    type: "booking",
  });
};
