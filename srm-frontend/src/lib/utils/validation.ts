export const validateEmail = (email: string) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
export const validatePhone = (phone: string) => /^\\+?[0-9]{10,}$/.test(phone);
