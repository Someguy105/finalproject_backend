# 🚨 Database Reset Guide - MongoDB & PostgreSQL (Neon)

## 🎯 **Reset Options Available**

Your API now has **two levels** of database reset to handle different scenarios:

### **1. 🔧 Soft Reset (Recommended)**
**Endpoints:**
- `POST /dev/reset-database` (Development)
- `POST /admin/reset-database` (Admin protected)

**What it does:**
- ✅ Clears ALL data from PostgreSQL tables
- ✅ Preserves table structure and schema
- ✅ Resets sequences to start from 1
- ✅ Clears ALL MongoDB collections (reviews, logs)
- ✅ Safe and reversible
- ⚡ **Use this for regular testing and development**

### **2. 🚨 HARD Reset (Nuclear Option)**
**Endpoints:**
- `POST /dev/hard-reset-database` (Development)
- `POST /admin/hard-reset-database` (Admin protected)

**What it does:**
- 🚨 **PERMANENTLY DROPS ALL PostgreSQL tables**
- 🚨 **DROPS ALL sequences**
- 🚨 **DROPS ALL MongoDB collections**
- 🚨 **CANNOT BE UNDONE**
- 🔄 **Requires application restart** to recreate schema
- ⚡ **Use only when schema is completely broken**

## 📋 **Step-by-Step Usage**

### **Scenario 1: Regular Development Testing**
```bash
# 1. Clear all data but keep schema
POST /dev/reset-database

# 2. Create default users
POST /dev/seed-users

# 3. Start testing with fresh data
```

### **Scenario 2: Schema Issues/Corruption**
```bash
# 1. Nuclear option - drops everything
POST /dev/hard-reset-database

# 2. Restart your application (Render will auto-restart)
# Wait 2-3 minutes for deployment

# 3. Check if schema recreated properly
GET /health/db

# 4. Create default users
POST /dev/seed-users
```

## 🛠️ **What Gets Reset**

### **PostgreSQL (Neon) Tables:**
- `app_users` - User accounts
- `categories` - Product categories  
- `products` - Product catalog
- `orders` - Customer orders
- `order_items` - Order line items
- `discount_categories` (legacy)
- `discounts` (legacy)
- `migrations` (TypeORM)

### **PostgreSQL Sequences:**
- `app_users_id_seq`
- `categories_id_seq`
- `products_id_seq`
- `orders_id_seq`
- `order_items_id_seq`

### **MongoDB Collections:**
- `reviews` - Product reviews
- `logs` - Application logs
- All indexes and metadata

## 🔐 **Security & Permissions**

### **Development Endpoints (No Auth Required):**
- `/dev/reset-database`
- `/dev/hard-reset-database`
- `/dev/seed-users`

### **Admin Endpoints (JWT Token Required):**
- `/admin/reset-database`
- `/admin/hard-reset-database`
- `/admin/seed-users`

### **Production Safety:**
- All `/dev/*` endpoints are **blocked in production**
- Admin endpoints require valid JWT with `admin` role
- Hard reset logs detailed warnings

## ⚡ **Quick Commands for Postman**

### **Fresh Start (Soft Reset):**
```
1. POST {{baseUrl}}/dev/reset-database
2. POST {{baseUrl}}/dev/seed-users
3. Ready to test!
```

### **Nuclear Option (Hard Reset):**
```
1. POST {{baseUrl}}/dev/hard-reset-database
2. Wait 3-5 minutes for auto-restart
3. GET {{baseUrl}}/health/db (verify schema)
4. POST {{baseUrl}}/dev/seed-users
5. Ready to test!
```

## 🚨 **When to Use Each Option**

### **Use Soft Reset When:**
- ✅ Regular development testing
- ✅ Need fresh data for testing
- ✅ Database has test data to clear
- ✅ Schema is working fine
- ✅ Daily development workflow

### **Use Hard Reset When:**
- 🚨 Database schema is corrupted
- 🚨 TypeORM sync errors persist
- 🚨 Legacy tables causing conflicts
- 🚨 Need to test schema migrations
- 🚨 Soft reset fails due to constraints
- 🚨 Complete fresh start required

## 🔄 **Expected Behavior**

### **After Soft Reset:**
- All data cleared immediately
- Tables remain with correct schema
- Sequences reset to 1
- Ready for immediate use

### **After Hard Reset:**
- All tables/collections dropped
- Application will show errors until restart
- After restart: Fresh schema created by TypeORM
- Need to seed users again

## 📊 **Monitoring Reset Status**

Check if reset was successful:
```
GET /health/db
```

Response should show:
```json
{
  "postgres": true,
  "mongodb": true,
  "collections": {
    "users": 0,
    "products": 0,
    "categories": 0,
    "orders": 0,
    "orderItems": 0,
    "reviews": 0,
    "logs": 0
  }
}
```

## 🛡️ **Safety Recommendations**

1. **Always backup important data** before hard reset
2. **Use soft reset first** - only escalate to hard reset if needed
3. **Test on development** before using in any important environment
4. **Hard reset requires restart** - plan accordingly
5. **Monitor logs** during reset operations

---

🎯 **You now have complete control over both MongoDB and PostgreSQL databases with safe and nuclear reset options!**
