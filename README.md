This is an E-Booking System built with [Next.js](https://nextjs.org) for movie ticket booking.

## Features

- **User Registration**: Complete user registration with optional address and payment method fields
- **Password Security**: Passwords are hashed using SHA-256 for secure storage
- **Payment Security**: Payment information is encrypted using AES encryption
- **Address Handling**: Addresses are stored as strings and can be parsed by the application
- **API Routes**: Complete CRUD operations for users, movies, showtimes, and bookings
- **Firebase Integration**: Uses Firebase Firestore for data storage

## Security Features

- **Password Security**: Passwords are hashed using SHA-256 before storage
- **Payment Card Encryption**: All payment card information is encrypted using AES encryption
- **Card Data Protection**: Complete card details (number, holder name, expiry, CVV, billing address) are encrypted
- **Data Masking**: Sensitive data is properly masked in API responses (card numbers show only last 4 digits)
- **Card Validation**: Built-in Luhn algorithm validation for card numbers
- **Debug Logging**: Comprehensive logging for password and payment processing verification

## Payment Card Features

- **Complete Card Information**: Collects all necessary card details
- **Real-time Validation**: Card number validation with visual feedback
- **Secure Storage**: All card data encrypted before database storage
- **Masked Display**: Card numbers are masked for security (shows only last 4 digits)
- **Optional Fields**: Payment information is completely optional during registration

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
