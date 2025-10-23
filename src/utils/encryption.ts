import CryptoJS from 'crypto-js';
import { PaymentCard } from '../types/database';

// Secret key for encryption - in production, this should be stored in environment variables
const SECRET_KEY = process.env.ENCRYPTION_KEY || 'your-secret-key-here-change-in-production';

export function encrypt(text: string): string {
  try {
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

export function decrypt(encryptedText: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

export function hashPassword(password: string): string {
  try {
    return CryptoJS.SHA256(password).toString();
  } catch (error) {
    console.error('Password hashing error:', error);
    throw new Error('Failed to hash password');
  }
}

// Encrypt payment card information
export function encryptPaymentCard(cardData: PaymentCard): string {
  try {
    const cardJson = JSON.stringify(cardData);
    return encrypt(cardJson);
  } catch (error) {
    console.error('Payment card encryption error:', error);
    throw new Error('Failed to encrypt payment card data');
  }
}

// Decrypt payment card information
export function decryptPaymentCard(encryptedCardData: string): PaymentCard {
  try {
    const decryptedJson = decrypt(encryptedCardData);
    return JSON.parse(decryptedJson) as PaymentCard;
  } catch (error) {
    console.error('Payment card decryption error:', error);
    throw new Error('Failed to decrypt payment card data');
  }
}

// Mask card number for display (show only last 4 digits)
export function maskCardNumber(cardNumber: string): string {
  if (!cardNumber || cardNumber.length < 4) return '****';
  return '**** **** **** ' + cardNumber.slice(-4);
}

// Validate card number (basic Luhn algorithm)
export function validateCardNumber(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\D/g, '');
  if (cleaned.length < 13 || cleaned.length > 19) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}
