# 📋 POSTMAN Collection Import Guide

## 🚀 **Quick Setup**

### **Step 1: Import Collection**
1. Open Postman
2. Click **Import** button (top left)
3. Select **File** tab
4. Choose `Blog-Ecommerce-API.postman_collection.json`
5. Click **Import**

### **Step 2: Verify Variables**
The collection comes pre-configured with:
- ✅ **baseUrl**: `https://backend-blog-ecommerce.onrender.com`
- ✅ **authToken**: Current working admin token (expires in 1 hour)

### **Step 3: Test Authentication**
1. Go to **🔐 Authentication** folder
2. Run **Login Admin** request
3. ✨ Token will auto-update in collection variables!

## 📂 **Collection Structure**

### **🔧 System & Health**
- Health Check
- Database Health

### **🔐 Authentication**
- Login Admin (auto-updates token)
- Login Customer
- Register New User
- Get Profile

### **🔧 Development Tools**
- 🔄 Soft Reset Database (safe)
- 🚨 Hard Reset Database (dangerous)
- Seed Users

### **👤 Admin - User Management**
- Get All Users
- Get/Update/Delete User by ID

### **📂 Categories**
- Full CRUD operations
- Public read access
- Admin write access

### **🛍️ Products**
- Full CRUD operations
- Search functionality
- Category filtering
- Pagination support

### **🛒 Orders**
- Order management
- Status updates
- User-specific orders

### **📦 Order Items**
- Order item management
- Add/remove items from orders

### **⭐ Reviews**
- Product reviews
- Rating system
- User-generated content

### **📋 Logs**
- System logs (admin only)
- Error tracking
- Activity monitoring

## 🎯 **Testing Workflow**

### **1. Start Fresh (Optional)**
```
POST /dev/reset-database  # Clear all data
POST /dev/seed-users      # Create test users
```

### **2. Authentication**
```
POST /auth/login          # Get fresh token
GET  /auth/profile        # Verify login
```

### **3. Basic Data Setup**
```
POST /categories          # Create categories
POST /products            # Create products
```

### **4. E-commerce Flow**
```
POST /orders              # Create order
GET  /orders/my-orders    # View orders
PUT  /orders/1/status     # Update status
```

### **5. Review System**
```
POST /reviews             # Add review
GET  /reviews/product/1   # Get product reviews
```

## 🔄 **Auto-Token Refresh**

The **Login Admin** request includes a test script that automatically updates the collection token:

```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.collectionVariables.set('authToken', response.accessToken);
    console.log('Token updated:', response.accessToken);
}
```

**Simply run the Login Admin request when your token expires!**

## 🚨 **Important Notes**

### **Token Expiration**
- Tokens expire in **1 hour**
- Use **Login Admin** to refresh automatically
- Watch for **401 Unauthorized** responses

### **Database Resets**
- **Soft Reset**: Clears data, keeps schema
- **Hard Reset**: ⚠️ **DESTROYS EVERYTHING** ⚠️
- Always run **Seed Users** after reset

### **Authentication Levels**
- **Public**: Categories (read), Products (read), Reviews (read)
- **User**: Orders, Reviews (create/update own)
- **Admin**: All endpoints, User management, System controls

## ✅ **Ready to Test!**

Your POSTMAN collection is configured and ready. Start with the **Login Admin** request to get a fresh token, then explore all the endpoints! 🎉
