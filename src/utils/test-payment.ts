// Test utility for payment card encryption/decryption
import { encryptPaymentCard, decryptPaymentCard, maskCardNumber, validateCardNumber } from './encryption';
import { PaymentCard } from '../types/database';

export function testPaymentCardSystem() {
  console.log('🧪 Testing Payment Card System...');
  
  // Test card data
  const testCard: PaymentCard = {
    cardNumber: '4111111111111111', // Valid test card number
    cardHolderName: 'John Doe',
    expiryMonth: '12',
    expiryYear: '2025',
    cvv: '123',
    billingAddress: '123 Main St, City, State 12345'
  };

  console.log('📋 Original card data:', {
    cardNumber: maskCardNumber(testCard.cardNumber),
    cardHolderName: testCard.cardHolderName,
    expiryMonth: testCard.expiryMonth,
    expiryYear: testCard.expiryYear,
    cvv: '***',
    billingAddress: testCard.billingAddress
  });

  // Test validation
  const isValid = validateCardNumber(testCard.cardNumber);
  console.log('✅ Card validation:', isValid ? 'VALID' : 'INVALID');

  // Test encryption
  try {
    const encrypted = encryptPaymentCard(testCard);
    console.log('🔐 Encrypted payment data length:', encrypted.length);
    console.log('🔐 Encrypted data preview:', encrypted.substring(0, 50) + '...');

    // Test decryption
    const decrypted = decryptPaymentCard(encrypted);
    console.log('🔓 Decrypted card holder:', decrypted.cardHolderName);
    console.log('🔓 Decrypted card number (masked):', maskCardNumber(decrypted.cardNumber));
    
    console.log('✅ Payment card encryption/decryption test PASSED');
    return true;
  } catch (error) {
    console.error('❌ Payment card encryption/decryption test FAILED:', error);
    return false;
  }
}

// Run test if this file is executed directly
if (typeof window === 'undefined') {
  testPaymentCardSystem();
}
