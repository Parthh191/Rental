export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidEmail(email: string): { isValid: boolean; message?: string } {
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }
  
  if (!validateEmail(email)) {
    return { isValid: false, message: 'Invalid email format' };
  }
  
  return { isValid: true };
}