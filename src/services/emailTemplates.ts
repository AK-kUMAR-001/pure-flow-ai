/**
 * Email Templates and Configuration
 * Use with your email service (SendGrid, Nodemailer, etc.)
 */

interface OrderEmailData {
  userEmail: string;
  userName: string;
  ownerEmail: string;
  orderId: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
}

interface BookingEmailData {
  userEmail: string;
  userName: string;
  ownerEmail: string;
  bookingId: string;
  bookingDate: string;
  bookingTime?: string;
}

/**
 * Email template for order confirmation to user
 */
export const orderConfirmationUserTemplate = (data: OrderEmailData) => {
  return {
    subject: "✓ Order Confirmed - AquaAdapt Water Filtration",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; margin-top: 20px; border-radius: 8px; }
            .order-details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #667eea; }
            .order-details p { margin: 8px 0; }
            .label { font-weight: bold; color: #667eea; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .success { color: #27ae60; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌊 Order Confirmed!</h1>
              <p>Thank you for your purchase</p>
            </div>
            
            <div class="content">
              <p>Dear ${data.userName},</p>
              
              <p>Your order has been successfully placed with AquaAdapt Water Filtration. We're excited to deliver you premium water filter cartridges!</p>
              
              <div class="order-details">
                <p><span class="label">Order ID:</span> ${data.orderId}</p>
                <p><span class="label">Amount:</span> ₹${data.amount.toLocaleString('en-IN')}</p>
                <p><span class="label">Payment Method:</span> ${data.paymentMethod}</p>
                <p><span class="label">Transaction ID:</span> ${data.transactionId}</p>
                <p><span class="label">Status:</span> <span class="success">✓ Payment Received</span></p>
              </div>
              
              <p>Your water filter cartridge will be processed and dispatched within 24-48 hours. You will receive a tracking number via email or SMS soon.</p>
              
              <p><strong>What's Next?</strong></p>
              <ul>
                <li>Your order is being prepared</li>
                <li>You'll receive a tracking number once dispatched</li>
                <li>Estimated delivery: 3-5 business days</li>
                <li>Call us for any queries: <strong>8925081899</strong></li>
              </ul>
              
              <p>If you have any questions, please don't hesitate to contact us.</p>
              
              <p>Best regards,<br/>
              <strong>AquaAdapt Water Filtration Team</strong></p>
            </div>
            
            <div class="footer">
              <p>© 2025 AquaAdapt. All rights reserved.</p>
              <p>Phone: 8925081899 | Email: contact@aquaadapt.com</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
};

/**
 * Email template for order notification to owner
 */
export const orderConfirmationOwnerTemplate = (data: OrderEmailData) => {
  return {
    subject: "📦 New Order Received - " + data.orderId,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; margin-top: 20px; border-radius: 8px; }
            .order-details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #f5576c; }
            .order-details p { margin: 8px 0; }
            .label { font-weight: bold; color: #f5576c; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📦 New Order Received</h1>
              <p>Order ID: ${data.orderId}</p>
            </div>
            
            <div class="content">
              <p>Hi Akshay,</p>
              
              <p>A new order has been received! Here are the details:</p>
              
              <div class="order-details">
                <p><span class="label">Customer Name:</span> ${data.userName}</p>
                <p><span class="label">Customer Email:</span> ${data.userEmail}</p>
                <p><span class="label">Order ID:</span> ${data.orderId}</p>
                <p><span class="label">Amount:</span> ₹${data.amount.toLocaleString('en-IN')}</p>
                <p><span class="label">Payment Method:</span> ${data.paymentMethod}</p>
                <p><span class="label">Transaction ID:</span> ${data.transactionId}</p>
                <p><span class="label">Status:</span> <span style="color: #27ae60; font-weight: bold;">✓ Payment Received</span></p>
              </div>
              
              <p><strong>Action Required:</strong></p>
              <ul>
                <li>Verify payment received</li>
                <li>Pick and pack the cartridge</li>
                <li>Generate tracking number</li>
                <li>Update tracking in system</li>
              </ul>
              
              <p><strong>Next Steps:</strong></p>
              <p>Log in to your dashboard to process this order and update customer with tracking information.</p>
            </div>
            
            <div class="footer">
              <p>© 2025 AquaAdapt. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
};

/**
 * Email template for booking confirmation to user
 */
export const bookingConfirmationUserTemplate = (data: BookingEmailData) => {
  return {
    subject: "✓ Booking Confirmed - Free Water Quality Test",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; margin-top: 20px; border-radius: 8px; }
            .booking-details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #667eea; }
            .booking-details p { margin: 8px 0; }
            .label { font-weight: bold; color: #667eea; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .success { color: #27ae60; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Booking Confirmed!</h1>
              <p>Free Water Quality Test</p>
            </div>
            
            <div class="content">
              <p>Dear ${data.userName},</p>
              
              <p>Your booking for a free water quality test has been confirmed! Our expert team will visit your location to analyze your water quality and recommend the best filter solution.</p>
              
              <div class="booking-details">
                <p><span class="label">Booking ID:</span> ${data.bookingId}</p>
                <p><span class="label">Test Date:</span> ${new Date(data.bookingDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                ${data.bookingTime ? `<p><span class="label">Preferred Time:</span> ${data.bookingTime}</p>` : ''}
                <p><span class="label">Status:</span> <span class="success">✓ Confirmed</span></p>
              </div>
              
              <p><strong>What to Expect:</strong></p>
              <ul>
                <li>Free water quality analysis (takes 15-20 minutes)</li>
                <li>Expert consultation on water issues</li>
                <li>Customized filter recommendations</li>
                <li>Special pricing for bookings</li>
              </ul>
              
              <p><strong>Important:</strong></p>
              <ul>
                <li>Please ensure someone is available at home for the test</li>
                <li>Provide access to your main water supply</li>
                <li>Keep a sample of water ready for testing</li>
              </ul>
              
              <p>Our team will call you 24 hours before the scheduled test to confirm the timing.</p>
              
              <p>For any changes or questions, contact us at <strong>8925081899</strong></p>
              
              <p>Best regards,<br/>
              <strong>AquaAdapt Water Filtration Team</strong></p>
            </div>
            
            <div class="footer">
              <p>© 2025 AquaAdapt. All rights reserved.</p>
              <p>Phone: 8925081899 | Email: contact@aquaadapt.com</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
};

/**
 * Email template for booking notification to owner
 */
export const bookingConfirmationOwnerTemplate = (data: BookingEmailData) => {
  return {
    subject: "📅 New Booking Received - " + data.bookingId,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; margin-top: 20px; border-radius: 8px; }
            .booking-details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #f5576c; }
            .booking-details p { margin: 8px 0; }
            .label { font-weight: bold; color: #f5576c; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📅 New Booking Received</h1>
              <p>Water Quality Test</p>
            </div>
            
            <div class="content">
              <p>Hi Akshay,</p>
              
              <p>A new booking for water quality test has been received! Here are the details:</p>
              
              <div class="booking-details">
                <p><span class="label">Customer Name:</span> ${data.userName}</p>
                <p><span class="label">Customer Email:</span> ${data.userEmail}</p>
                <p><span class="label">Booking ID:</span> ${data.bookingId}</p>
                <p><span class="label">Test Date:</span> ${new Date(data.bookingDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                ${data.bookingTime ? `<p><span class="label">Preferred Time:</span> ${data.bookingTime}</p>` : ''}
              </div>
              
              <p><strong>Action Required:</strong></p>
              <ul>
                <li>Confirm availability for the booked date</li>
                <li>Prepare test equipment</li>
                <li>Schedule team member for the test</li>
                <li>Call customer 24 hours before to confirm</li>
              </ul>
              
              <p>Log in to your dashboard to view all bookings and manage schedules.</p>
            </div>
            
            <div class="footer">
              <p>© 2025 AquaAdapt. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
};
