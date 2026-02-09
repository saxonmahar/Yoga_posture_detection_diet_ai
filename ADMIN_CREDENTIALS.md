# 🛡️ Admin Credentials

## Current Admin

```
Email: sanjaymahar2058@gmail.com
Password: 1234567890
```

**Admin Login URL**: http://localhost:3002/admin

---

## For New Owner (When Selling Product)

When you sell this product to a new owner, they need to change the admin credentials to their own.

### Step 1: Access the Backend

```bash
cd backend
```

### Step 2: Change Admin Credentials

```bash
node change-admin.js new-owner@email.com their-password "Their Name"
```

**Example:**
```bash
node change-admin.js john@company.com SecurePass123 "John Smith"
```

This will:
- ✅ Delete the old admin account (sanjaymahar2058@gmail.com)
- ✅ Create a new admin account with the new owner's credentials
- ✅ The new owner can now login at `/admin`

### Step 3: New Owner Logs In

The new owner goes to:
```
http://localhost:3002/admin
```

And logs in with their new credentials.

---

## Security Notes

- ⚠️ **Only ONE admin** can exist at a time
- ⚠️ When you run `change-admin.js`, the old admin is **permanently deleted**
- ⚠️ Make sure the new owner saves their credentials securely
- ⚠️ The new owner should change their password after first login

---

## Admin Features

The admin can:
- 📊 View system statistics (total users, sessions, revenue)
- 👥 Monitor user activity
- 💰 Track premium subscriptions
- 🖥️ Check server status (backend, ML, diet, database)
- 📈 View analytics and reports

---

## Technical Details

- Admin credentials are stored in MongoDB
- Password is hashed with bcrypt
- Role field: `"admin"`
- Only users with `role: "admin"` can access `/admin` routes
