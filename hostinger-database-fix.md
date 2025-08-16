# 🔧 Fix Hostinger Database Login Issue

## The Problem
You're getting "Login failed - Unexpected token '<'. is not valid JSON" because:
1. The admin account doesn't exist in your Hostinger MySQL database
2. The backend API can't connect to the database properly

## 🎯 Quick Fix Steps

### Step 1: Create Admin Account in MySQL Database

1. **Log into your Hostinger control panel**
2. **Go to Databases → MySQL Databases**
3. **Open phpMyAdmin or Database Manager**
4. **Select your database** (usually something like `u123456_school`)
5. **Go to SQL tab**
6. **Copy and paste this SQL code:**

```sql
-- Create roles if they don't exist
INSERT IGNORE INTO roles (id, name) VALUES 
(1, 'admin'), (2, 'teacher'), (3, 'student'), (4, 'parent'),
(5, 'guidance'), (6, 'registrar'), (7, 'accounting');

-- Create admin user account
INSERT IGNORE INTO users (
    id, role_id, first_name, last_name, email, password_hash, 
    name, role, is_active, status, created_at
) VALUES (
    1, 1, 'Admin', 'User', 'admin@school.edu',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3lq5eaUWxq',
    'Admin User', 'admin', TRUE, 'active', NOW()
);
```

7. **Click "Go" or "Execute"**

### Step 2: Verify Database Connection

Make sure your `.env` file in Hostinger has the correct database connection:

```env
NODE_ENV=production
DATABASE_URL=mysql://YOUR_USERNAME:YOUR_PASSWORD@localhost:3306/YOUR_DATABASE
SESSION_SECRET=your-super-secret-session-key
PORT=3000
```

Replace:
- `YOUR_USERNAME` with your MySQL username
- `YOUR_PASSWORD` with your MySQL password  
- `YOUR_DATABASE` with your database name

### Step 3: Restart Your Application

1. Go to **Hostinger control panel**
2. Click **Node.js Apps**
3. Find your application
4. Click **Restart**

### Step 4: Test Login

Now try logging in with:
- **Email**: `admin@school.edu`
- **Password**: `admin123456`

## 🔍 If Still Not Working

### Check Hostinger Logs:
1. Go to **Node.js Apps** in Hostinger
2. Click **Logs** 
3. Look for database connection errors

### Common Issues:
- ❌ Wrong database credentials in `.env`
- ❌ Database connection timeout
- ❌ Node.js app not running
- ❌ Missing tables in database

### Database Connection Test:
Run this in phpMyAdmin to test:
```sql
SELECT * FROM users WHERE email = 'admin@school.edu';
```

You should see the admin user account.

## ✅ Success!
After these steps, your login should work perfectly!

The "Unexpected token '<'" error will be fixed because the API will now properly connect to the database and return JSON instead of HTML error pages.