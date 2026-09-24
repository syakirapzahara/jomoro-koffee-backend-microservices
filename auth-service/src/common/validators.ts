export function isLettersOnly(value: string): boolean {
  if (!value || value.length === 0) {
    return false;
  }
  for (let i = 0; i < value.length; i++) {
    const char = value.charAt(i);
    const isUpper = char >= 'A' && char <= 'Z';
    const isLower = char >= 'a' && char <= 'z';
    if (!isUpper && !isLower) {
      return false;
    }
  }
  return true;
}

export function isValidEmailDomain(email: string): boolean {
  if (!email || email.length === 0) {
    return false;
  }

  const atIndex = email.indexOf('@');
  if (atIndex <= 0 || atIndex >= email.length - 1) {
    return false;
  }

  const domainPart = email.substring(atIndex + 1);
  if (domainPart.length === 0) {
    return false;
  }

  const validDomains = ['.com', '.net', '.org', '.id'];
  for (const domain of validDomains) {
    if (email.endsWith(domain)) {
      return true;
    }
  }
  return false;
}

export function isValidPassword(password: string): boolean {
  if (!password || password.includes(' ')) {
    return false;
  }
  if (password.length < 8) {
    return false;
  }
  let digitCount = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charAt(i);
    if (char >= '0' && char <= '9') {
      digitCount++;
    }
  }
  return digitCount >= 2;
}

export function isNotEmpty(value: string): boolean {
  return value !== undefined && value !== null && value.trim().length > 0;
}
