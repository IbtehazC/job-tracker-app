export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateApplicationForm(data: {
  jobTitle: string;
  company: string;
  jobUrl: string;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.jobTitle.trim()) {
    errors.jobTitle = 'Job title is required';
  } else if (data.jobTitle.length > 100) {
    errors.jobTitle = 'Job title must be less than 100 characters';
  }

  if (!data.company.trim()) {
    errors.company = 'Company name is required';
  } else if (data.company.length > 100) {
    errors.company = 'Company name must be less than 100 characters';
  }

  if (!data.jobUrl.trim()) {
    errors.jobUrl = 'Job URL is required';
  } else if (!isValidUrl(data.jobUrl)) {
    errors.jobUrl = 'Please enter a valid URL';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
