## 1. Authentication & User Management

```
/api/auth/register                      # POST - Register a new user
/api/auth/login                         # POST - Login
/api/auth/logout                        # DELETE - Logout from current device
/api/auth/logoutAll                     # DELETE - Logout from all devices
/api/auth/refreshToken                  # GET - Get a new access token
/api/auth/deleteAccount                 # DELETE - Delete account
/api/auth/sendOTP                       # POST - Send OTP (Authenticated)
/api/auth/verifyOTP                     # POST - Verify OTP (Authenticated)
/api/auth/forgotPassword                # POST - Forgot password
/api/auth/resetPassword                 # POST - Reset password
/api/auth/changePassword                # PATCH - Change password (Authenticated)

/api/user/profile                       # GET - Get user profile
/api/user/updateProfile                 # PATCH - Update profile
/api/user/orders                        # GET - Get user’s orders
/api/user/wishlist                      # GET - Get wishlist
/api/user/cart                          # GET - Get cart
```

## 2. Product Management

```
/api/products                           # GET - Get all products
/api/products/:id                       # GET - Get single product
/api/products/category/:category        # GET - Get products by category
/api/products/search                    # GET - Search products
/api/products/filter                    # GET - Filter products

/api/admin/products                     # POST - Create product (Admin)
/api/admin/products/:id                 # PATCH - Update product (Admin)
/api/admin/products/:id                 # DELETE - Delete product (Admin)
```

## 3. Cart & Wishlist

```
/api/cart                               # GET - Get cart items
/api/cart                               # POST - Add item to cart
/api/cart/:id                           # PATCH - Update cart item quantity
/api/cart/:id                           # DELETE - Remove item from cart
/api/cart/clear                         # DELETE - Clear cart

/api/wishlist                           # GET - Get wishlist
/api/wishlist                           # POST - Add item to wishlist
/api/wishlist/:id                       # DELETE - Remove item from wishlist
```

## 4. Order Management

```
/api/orders                             # POST - Create order
/api/orders                             # GET - Get all user orders
/api/orders/:id                         # GET - Get single order
/api/orders/:id/cancel                  # PATCH - Cancel order

/api/admin/orders                       # GET - Get all orders (Admin)
/api/admin/orders/:id                   # PATCH - Update order status (Admin)
```

## 5. Reviews & Ratings

```
/api/products/:id/review                # POST - Add review
/api/products/:id/reviews               # GET - Get all reviews for a product
/api/products/:id/review/:reviewId      # DELETE - Delete review (User/Admin)
```

## 6. Admin Dashboard (Protected Routes)

```
/api/admin/reports/sales                # GET - Sales report
/api/admin/reports/users                # GET - User statistics
/api/admin/reports/top-products         # GET - Top-selling products
```

## 7. Miscellaneous

```
/api/coupons/apply                      # POST - Apply discount coupon
/api/orders/:id/track                   # GET - Track order status
/api/support/contact                    # POST - Contact support
```

<!-- ## 8. Payment Integration

```
/api/payment/initiate                   # POST - Initiate payment
/api/payment/verify                     # POST - Verify payment
/api/payment/status/:id                 # GET - Get payment status
``` -->
