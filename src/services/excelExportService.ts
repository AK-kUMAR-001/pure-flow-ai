/**
 * Excel Export Service
 * Exports orders and bookings to CSV/Excel format
 */

export function exportOrdersToCSV() {
  const { getAllOrders } = require("./localStorageService");
  const { getAllUsers } = require("./localStorageService");

  const orders = getAllOrders();
  const users = getAllUsers();

  if (orders.length === 0) {
    alert("No orders to export");
    return;
  }

  // Create CSV header
  const headers = [
    "Order ID",
    "User Email",
    "User Name",
    "Phone",
    "Address",
    "State",
    "District",
    "Amount (₹)",
    "Payment Method",
    "Transaction ID",
    "Status",
    "Date",
  ];

  // Create CSV rows
  const rows = orders.map((order: any) => {
    const user = users.find((u: any) => u.id === order.userId);
    return [
      order.orderId,
      user?.email || "N/A",
      user?.fullName || "N/A",
      user?.phone || "N/A",
      user?.address || "N/A",
      user?.state || "N/A",
      user?.district || "N/A",
      order.amount,
      order.paymentMethod,
      order.transactionId,
      order.status,
      new Date(order.createdAt).toLocaleString(),
    ];
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
  ].join("\n");

  downloadCSV(csvContent, "orders.csv");
}

export function exportBookingsToCSV() {
  const { getAllBookings } = require("./localStorageService");
  const { getAllUsers } = require("./localStorageService");

  const bookings = getAllBookings();
  const users = getAllUsers();

  if (bookings.length === 0) {
    alert("No bookings to export");
    return;
  }

  // Create CSV header
  const headers = [
    "Booking ID",
    "Customer ID",
    "User Email",
    "User Name",
    "Phone",
    "Address",
    "State",
    "District",
    "Booking Date",
    "Booking Time",
    "Status",
    "Created Date",
  ];

  // Create CSV rows
  const rows = bookings.map((booking: any) => {
    const user = users.find((u: any) => u.id === booking.userId);
    return [
      booking.bookingId,
      user?.uniqueId || "N/A",
      user?.email || "N/A",
      user?.fullName || "N/A",
      user?.phone || "N/A",
      user?.address || "N/A",
      user?.state || "N/A",
      user?.district || "N/A",
      booking.bookingDate,
      booking.bookingTime || "N/A",
      booking.status,
      new Date(booking.createdAt).toLocaleString(),
    ];
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
  ].join("\n");

  downloadCSV(csvContent, "bookings.csv");
}

export function exportFullDataToCSV() {
  const { getAllUsers } = require("./localStorageService");
  const { getAllOrders } = require("./localStorageService");
  const { getAllBookings } = require("./localStorageService");

  const users = getAllUsers();
  const orders = getAllOrders();
  const bookings = getAllBookings();

  if (users.length === 0) {
    alert("No data to export");
    return;
  }

  // Create CSV header
  const headers = [
    "Customer ID",
    "Email",
    "Name",
    "Phone",
    "Address",
    "State",
    "District",
    "Total Orders",
    "Total Bookings",
    "Last Order Date",
    "Last Booking Date",
    "Member Since",
  ];

  // Create CSV rows
  const rows = users.map((user: any) => {
    const userOrders = orders.filter((o: any) => o.userId === user.id);
    const userBookings = bookings.filter((b: any) => b.userId === user.id);
    const lastOrder = userOrders.length > 0 ? new Date(Math.max(...userOrders.map((o: any) => new Date(o.createdAt).getTime()))).toLocaleString() : "N/A";
    const lastBooking = userBookings.length > 0 ? new Date(Math.max(...userBookings.map((b: any) => new Date(b.createdAt).getTime()))).toLocaleString() : "N/A";

    return [
      user.uniqueId,
      user.email,
      user.fullName,
      user.phone,
      user.address,
      user.state,
      user.district,
      userOrders.length,
      userBookings.length,
      lastOrder,
      lastBooking,
      new Date(user.createdAt).toLocaleString(),
    ];
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
  ].join("\n");

  downloadCSV(csvContent, "aquaadapt_full_data.csv");
}

function downloadCSV(content: string, filename: string) {
  const element = document.createElement("a");
  element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(content));
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
