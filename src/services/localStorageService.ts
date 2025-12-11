/**
 * Local Storage Service
 * Manages user data, orders, and bookings in browser localStorage
 * Acts as backup and offline storage alongside Supabase
 */

export interface LocalUser {
  id: string;
  email: string;
  fullName: string;
  password: string; // hashed locally
  phone: string;
  address: string;
  state: string;
  district: string;
  uniqueId: string;
  createdAt: string;
}

export interface LocalOrder {
  id: string;
  userId: string;
  orderId: string;
  amount: number;
  paymentMethod: "qr" | "upi";
  transactionId: string;
  status: "pending" | "completed" | "failed";
  createdAt: string;
}

export interface LocalBooking {
  id: string;
  userId: string;
  bookingId: string;
  bookingDate: string;
  bookingTime?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

// Simple hash function for password (for client-side verification)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

const USERS_KEY = "aquaadapt_users";
const ORDERS_KEY = "aquaadapt_orders";
const BOOKINGS_KEY = "aquaadapt_bookings";
const CURRENT_USER_KEY = "aquaadapt_current_user";

/**
 * Register a new user locally
 */
export function registerUserLocally(userData: Omit<LocalUser, "id" | "createdAt" | "uniqueId">): LocalUser {
  const users = getAllUsers();
  
  // Check if user already exists
  if (users.some(u => u.email === userData.email)) {
    throw new Error("User with this email already exists");
  }

  const newUser: LocalUser = {
    id: `user-${Date.now()}`,
    ...userData,
    password: simpleHash(userData.password),
    uniqueId: `AQ-USER-${String(users.length + 1).padStart(3, "0")}`,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  return newUser;
}

/**
 * Login user with email and password
 */
export function loginUserLocally(email: string, password: string): LocalUser | null {
  const users = getAllUsers();
  const user = users.find(u => u.email === email && u.password === simpleHash(password));
  
  if (user) {
    // Set as current user
    setCurrentUser(user);
    return user;
  }
  
  return null;
}

/**
 * Get all users (for testing/admin purposes)
 */
export function getAllUsers(): LocalUser[] {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

/**
 * Get current logged-in user
 */
export function getCurrentUser(): LocalUser | null {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
}

/**
 * Set current user
 */
export function setCurrentUser(user: LocalUser): void {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

/**
 * Logout current user
 */
export function logoutUserLocally(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
}

/**
 * Save order locally
 */
export function saveOrderLocally(userId: string, orderData: Omit<LocalOrder, "id" | "createdAt">): LocalOrder {
  const orders = getAllOrders();
  
  const newOrder: LocalOrder = {
    id: `order-${Date.now()}`,
    userId,
    ...orderData,
    createdAt: new Date().toISOString(),
  };

  orders.push(newOrder);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

  return newOrder;
}

/**
 * Get all orders for a user
 */
export function getUserOrders(userId: string): LocalOrder[] {
  const orders = getAllOrders();
  return orders.filter(o => o.userId === userId);
}

/**
 * Get all orders (admin)
 */
export function getAllOrders(): LocalOrder[] {
  const data = localStorage.getItem(ORDERS_KEY);
  return data ? JSON.parse(data) : [];
}

/**
 * Save booking locally
 */
export function saveBookingLocally(userId: string, bookingData: Omit<LocalBooking, "id" | "createdAt">): LocalBooking {
  const bookings = getAllBookings();
  
  const newBooking: LocalBooking = {
    id: `booking-${Date.now()}`,
    userId,
    ...bookingData,
    createdAt: new Date().toISOString(),
  };

  bookings.push(newBooking);
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));

  return newBooking;
}

/**
 * Get all bookings for a user
 */
export function getUserBookings(userId: string): LocalBooking[] {
  const bookings = getAllBookings();
  return bookings.filter(b => b.userId === userId);
}

/**
 * Get all bookings (admin)
 */
export function getAllBookings(): LocalBooking[] {
  const data = localStorage.getItem(BOOKINGS_KEY);
  return data ? JSON.parse(data) : [];
}

/**
 * Export all data to JSON
 */
export function exportDataToJSON() {
  const data = {
    users: getAllUsers(),
    orders: getAllOrders(),
    bookings: getAllBookings(),
    exportedAt: new Date().toISOString(),
  };

  return JSON.stringify(data, null, 2);
}

/**
 * Clear all local data (for testing)
 */
export function clearAllLocalData(): void {
  localStorage.removeItem(USERS_KEY);
  localStorage.removeItem(ORDERS_KEY);
  localStorage.removeItem(BOOKINGS_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
}

/**
 * Verify password without hashing (for quick check)
 */
export function verifyPassword(email: string, password: string): boolean {
  const users = getAllUsers();
  const user = users.find(u => u.email === email);
  return user ? user.password === simpleHash(password) : false;
}
