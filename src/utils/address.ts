// Utility functions for address handling

export interface ParsedAddress {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  fullAddress: string;
}

export function parseAddress(addressString: string): ParsedAddress {
  if (!addressString) {
    return { fullAddress: '' };
  }

  // Simple parsing - in a real app, you might want more sophisticated parsing
  // This assumes the address is stored as a comma-separated string
  const parts = addressString.split(',').map(part => part.trim());
  
  return {
    street: parts[0] || '',
    city: parts[1] || '',
    state: parts[2] || '',
    zipCode: parts[3] || '',
    country: parts[4] || '',
    fullAddress: addressString
  };
}

export function formatAddress(address: ParsedAddress): string {
  const parts = [
    address.street,
    address.city,
    address.state,
    address.zipCode,
    address.country
  ].filter(Boolean);
  
  return parts.join(', ');
}
