# PopMart Documentation

## Overview
PopMart is a backend API that allows users to purchase collectibles and plushies. This documentation covers the following sections:

- Endpoints
- Middleware
- JWT Implementation
- Database Schema

## Endpoints
### 1. User Management
- **POST /api/users**: Create a new user.
- **POST /api/users/login**: Authenticate a user.

### 2. Product Management
- **GET /api/products**: Retrieve all products.
- **POST /api/products**: Add a new product.

### 3. Purchase Management
- **POST /api/purchases**: Create a new purchase.
- **GET /api/purchases/:id**: Retrieve a purchase by ID.

## Middleware
Middleware functions are used for authentication, logging, and error handling.

### Authentication Middleware
- Checks if a JWT is present in the requests.
- Verifies the token and extracts user information.

## JWT Implementation
JWT is used for securing routes. Here's how it works:
1. User logs in and receives a JWT.
2. The client stores the JWT and includes it in the Authorization header for protected routes.

### Example of JWT Structure
- Header: `{ "alg": "HS256", "typ": "JWT" }`
- Payload: `{ "sub": "user_id", "iat": timestamp }`

## Database Schema
The database consists of the following collections:
1. Users: Stores user information.
2. Products: Stores product details.
3. Purchases: Stores transaction details.

### Example of Users Collection
```json
{
  "user_id": "unique_user_id",
  "username": "example_username",
  "email": "user@example.com",
  "password_hash": "hashed_password"
}
```

### Example of Products Collection
```json
{
  "product_id": "unique_product_id",
  "name": "Product Name",
  "price": 19.99,
  "stock": 100
}
```

### Example of Purchases Collection
```json
{
  "purchase_id": "unique_purchase_id",
  "user_id": "unique_user_id",
  "product_id": "unique_product_id",
  "quantity": 1,
  "total_price": 19.99
}
```

## Conclusion
This documentation provides a comprehensive guide for developers working with the PopMart backend API. For further inquiries, please contact the development team.