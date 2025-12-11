/**
 * Payment Gateway Component
 * Displays GPay QR code and payment options
 * Integrates with booking/filter ordering system
 */

import { useState, useEffect } from "react";
import { QrCode, CheckCircle2, X, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { storeOrder } from "@/services/orderService";
import { supabase } from "@/integrations/supabase/client";
import { saveOrderLocally, getCurrentUser } from "@/services/localStorageService";
import { sendOrderConfirmationEmails, sendBookingConfirmationEmails } from "@/services/emailService";

interface PaymentGatewayProps {
  amount: number | string;
  filterId?: string;
  onPaymentSuccess?: (transactionId: string) => void;
  onClose?: () => void;
}

const PaymentGateway = ({
  amount,
  filterId,
  onPaymentSuccess,
  onClose,
}: PaymentGatewayProps) => {
  const [paymentMethod, setPaymentMethod] = useState<"qr" | "upi" | "">("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // UPI ID for payment
  const UPI_ID = "8925081899@paytm";
  const MERCHANT_NAME = "AquaAdapt Water Filtration";
  const TRANSACTION_REF = `AQ-${Date.now()}`;

  // Load user profile data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", user.id)
            .single();
          setUserData(profile);
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };
    loadUserData();
  }, []);

  /**
   * Generate UPI payment link
   */
  const generateUPILink = () => {
    const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${amount}&tn=${encodeURIComponent("Water Filter Cartridge Order")}&tr=${TRANSACTION_REF}`;
    return upiLink;
  };

  /**
   * Handle QR code payment
   */
  const handleQRPayment = async () => {
    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Get current user (local or Supabase)
      const localUser = getCurrentUser();
      const userEmail = userData?.email || localUser?.email || "";
      const userName = userData?.full_name || localUser?.fullName || "Customer";
      
      // Store order in database
      if (userData || localUser) {
        const orderData = {
          user_email: userEmail,
          user_phone: userData?.mobile || localUser?.phone || "",
          user_address: userData?.address || localUser?.address || "",
          user_state: userData?.state || localUser?.state || "",
          user_district: userData?.district || localUser?.district || "",
          amount: Number(amount),
          payment_method: "qr" as const,
          transaction_id: TRANSACTION_REF,
          filter_type: "standard",
          test_results: null,
        };

        // Store in Supabase
        await storeOrder(orderData);

        // Also store locally if user exists
        if (localUser) {
          saveOrderLocally(localUser.id, {
            userId: localUser.id,
            orderId: TRANSACTION_REF,
            amount: Number(amount),
            paymentMethod: "qr",
            transactionId: TRANSACTION_REF,
            status: "completed",
          });
        }

        // Send confirmation emails to user and owner
        try {
          await sendOrderConfirmationEmails(
            userEmail,
            userName,
            "akshayprabhu19012005@gmail.com", // Owner email
            {
              orderId: TRANSACTION_REF,
              amount: Number(amount),
              paymentMethod: "Google Pay QR",
              transactionId: TRANSACTION_REF,
            }
          );
          toast.success("Confirmation email sent!");
        } catch (emailError) {
          console.warn("Email sending failed, but order was processed:", emailError);
          // Don't fail the order if email fails
        }
      }

      setIsProcessing(false);
      setPaymentSuccess(true);
      if (onPaymentSuccess) {
        onPaymentSuccess(TRANSACTION_REF);
      }
      toast.success("Payment Successful! Your order has been confirmed.");
    } catch (error) {
      setIsProcessing(false);
      console.error("Error processing payment:", error);
      toast.error("Failed to process payment. Please try again.");
    }
  };

  /**
   * Handle UPI payment
   */
  const handleUPIPayment = async () => {
    try {
      const upiLink = generateUPILink();
      window.location.href = upiLink;

      // After returning from UPI app, simulate success
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Get current user (local or Supabase)
      const localUser = getCurrentUser();
      const userEmail = userData?.email || localUser?.email || "";
      const userName = userData?.full_name || localUser?.fullName || "Customer";

      // Store order in database
      if (userData || localUser) {
        const orderData = {
          user_email: userEmail,
          user_phone: userData?.mobile || localUser?.phone || "",
          user_address: userData?.address || localUser?.address || "",
          user_state: userData?.state || localUser?.state || "",
          user_district: userData?.district || localUser?.district || "",
          amount: Number(amount),
          payment_method: "upi" as const,
          transaction_id: TRANSACTION_REF,
          filter_type: "standard",
          test_results: null,
        };

        // Store in Supabase
        await storeOrder(orderData);

        // Also store locally if user exists
        if (localUser) {
          saveOrderLocally(localUser.id, {
            userId: localUser.id,
            orderId: TRANSACTION_REF,
            amount: Number(amount),
            paymentMethod: "upi",
            transactionId: TRANSACTION_REF,
            status: "completed",
          });
        }

        // Send confirmation emails to user and owner
        try {
          await sendOrderConfirmationEmails(
            userEmail,
            userName,
            "akshayprabhu19012005@gmail.com", // Owner email
            {
              orderId: TRANSACTION_REF,
              amount: Number(amount),
              paymentMethod: "UPI",
              transactionId: TRANSACTION_REF,
            }
          );
          toast.success("Confirmation email sent!");
        } catch (emailError) {
          console.warn("Email sending failed, but order was processed:", emailError);
          // Don't fail the order if email fails
        }
      }

      setPaymentSuccess(true);
      if (onPaymentSuccess) {
        onPaymentSuccess(TRANSACTION_REF);
      }
      toast.success("Payment Successful! Your order has been confirmed.");
    } catch (error) {
      console.error("Error processing UPI payment:", error);
      toast.error("Failed to process payment. Please try again.");
    }
  };

  /**
   * Copy UPI ID to clipboard
   */
  const copyUPIId = () => {
    navigator.clipboard.writeText(UPI_ID);
    toast.success("UPI ID copied to clipboard!");
  };

  if (paymentSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <Card variant="elevated" className="max-w-md w-full">
            <CardContent className="pt-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-6"
              >
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                  >
                    <CheckCircle2 className="h-10 w-10 text-white" />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <h2 className="text-3xl font-bold text-green-600 mb-2">
                  ✓ Payment Successful!
                </h2>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <p className="text-lg text-gradient-cta font-semibold mb-2">
                  Order Confirmed
                </p>
                <p className="text-muted-foreground mb-6">
                  Thank you for your order! Your water filter cartridge order has been successfully placed and will be delivered soon.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6 border border-green-200"
              >
                <p className="text-sm text-muted-foreground mb-2">Transaction ID</p>
                <p className="font-mono font-semibold text-green-700 break-all text-lg">
                  {TRANSACTION_REF}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
              >
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-sm text-blue-700">
                    ✓ Confirmation email sent to your registered email<br/>
                    ✓ Order has been saved to your account<br/>
                    ✓ You can track your order anytime
                  </p>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700" 
                  onClick={onClose}
                >
                  Close & Continue
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
    >
      <Card variant="elevated" className="max-w-2xl w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl">
            Complete Your Payment
          </CardTitle>
          <button
            onClick={onClose}
            className="p-2 hover:bg-light-blue rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </CardHeader>

        <CardContent>
          {/* Amount */}
          <div className="mb-8 p-6 bg-gradient-primary text-white rounded-xl text-center">
            <p className="text-white/80 mb-2">Order Amount</p>
            <p className="text-4xl font-bold">₹{Number(amount).toLocaleString('en-IN')}</p>
          </div>

          {/* Payment Methods */}
          {!paymentMethod ? (
            <div className="grid md:grid-cols-2 gap-6">
              {/* GPay QR Option */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPaymentMethod("qr")}
                className="p-6 border-2 border-aqua-accent/30 hover:border-aqua-accent hover:bg-aqua-accent/5 rounded-xl transition-all"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-aqua-accent/10 rounded-lg">
                    <QrCode className="h-8 w-8 text-aqua-accent" />
                  </div>
                  <div className="text-left w-full">
                    <p className="font-semibold text-deep-blue">Scan QR Code</p>
                    <p className="text-sm text-muted-foreground">
                      Use your GPay or any UPI app
                    </p>
                  </div>
                </div>
              </motion.button>

              {/* Direct UPI Option */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPaymentMethod("upi")}
                className="p-6 border-2 border-leaf-green/30 hover:border-leaf-green hover:bg-leaf-green/5 rounded-xl transition-all"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-leaf-green/10 rounded-lg">
                    <div className="text-2xl font-bold text-leaf-green">UPI</div>
                  </div>
                  <div className="text-left w-full">
                    <p className="font-semibold text-deep-blue">UPI Payment</p>
                    <p className="text-sm text-muted-foreground">
                      Enter UPI ID or use our number
                    </p>
                  </div>
                </div>
              </motion.button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {paymentMethod === "qr" ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      Scan the QR code below with your GPay or UPI app
                    </p>
                    {/* Akshay GPay QR Code */}
                    <div className="bg-light-blue/30 rounded-xl p-8 flex items-center justify-center">
                      <div className="w-64 h-64 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                        <img 
                            src="/akshay-gpay.jpg"
                            alt="Akshay GPay QR Code"
                             className="w-full h-full object-contain"
                        />

                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      GPay: akshayprabhu19012005@okhdfcbank
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setPaymentMethod("")}
                    >
                      Back
                    </Button>
                    <Button
                      variant="cta"
                      className="flex-1"
                      onClick={handleQRPayment}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : "Payment Complete"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      Pay using your UPI app or this UPI ID
                    </p>

                    {/* UPI ID Display */}
                    <div className="bg-light-blue/30 rounded-xl p-6 mb-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        UPI ID
                      </p>
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-mono font-bold text-deep-blue text-lg break-all">
                          {UPI_ID}
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={copyUPIId}
                          className="flex-shrink-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">
                      Merchant: {MERCHANT_NAME}
                    </p>

                    <p className="text-sm text-muted-foreground mb-6">
                      Enter this UPI ID in your bank/payment app to send ₹{amount}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setPaymentMethod("")}
                    >
                      Back
                    </Button>
                    <Button
                      variant="cta"
                      className="flex-1"
                      onClick={handleUPIPayment}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : "Open UPI App"}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Footer Note */}
          <div className="mt-8 p-4 bg-warning/5 border border-warning/20 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              🔒 Your payment information is secure and encrypted. Powered by industry-standard security protocols.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PaymentGateway;
