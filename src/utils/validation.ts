export interface SignupData {
  userName: string;
  password: string;
  email: string;
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const emailRegex = /^[a-z0-9][\w\.]+\@\w+?(\.\w+){1,}$/gi;

export function validateUsername(userName: string): ValidationResult {
  if (!userName) {
    return { isValid: false, message: "Username is required" };
  }

  if (userName.length < 8) {
    return {
      isValid: false,
      message: "Username must be at least 8 characters long",
    };
  }

  return { isValid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, message: "Password is required" };
  }

  if (!passwordRegex.test(password)) {
    return {
      isValid: false,
      message:
        "Password must contain at least 8 characters with uppercase, lowercase, number, and special character",
    };
  }

  return { isValid: true };
}

export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { isValid: false, message: "Email is required" };
  }

  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Please enter a valid email format" };
  }

  return { isValid: true };
}

export function validateSignupData(data: SignupData): ValidationResult {
  // Check if all required fields are present

  if (!data.userName || !data.password || !data.email) {
    return { isValid: false, message: "Invalid credentials" };
  }

  // Validate each field
  const usernameValidation = validateUsername(data.userName);
  if (!usernameValidation.isValid) {
    return usernameValidation;
  }

  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    return passwordValidation;
  }

  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    return emailValidation;
  }

  return { isValid: true };
}
