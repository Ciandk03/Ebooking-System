// Shared token storage for password reset
interface ResetTokenData {
  token: string;
  expires: number;
  userId: string;
}

const RESET_TOKENS = new Map<string, ResetTokenData>();

export function storeResetToken(email: string, tokenData: ResetTokenData): void {
  RESET_TOKENS.set(email, tokenData);
}

export function getResetToken(token: string): { email: string; data: ResetTokenData } | null {
  for (const [email, data] of RESET_TOKENS.entries()) {
    if (data.token === token) {
      return { email, data };
    }
  }
  return null;
}

export function deleteResetToken(email: string): void {
  RESET_TOKENS.delete(email);
}

export function validateTokenNotExpired(expires: number): boolean {
  return Date.now() <= expires;
}
