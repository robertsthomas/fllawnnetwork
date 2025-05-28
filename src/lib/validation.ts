import DOMPurify from 'isomorphic-dompurify';

// Email validation
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const validateEmail = (email: string): boolean => {
  return emailRegex.test(email);
};

// Phone validation (basic US format)
export const phoneRegex = /^\+?1?\d{10}$/;
export const validatePhone = (phone: string): boolean => {
  if (!phone) return true; // Phone is optional
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

// Name validation (basic)
export const validateName = (name: string): boolean => {
  return name.length >= 2 && name.length <= 100;
};

// Message validation
export const validateMessage = (message: string): boolean => {
  return message.length >= 10 && message.length <= 1000;
};

// Sanitize HTML
export const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html);
};

// Validate form data
export const validateFormData = (data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) => {
  const errors: string[] = [];

  if (!validateName(data.name)) {
    errors.push('Name must be between 2 and 100 characters');
  }

  if (!validateEmail(data.email)) {
    errors.push('Invalid email format');
  }

  if (data.phone && !validatePhone(data.phone)) {
    errors.push('Invalid phone number format');
  }

  if (!validateMessage(data.message)) {
    errors.push('Message must be between 10 and 1000 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
