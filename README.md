# 🏪 Rentify - Backend

## 📌 Overview

The backend of Rentify is built with **Node.js** & **Express.js**, using **MongoDB** for data storage. It provides a REST API for managing users, listings, rental requests, and payments (SSLCommerz).

## 🌍 Live URL

Want to test your own, please use this link
[Live Deployment](http://54.253.12.199:5000/)

## 🛠️ Features

- 🔐 **Authentication** (JWT, Password Hashing, Role-Based Access)
- 🛍️ **Listing Management** (CRUD Operations)
- 📦 **Request Management** (CRUD, Payment)
- 💳 **SSLCommerz Integration** (Payment Processing)
- 📡 **RESTful API** with secure middleware

## 🏗️ Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT, bcrypt
- **Payment Gateway**: SSLCommerz Payment Gateway

## 🏃‍♂️ Getting Started

1. Clone the repository:
    ```bash
    git clone https://github.com/krHasan/ph-L2-M5-B4-assignment-server.git rentify-backend
    cd rentify-backend
    ```
2. Install dependencies:
    ```bash
    npm install --legacy-peer-deps
    ```
3. Set up environment variables in a `.env` file:

    ```env
    # Environment
    NODE_ENV=development

    # Port
    PORT=5000

    # Database URL
    DB_URL=""

    # Bcrypt Salt Rounds
    BCRYPT_SALT_ROUNDS=

    # JWT Secrets and Expiry
    JWT_ACCESS_SECRET=
    JWT_ACCESS_EXPIRES_IN=
    JWT_REFRESH_SECRET=
    JWT_REFRESH_EXPIRES_IN=
    JWT_OTP_SECRET=
    JWT_PASS_RESET_SECRET=
    JWT_PASS_RESET_EXPIRES_IN=

    # Cloudinary Credentials
    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=

    # Email Configuration
    SENDER_EMAIL=""
    SENDER_APP_PASS=""

    # SSLCommerz Payment Info
    STORE_NAME=""
    PAYMENT_API=""
    VALIDATION_API=""
    STORE_ID=""
    STORE_PASSWORD=""
    VALIDATION_URL="http://localhost:5000/api/v1/ssl/validate"
    SUCCESS_URL="http://localhost:3000/success"
    FAILED_URL="http://localhost:3000/failed"
    CANCEL_URL="http://localhost:3000"

    FRONTEND_LINK="http://localhost:3000"
    BACKEND_LINK="http://localhost:5000"
    ```

4. Start the development server:
   `bash
    npm run dev
    `
   Server will be running on: http://localhost:5000

## API Endpoints

### Authentication

```✅️ POST 	/api/v1/auth/login
✅️ POST 	/api/v1/auth/change-password
✅️ POST 	/api/v1/auth/refresh-token
✅️ POST 	/api/v1/auth/forget-password
✅️ POST 	/api/v1/auth/reset-password
```

### User

```
✅️ POST		/api/v1/user/create-user
✅️ GET		/api/v1/user/
✅️ POST		/api/v1/user/change-status/:id
```

### Listings

```
✅️ POST 	/api/v1/listings/create-list
✅️ GET 		/api/v1/listings
✅️ GET 		/api/v1/listings/:listingId
✅️ DELETE 	/api/v1/listings/:listingId
✅️ GET 		/api/v1/listings/my-listings
✅️ PATCH 	/api/v1/listings/:listingId
✅️ PATCH 	/api/v1/listings/update-status/:listingId
```

### Requests

```
✅️ POST 	/api/v1/requests/create-request
✅️ GET 		/api/v1/requests/
✅️ PATCH	/api/v1/requests/cancel-request/:requestId
✅️ PATCH	/api/v1/requests/change-request-status/:requestId
```

### Payments

```
✅️ POST 	/api/v1/payments/initiate
```

### Dashboard

```
✅️ GET		/api/v1/dashboard
```

## Contribution

Contributions are welcome! Please fork the repository and create a pull request.

## License

MIT (do whatever you want to do :smile: )

Made by [krHasan](https://www.linkedin.com/in/kr-hasan/)
