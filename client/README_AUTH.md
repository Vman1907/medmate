# MedMate Authentication System

This document describes the OTP-based authentication system implemented in the MedMate Next.js application.

## Features

### ✅ Complete Authentication Flow

- **User Registration**: Collect name, email, and phone number
- **OTP Generation**: 6-digit OTP sent via email
- **Email Verification**: Beautiful HTML email templates using Resend
- **JWT Tokens**: Secure authentication with HTTP-only cookies
- **Session Management**: Automatic token validation and refresh

### ✅ User Experience

- **Toast Notifications**: Real-time feedback for all actions
- **Loading States**: Visual feedback during API calls
- **Form Validation**: Client and server-side validation
- **Responsive Design**: Works on all device sizes
- **Dark Mode Support**: Consistent with app theme

### ✅ Security Features

- **Secure Cookies**: HTTP-only, secure, same-site cookies
- **JWT Tokens**: Stateless authentication
- **OTP Expiration**: 10-minute OTP validity
- **Input Validation**: Email and phone number validation
- **Error Handling**: Comprehensive error management

## Database Schema

### User Model

```typescript
interface User {
	email: string; // Required, unique, lowercase
	phoneNumber: string; // Required, unique
	name: string; // Required
	otp?: string; // Temporary OTP for verification
	otpExpiry?: Date; // OTP expiration timestamp
	isVerified: boolean; // Account verification status
	createdAt: Date; // Account creation timestamp
	updatedAt: Date; // Last update timestamp
}
```

## API Endpoints

### 1. Send OTP

**POST** `/api/auth/send-otp`

```json
{
	"email": "user@example.com",
	"phoneNumber": "+1234567890",
	"name": "John Doe"
}
```

**Response:**

```json
{
	"message": "OTP sent successfully",
	"email": "user@example.com"
}
```

### 2. Verify OTP

**POST** `/api/auth/verify-otp`

```json
{
	"email": "user@example.com",
	"otp": "123456"
}
```

**Response:**

```json
{
	"message": "Login successful",
	"user": {
		"id": "user_id",
		"email": "user@example.com",
		"name": "John Doe",
		"phoneNumber": "+1234567890",
		"isVerified": true
	}
}
```

### 3. Get Current User

**GET** `/api/auth/me`

**Response:**

```json
{
	"user": {
		"id": "user_id",
		"email": "user@example.com",
		"name": "John Doe",
		"phoneNumber": "+1234567890",
		"isVerified": true,
		"createdAt": "2024-01-01T00:00:00.000Z",
		"updatedAt": "2024-01-01T00:00:00.000Z"
	}
}
```

### 4. Logout

**POST** `/api/auth/logout`

**Response:**

```json
{
	"message": "Logged out successfully"
}
```

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the client directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/medmate

# JWT Secret (change in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (Resend)
RESEND_API_KEY=your-resend-api-key

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-nextauth-secret
```

### 2. Email Setup (Resend)

1. **Sign up for Resend**:

   - Go to [resend.com](https://resend.com)
   - Create a free account
   - Get your API key from the dashboard

2. **Verify your domain** (optional but recommended):

   - Add your domain to Resend
   - Update the `from` email in `src/lib/email.ts` to use your domain
   - Example: `from: 'MedMate <noreply@yourdomain.com>'`

3. **For testing**:
   - You can use the default `noreply@medmate.com` sender
   - Resend will handle the delivery automatically

### 3. MongoDB Setup

**Option A: Local MongoDB**

```bash
# macOS with Homebrew
brew install mongodb-community
brew services start mongodb-community

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option B: MongoDB Atlas**

- Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
- Get your connection string and update `MONGODB_URI`

### 4. Install Dependencies

```bash
npm install
```

### 5. Start Development Server

```bash
npm run dev
```

## Usage

### Authentication Flow

1. **User clicks "Login"** in the navbar
2. **Fill in details**: Name, email, and phone number
3. **Send OTP**: Click "Send OTP" button
4. **Check email**: OTP is sent to the provided email via Resend
5. **Enter OTP**: 6-digit code in the OTP input
6. **Verify**: Click "Verify OTP" to complete login
7. **Success**: User is logged in and redirected

### User Interface

- **Navbar**: Shows user name when logged in
- **Profile Page**: Access user information at `/profile`
- **Logout**: Available in navbar and profile page
- **Toast Notifications**: Success/error feedback

### Protected Routes

- `/profile`: Requires authentication
- Future routes can be protected using the `useAuth` hook

## Components

### AuthDialog

- Main authentication component
- Handles both registration and login
- Two-step process: details → OTP verification
- Form validation and error handling

### useAuth Hook

- Provides authentication state
- `user`: Current user object or null
- `loading`: Authentication check status
- `login()`: Update user state
- `logout()`: Clear session
- `checkAuth()`: Verify current session

### LogoutButton

- Simple logout component
- Only shows when user is authenticated
- Handles logout with toast notification

## Email Templates

The system sends beautiful HTML emails with:

- MedMate branding
- Professional styling
- Clear OTP display
- Security warnings
- Responsive design
- Delivered via Resend for high deliverability

## Security Considerations

1. **JWT Tokens**: Stored in HTTP-only cookies
2. **OTP Expiration**: 10-minute validity period
3. **Input Validation**: Server-side validation for all inputs
4. **Error Handling**: No sensitive information in error messages
5. **Rate Limiting**: Consider implementing for production

## Production Deployment

1. **Environment Variables**: Update all secrets
2. **MongoDB**: Use MongoDB Atlas or self-hosted
3. **Email Service**: Resend is already configured for production
4. **Rate Limiting**: Implement API rate limiting
5. **Monitoring**: Add logging and monitoring
6. **SSL**: Ensure HTTPS in production

## Troubleshooting

### Common Issues

1. **Email not sending**: Check Resend API key
2. **MongoDB connection**: Verify connection string
3. **OTP not working**: Check email spam folder
4. **JWT errors**: Verify JWT_SECRET is set

### Debug Mode

Add `console.log` statements in API routes for debugging:

```typescript
console.log('User data:', user);
console.log('OTP result:', emailResult);
```

## Future Enhancements

1. **Phone OTP**: Add SMS verification
2. **Social Login**: Google, Facebook integration
3. **Password Reset**: Email-based password recovery
4. **Account Deletion**: User account management
5. **Admin Panel**: User management interface
6. **Analytics**: Login/registration analytics
