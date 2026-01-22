# LMS Payment Gateway

A comprehensive Learning Management System (LMS) with integrated payment gateway functionality. This project enables instructors to create and manage courses, while students can purchase and track their learning progress.

## Features

### 🎓 Course Management

- **Create & Manage Courses**: Instructors can create courses with titles, descriptions, and thumbnails
- **Lecture Organization**: Add and organize lectures within courses
- **Course Search**: Students can search and filter published courses
- **Course Progress Tracking**: Monitor student progress through course lectures

### 💳 Payment Integration

- **Stripe Integration**: Seamless course purchase via Stripe payment gateway
- **Webhook Support**: Secure payment confirmation through webhooks
- **Purchase History**: View all purchased courses
- **Purchase Status**: Check course purchase status and payment details

### 👥 User Management

- **Authentication**: Secure user signup and signin with JWT tokens
- **Role-Based Access**: Support for different user roles (student, instructor)
- **Profile Management**: Update user profiles and avatars
- **Password Management**: Secure password change functionality

### 🔒 Security Features

- **JWT Authentication**: Token-based authentication for API routes
- **Input Validation**: Express validator for request validation
- **Rate Limiting**: Protection against abuse with configurable rate limits
- **Security Headers**: Helmet.js for HTTP security headers
- **MongoDB Sanitization**: Protection against NoSQL injection
- **HPP Protection**: HTTP Parameter Pollution protection

## Tech Stack

### Backend

- **Node.js & Express.js**: Server framework
- **MongoDB & Mongoose**: Database and ODM
- **JWT (jsonwebtoken)**: Authentication tokens
- **Stripe**: Payment processing
- **Cloudinary**: Image storage and management
- **Multer**: File upload handling

### Security & Utilities

- **bcryptjs**: Password hashing
- **Helmet**: HTTP security headers
- **express-rate-limit**: Rate limiting
- **express-mongo-sanitize**: NoSQL injection prevention
- **HPP**: HTTP Parameter Pollution protection
- **cors**: Cross-Origin Resource Sharing
- **Morgan**: HTTP request logger

## Project Structure

```
server/
├── index.js                    # Main application entry point
├── package.json               # Dependencies and scripts
├── controllers/               # Business logic
│   ├── user.controller.js
│   ├── course.controller.js
│   ├── courseProgress.controller.js
│   ├── coursePurchase.controller.js
│   └── health.controller.js
├── models/                    # Database schemas
│   ├── user.model.js
│   ├── course.model.js
│   ├── lecture.model.js
│   ├── courseProgress.js
│   └── coursePurchase.model.js
├── routes/                    # API endpoints
│   ├── user.route.js
│   ├── course.route.js
│   ├── courseProgress.route.js
│   ├── purchaseCourse.route.js
│   ├── media.route.js
│   └── health.route.js
├── middleware/                # Custom middleware
│   ├── auth.middleware.js     # Authentication & authorization
│   ├── error.middleware.js    # Error handling
│   └── validation.middleware.js
├── database/
│   └── db.js                  # Database connection
├── utils/
│   ├── cloudinary.js          # Cloudinary configuration
│   ├── multer.js              # File upload configuration
│   └── generateToken.js       # JWT token generation
└── uploads/                   # Local upload directory
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd lms-paymentgateway/server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the server directory:

   ```env
   PORT=5000
   NODE_ENV=development

   # Database
   MONGODB_URI=your_mongodb_connection_string

   # JWT
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d

   # Stripe
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=your_webhook_secret

   # Cloudinary
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Email (optional)
   SMTP_HOST=your_smtp_host
   SMTP_PORT=your_smtp_port
   SMTP_USER=your_email
   SMTP_PASSWORD=your_password
   ```

4. **Start the server**

   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

The server will start on the configured PORT (default: 5000).

## API Endpoints

### Authentication & User Management

- `POST /api/users/signup` - Create new user account
- `POST /api/users/signin` - Login user
- `POST /api/users/signout` - Logout user
- `GET /api/users/profile` - Get current user profile
- `PATCH /api/users/profile` - Update user profile (with avatar upload)
- `POST /api/users/change-password` - Change password
- `DELETE /api/users/account` - Delete user account

### Course Management

- `POST /api/courses` - Create new course (Instructor only)
- `GET /api/courses` - Get instructor's created courses
- `GET /api/courses/published` - Get all published courses
- `GET /api/courses/search` - Search courses
- `GET /api/courses/:courseId` - Get course details
- `PATCH /api/courses/:courseId` - Update course details
- `POST /api/courses/:courseId/lectures` - Add lecture to course
- `GET /api/courses/:courseId/lectures` - Get course lectures

### Course Purchase & Payments

- `POST /api/purchases/checkout/create-checkout-session` - Initiate Stripe checkout
- `POST /api/purchases/webhook` - Stripe webhook handler
- `GET /api/purchases` - Get purchased courses
- `GET /api/purchases/:courseId/detail-with-status` - Get purchase status

### Course Progress

- `GET /api/progress/:courseId` - Get course progress
- `POST /api/progress/:courseId/lectures/:lectureId` - Mark lecture as completed
- `PATCH /api/progress/:courseId` - Update course progress

### Health Check

- `GET /api/health` - Server health status

## Security Features Explained

- **Rate Limiting**: 100 requests per 15 minutes per IP to prevent abuse
- **JWT Tokens**: Secure stateless authentication with expirable tokens
- **Password Hashing**: Bcrypt with salt rounds for secure password storage
- **Input Validation**: Server-side validation for all user inputs
- **CORS**: Configured cross-origin requests
- **Helmet**: Sets various HTTP headers for security
- **MongoDB Sanitization**: Prevents NoSQL injection attacks
- **HPP**: Protects against HTTP Parameter Pollution attacks

## Development

### Available Scripts

```bash
# Run in development mode with hot-reload
npm run dev

# Run in production mode
npm start
```

### Key Middleware

- **Authentication Middleware**: Protects routes requiring login
- **Authorization Middleware**: Role-based access control (student/instructor)
- **Validation Middleware**: Input validation for signup, signin, and password changes
- **Error Middleware**: Centralized error handling

## Database Models

### User

- Email, name, avatar
- Role (student/instructor)
- Password hash
- Timestamps

### Course

- Title, description, thumbnail
- Instructor reference
- Price, publication status
- Created/updated dates

### Lecture

- Title, description, video URL
- Course reference
- Duration, order

### CoursePurchase

- User reference
- Course reference
- Payment status, transaction ID
- Purchase date

### CourseProgress

- User reference
- Course reference
- Completed lectures
- Progress percentage
- Last accessed date

## Error Handling

The application includes comprehensive error handling with:

- Custom error middleware
- Validation error responses
- Database error handling
- Payment processing error handling
- Centralized error logging

