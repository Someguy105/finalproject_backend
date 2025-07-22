# 🧪 Postman Testing Guide with Your Auth Token

## 🔐 **Your Current Admin Token**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiYWRtaW5AdGVzdC5jb20iLCJyb2xlIjoiYWRtaW4iLCJmaXJzdE5hbWUiOiJBZG1pbiIsImxhc3ROYW1lIjoiVXNlciIsImlhdCI6MTc1MzE1MzMyNCwiZXhwIjoxNzUzMjM5NzI0fQ.Egg02COTxM3c1TbiSfsw9ZAsNxtNJvYtWS6G-5LnJog
```

**Token Details:**
- **Email**: admin@test.com
- **Role**: admin
- **Expires**: 24 hours from generation
- **Permissions**: Full admin access to all endpoints

## 📋 **Postman Setup Instructions**

### **Step 1: Set Collection Variable**
1. Open your Postman collection
2. Go to **Variables** tab
3. Set variable:
   - **Variable**: `authToken`
   - **Current Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiYWRtaW5AdGVzdC5jb20iLCJyb2xlIjoiYWRtaW4iLCJmaXJzdE5hbWUiOiJBZG1pbiIsImxhc3ROYW1lIjoiVXNlciIsImlhdCI6MTc1MzE1MzMyNCwiZXhwIjoxNzUzMjM5NzI0fQ.Egg02COTxM3c1TbiSfsw9ZAsNxtNJvYtWS6G-5LnJog`

### **Step 2: Test Database Reset (Wait 5 Minutes for Deployment)**
1. **POST** `https://ecommerce-blog-backend.onrender.com/dev/reset-database`
2. Should return success with the new database clearing method

### **Step 3: Create Default Users**
Once the database reset works, create users:

**POST** `https://ecommerce-blog-backend.onrender.com/dev/seed-users`

Or create manually via registration:

**POST** `https://ecommerce-blog-backend.onrender.com/auth/register`
```json
{
  "email": "admin@test.com",
  "password": "admin123",
  "firstName": "Admin",
  "lastName": "User",
  "role": "admin"
}
```

### **Step 4: Test Admin Endpoints**
With your admin token, test these protected endpoints:

1. **GET** `/admin/users` - Get all users (admin only)
2. **POST** `/admin/reset-database` - Reset database (admin only)
3. **POST** `/admin/seed-users` - Seed users (admin only)

### **Step 5: Test Auth Flow**
1. **POST** `/auth/login` with admin credentials
2. **GET** `/auth/profile` - Get current user profile
3. Compare tokens from login vs your generated token

## 🚀 **Complete Testing Sequence**

### **Wait for Deployment (5 minutes), then:**

1. **Health Check**
   ```
   GET /health/db
   ```

2. **Database Reset (Safe - Clears data, preserves schema)**
   ```
   POST /dev/reset-database
   ```

3. **🚨 HARD Reset (Nuclear option - Drops all tables and collections)**
   ```
   POST /dev/hard-reset-database
   ```
   ⚠️ **WARNING**: This permanently deletes ALL tables, sequences, and MongoDB collections!

4. **Seed Users**
   ```
   POST /dev/seed-users
   ```

5. **Test Admin Access**
   ```
   GET /admin/users
   Authorization: Bearer {{authToken}}
   ```

6. **Create Test Data**
   ```
   POST /categories
   POST /products
   POST /orders
   POST /reviews
   ```

## 🔄 **Reset Options Explained**

### **🔧 Soft Reset (`/dev/reset-database`)**
- ✅ Clears all data from tables
- ✅ Preserves table structure and schema
- ✅ Resets sequences to start from 1
- ✅ Clears MongoDB collections
- ✅ Safe for development testing
- ⚡ **Use this for regular testing**

### **🚨 Hard Reset (`/dev/hard-reset-database`)**
- 🚨 **PERMANENTLY DROPS ALL TABLES**
- 🚨 **DROPS ALL SEQUENCES**
- 🚨 **DROPS ALL MONGODB COLLECTIONS**
- 🚨 **CANNOT BE UNDONE**
- 🔄 Requires application restart to recreate schema
- ⚡ **Use only when schema is completely broken**

## ⚠️ **When to Use Hard Reset**

Use hard reset when:
- Database schema is corrupted
- TypeORM schema sync errors
- Legacy tables causing conflicts
- Need completely fresh start
- Testing schema migrations

**After hard reset, you MUST restart the application!**

## 🔄 **If Token Expires**

Generate a new token by running:
```bash
node generate-tokens.js
```

Or login via API:
```
POST /auth/login
{
  "email": "admin@test.com",
  "password": "admin123"
}
```

## 🚨 **Current Status**

- ✅ JWT Token Generated with correct secret
- ⏳ Database reset fix deploying (improved method)
- ⏳ Waiting for deployment to complete
- 🎯 Ready to test once deployment finishes

## 🛠️ **Troubleshooting**

### **If 401 Unauthorized:**
- Check token is set correctly in Postman
- Verify token hasn't expired (24 hours)
- Ensure Authorization header format: `Bearer {{authToken}}`

### **If 500 Internal Server Error:**
- Database schema issues - use reset endpoint
- Wait for deployment to complete
- Check database health endpoint first

### **If 404 Not Found:**
- Endpoint not deployed yet - wait for deployment
- Check exact URL spelling
- Verify endpoint exists in API docs

---

🎉 **You're all set!** Your admin token is ready for comprehensive API testing once the deployment completes.
