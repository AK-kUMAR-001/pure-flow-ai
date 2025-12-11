# Quick Test Guide - AquaAdapt Authentication System

## Environment Setup
- **App URL**: http://localhost:8081
- **Dev Server**: Running on port 8081 (port 8080 was in use)
- **No Build Required**: Hot module reloading enabled for instant updates

## Test Case 1: Basic Signup Flow

### Steps:
1. Navigate to http://localhost:8081
2. Click the **"Sign Up"** button (UserPlus icon)
3. Fill in the signup form:
   - **Full Name**: John Doe
   - **Email**: john@example.com
   - **Phone**: 9876543210 (exactly 10 digits)
   - **Address**: 123 Main Street
   - **State**: Maharashtra
   - **District**: Mumbai
   - **Password**: password123
   - **Confirm Password**: password123
4. Click **"Create Account"**

### Expected Results:
✅ Form validation passes all fields
✅ Success screen appears with:
   - Animated green checkmark
   - "Account Created! ✓" message
   - Unique ID: **AQ-USER-001**
   - "Redirecting to login in 3 seconds..." message
✅ Auto-redirects to login page after 3 seconds
✅ User data saved to localStorage

### Verification:
- Open browser DevTools (F12)
- Go to **Application** → **Local Storage**
- Look for key `aquaadapt_users`
- Should see JSON with user data including hashed password

---

## Test Case 2: Basic Login Flow

### Steps:
1. At the login page, enter:
   - **Email**: john@example.com
   - **Password**: password123
2. Click **"Login"**

### Expected Results:
✅ Login validates credentials successfully
✅ Redirects to home page (/)
✅ Page shows user content (not landing page)
✅ Current user stored in localStorage under `aquaadapt_current_user`

### Verification:
- Open DevTools → Local Storage
- Check `aquaadapt_current_user` key
- Should contain logged-in user data

---

## Test Case 3: Password Visibility Toggle

### Steps:
1. At signup, type in password field
2. Click the **eye icon** to show password
3. Verify password is visible
4. Click **eye icon** again to hide

### Expected Results:
✅ Eye icon shows/hides password text
✅ Eye icon changes between Eye and EyeOff icons
✅ Works for both password fields (Password and Confirm Password)

---

## Test Case 4: Form Validation

### Invalid Email Test:
1. Try signup with email: `notanemail`
2. Click "Create Account"
✅ **Error**: "Invalid email format"

### Invalid Phone Test:
1. Try signup with phone: `12345` (less than 10 digits)
2. Click "Create Account"
✅ **Error**: "Phone must be 10 digits"

### Short Password Test:
1. Try signup with password: `pass` (less than 6 chars)
2. Click "Create Account"
✅ **Error**: "Password must be at least 6 characters"

### Password Mismatch Test:
1. Enter password: `password123`
2. Enter confirm password: `password456`
3. Click "Create Account"
✅ **Error**: "Passwords do not match"

---

## Test Case 5: Wrong Login Credentials

### Steps:
1. Try login with email: john@example.com
2. Enter password: wrongpassword
3. Click "Login"

### Expected Results:
✅ Toast notification: "Invalid email or password"
✅ Page stays on login page
✅ User is not redirected to home

---

## Test Case 6: Multi-User Test (Unique IDs)

### Steps:
1. Complete signup for **User 1**:
   - Name: Alice Smith
   - Email: alice@example.com
   - Expected ID: **AQ-USER-001**
2. Success screen shows AQ-USER-001
3. Auto-redirects to login

4. Logout (if logout button exists) or clear localStorage manually:
   - DevTools → Application → Local Storage → Right-click `aquaadapt_current_user` → Delete

5. Complete signup for **User 2**:
   - Name: Bob Johnson
   - Email: bob@example.com
   - Expected ID: **AQ-USER-002**
6. Success screen shows AQ-USER-002

### Expected Results:
✅ Each user gets unique ID (AQ-USER-001, AQ-USER-002, etc.)
✅ IDs are incremented sequentially
✅ Each user can log in with their own credentials
✅ Logged-in user data doesn't leak to other users

### Verification:
- DevTools → Local Storage → `aquaadapt_users`
- Should contain both users with different uniqueIds
- Example:
  ```json
  [
    { "id": "...", "uniqueId": "AQ-USER-001", "email": "alice@example.com", ... },
    { "id": "...", "uniqueId": "AQ-USER-002", "email": "bob@example.com", ... }
  ]
  ```

---

## Test Case 7: Order Storage After Payment

### Steps:
1. Login as User 1
2. Navigate to **Home Test** or **Products** page
3. Click **"Order Your Cartridge"** button
4. Payment Gateway modal appears
5. Select **"Pay with QR Code"**
6. Click **"Confirm Payment"**

### Expected Results:
✅ Processing loader appears for 2 seconds
✅ Success message: "✓ Order Accepted!" with "Payment Successful"
✅ Order saved to both:
   - Supabase database (if configured)
   - localStorage under `aquaadapt_orders`

### Verification:
- DevTools → Local Storage → `aquaadapt_orders`
- Should contain order JSON with:
  - userId
  - amount: 1000
  - paymentMethod: "qr"
  - transactionId: "AQ-{timestamp}"
  - status: "completed"

---

## Test Case 8: Protected Routes

### Steps:
1. Open new incognito window
2. Navigate to http://localhost:8081
3. Try to access /home or other protected routes directly
4. Go to http://localhost:8081/home (should redirect)

### Expected Results:
✅ Redirects to /landing page
✅ Login/Signup buttons visible
✅ User cannot access protected pages without authentication

### After Login:
1. Login successfully
2. Navigate to http://localhost:8081/home
✅ **Expected**: Home page loads (not redirected to landing)
✅ **Expected**: User can navigate to all protected pages

---

## Test Case 9: Session Persistence

### Steps:
1. Login successfully
2. Refresh the page (Ctrl+R or F5)

### Expected Results:
✅ User stays logged in (doesn't redirect to login)
✅ Home page loads correctly
✅ User data from localStorage used to maintain session
✅ No need to log in again

---

## Test Case 10: Offline Functionality

### Steps:
1. Login successfully
2. Open DevTools → Network tab
3. Set throttle to **Offline**
4. Try to navigate pages
5. Signup/Login should still work (no API calls needed)

### Expected Results:
✅ Local authentication works offline
✅ Data reads from localStorage (fast)
✅ Can't sync to Supabase but local data preserved

---

## Browser Console Checks

### To verify data storage, open DevTools Console and run:

```javascript
// View all users
JSON.parse(localStorage.getItem('aquaadapt_users'))

// View all orders
JSON.parse(localStorage.getItem('aquaadapt_orders'))

// View current user
JSON.parse(localStorage.getItem('aquaadapt_current_user'))

// View all bookings
JSON.parse(localStorage.getItem('aquaadapt_bookings'))
```

---

## Common Issues & Fixes

### Issue: User data not saving
- **Solution**: Check if localStorage is enabled in browser settings
- **Solution**: Clear cache and refresh page

### Issue: Password not hashing correctly
- **Solution**: This is expected - client-side hash is for local storage only
- **Solution**: For production, use Supabase's secure password handling

### Issue: Redirect loops between login and home
- **Solution**: Clear localStorage completely and try again
- **Solution**: Check browser console for errors

### Issue: UPI payment link doesn't open
- **Solution**: This requires actual UPI apps installed
- **Solution**: Test with QR code payment (simulated) instead

---

## Test Results Template

Copy and fill this to track your testing:

```
Test Date: ___________
Tester: ___________

Test Case 1 (Signup): [ ] PASS [ ] FAIL
Test Case 2 (Login): [ ] PASS [ ] FAIL
Test Case 3 (Password Toggle): [ ] PASS [ ] FAIL
Test Case 4 (Validation): [ ] PASS [ ] FAIL
Test Case 5 (Wrong Password): [ ] PASS [ ] FAIL
Test Case 6 (Multi-User): [ ] PASS [ ] FAIL
Test Case 7 (Orders): [ ] PASS [ ] FAIL
Test Case 8 (Protected Routes): [ ] PASS [ ] FAIL
Test Case 9 (Persistence): [ ] PASS [ ] FAIL
Test Case 10 (Offline): [ ] PASS [ ] FAIL

Issues Found:
- 
- 
- 

Notes:
```

---

## Performance Tips

1. **Clear localStorage periodically** to prevent large data
2. **Monitor order count** - export and archive old orders
3. **Check DevTools Network tab** to verify no unnecessary API calls
4. **Use browser cache** for offline capability

---

**Testing Environment Ready!** 🚀

Start with Test Case 1 for basic signup verification.
