# 🧪 Testing Guide with Default Users

## 🚀 Quick Start Testing

### 1. **First, Seed Default Users**
Before testing authentication, create the default users by calling:

**POST** `https://ecommerce-blog-backend.onrender.com/dev/seed-users`

This will create:
- **Admin User**: `admin@test.com` / `admin123`
- **Customer User**: `customer@test.com` / `customer123`

### 2. **Default User Credentials**

#### 👨‍💼 **Admin User**
```json
{
  "email": "admin@test.com",
  "password": "admin123",
  "role": "admin"
}
```

#### 👤 **Customer User**
```json
{
  "email": "customer@test.com", 
  "password": "customer123",
  "role": "customer"
}
```

## 📋 **Testing Workflow in Postman**

### **Step 1: Setup Environment**
1. Import the Postman collection: `Ecommerce-Backend-API.postman_collection.json`
2. Set `baseUrl` to: `https://ecommerce-blog-backend.onrender.com`

### **Step 2: Seed Default Users** 
1. **Database Management** → **Seed Default Users (Development)**
2. ✅ Should return success with both users created

### **Step 3: Test Authentication**
1. **Authentication** → **Login Admin (Default)**
   - Uses `admin@test.com` / `admin123`
   - ✅ Should return JWT token (auto-saved)

2. **Authentication** → **Login Customer (Default)**
   - Uses `customer@test.com` / `customer123`
   - ✅ Should return JWT token (auto-saved)

### **Step 4: Test Protected Endpoints**

#### With Admin Token:
- **Protected Endpoints** → **Admin - Get All Users**
- **Database Management** → **Reset Database (Admin Protected)**
- **Database Management** → **Seed Default Users (Admin Protected)**

#### With Customer Token:
- **Protected Endpoints** → **Customer - Get Profile**
- **Authentication** → **Get Profile**

### **Step 5: Test CRUD Operations**
1. **Categories** → Create a category first
2. **Products** → Create products (use category ID)
3. **Orders** → Create orders (use user ID)
4. **Order Items** → Create order items (use order/product IDs)
5. **Reviews** → Create reviews (use product/user IDs)
6. **Logs** → Create application logs

## 🔧 **Advanced Testing**

### **Database Reset & Re-seed**
1. **POST** `/dev/reset-database` - Clears all tables
2. **POST** `/dev/seed-users` - Recreates default users
3. Ready to test fresh data!

### **Role-Based Testing**
- **Admin endpoints**: Need admin token (`admin@test.com`)
- **Customer endpoints**: Need customer token (`customer@test.com`)
- **Public endpoints**: No authentication required

### **Error Testing**
- Try accessing admin endpoints with customer token
- Try invalid credentials
- Try accessing protected endpoints without token

## 📊 **Database Health Check**
**GET** `/health/db` - Check both PostgreSQL and MongoDB connections

## 🎯 **Complete Test Sequence**

```
1. GET  /health/db              ✅ Check database connections
2. POST /dev/seed-users         ✅ Create default users  
3. POST /auth/login             ✅ Login as admin
4. POST /categories             ✅ Create category
5. POST /products              ✅ Create product
6. POST /orders                ✅ Create order
7. POST /order-items           ✅ Create order items
8. POST /reviews               ✅ Create review
9. POST /logs                  ✅ Create log
10. GET /admin/users           ✅ Test admin endpoint
```

## 🚨 **Troubleshooting**

### If Users Already Exist:
- The seed endpoint will return existing users without error
- Or use `/dev/reset-database` first to start fresh

### If Database Schema Issues:
- Use `/dev/reset-database` to fix schema problems
- Then re-seed with `/dev/seed-users`

### If Authentication Fails:
- Ensure you seeded users first
- Check exact credentials: `admin@test.com` / `admin123`
- Verify JWT token is saved in Postman variables

---

🎉 **You're all set!** The API is live and ready for comprehensive testing with your default admin and customer users.
