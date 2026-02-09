# 🛡️ Admin Login Guide

## How It Works

### For Regular Users:
1. Go to http://localhost:3002/register
2. Create account with email/password
3. Login at http://localhost:3002/login
4. **Redirected to**: `/dashboard` (User Dashboard)

### For Admin User:
1. Go to http://localhost:3002/login (SAME login page!)
2. Login with admin credentials:
   - **Email**: `sanjaymahar2058@gmail.com`
   - **Password**: `1234567890`
3. **Redirected to**: `/admin` (Admin Dashboard)

## ✅ The System Automatically Detects Role!

- **Same login page** for everyone
- Backend checks user role after login
- Frontend redirects based on role:
  - `role: "user"` → `/dashboard`
  - `role: "admin"` → `/admin`

## 🎯 Admin Dashboard Features

Your admin panel shows:

### 📊 System Overview
- **Total Users**: How many users registered
- **Active Today**: Users active in last 24 hours
- **Total Sessions**: All yoga sessions completed
- **Revenue**: Total earnings from premium subscriptions
- **Premium Users**: Users with premium subscription
- **Today's Sessions**: Sessions completed today

### 🖥️ Server Status
Real-time monitoring of:
- ✅ Backend API (port 5001)
- ✅ ML Service (port 5000)
- ✅ Diet Service (port 5002)
- ✅ Database (MongoDB)

### ⚡ Quick Actions
- **Manage Users**: View/edit/delete users (coming soon)
- **View Analytics**: Detailed charts and reports (coming soon)
- **System Settings**: Configure app settings (coming soon)
- **View Logs**: System logs and errors (coming soon)

### 📈 Recent Activity
- Latest yoga sessions
- User activity feed
- System events

## 🧪 Test It Now!

### Step 1: Logout (if logged in)
```
Click profile icon → Logout
```

### Step 2: Login as Admin
```
Go to: http://localhost:3002/login
Email: sanjaymahar2058@gmail.com
Password: 1234567890
```

### Step 3: Verify
You should see:
- ✅ Admin Dashboard (not user dashboard)
- ✅ System stats and server status
- ✅ URL: http://localhost:3002/admin

## 🔐 Security Features

### Backend Protection
- Admin API endpoints require authentication
- Role verification middleware checks admin status
- Non-admin users get 403 Forbidden error

### Frontend Protection
- AdminRoute component checks user role
- Non-admin users redirected to `/dashboard`
- Direct URL access blocked for non-admins

## 📝 Admin Credentials

```
Email: sanjaymahar2058@gmail.com
Password: 1234567890
Role: admin
```

## 🛠️ Make Another User Admin

To promote another user to admin:

```bash
cd backend
node make-admin.js their-email@example.com
```

To set their password:

```bash
cd backend
node set-admin-password.js their-email@example.com newpassword
```

## 🎨 What Makes Admin Different?

### User Dashboard (`/dashboard`)
- Personal stats (workouts, streak, accuracy)
- Start yoga session
- View diet plan
- Track progress
- Profile settings

### Admin Dashboard (`/admin`)
- **System-wide** stats (all users)
- Server monitoring
- User management
- Revenue tracking
- System settings
- Activity logs

## 🚀 Current Status

✅ Backend: Running on port 5001  
✅ Frontend: Running on port 3002  
✅ Admin user: sanjaymahar2058@gmail.com  
✅ Admin role: Set in database  
✅ Admin routes: Protected  
✅ Auto-redirect: Working  

## 💡 Tips

1. **Same Login Page**: Don't look for separate admin login - it's the same page!
2. **Auto Redirect**: System automatically sends you to correct dashboard
3. **Role Check**: Open browser console (F12) to see role detection logs
4. **Refresh**: If role doesn't update, logout and login again

## 🐛 Troubleshooting

### "Not seeing admin dashboard after login"
1. Clear browser cache (Ctrl + Shift + Delete)
2. Logout completely
3. Close browser
4. Open browser again
5. Login with admin credentials

### "Shows user dashboard instead of admin"
Check console logs (F12):
```
👤 User role after login: admin  ← Should say "admin"
🛡️ Admin user detected, redirecting to admin panel
```

If it says `role: user`, run:
```bash
cd backend
node make-admin.js sanjaymahar2058@gmail.com
```

### "Can't access /admin directly"
This is correct! You must:
1. Login first
2. System checks your role
3. Then redirects you to admin panel

## 📚 Next Steps (Future Enhancements)

1. **User Management Page**
   - List all users
   - Edit user details
   - Delete users
   - Change user roles

2. **Analytics Page**
   - User growth charts
   - Session statistics
   - Revenue graphs
   - Popular poses

3. **System Settings**
   - Email configuration
   - Payment gateway settings
   - ML model settings
   - Feature toggles

4. **Logs Viewer**
   - System logs
   - Error logs
   - User activity logs
   - API request logs

---

**Ready to test!** 🎉

Login with `sanjaymahar2058@gmail.com` / `1234567890` and see the admin magic!
