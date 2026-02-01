import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatError(error: any): string {
  if (typeof error === 'string') return error;

  if (error && typeof error === 'object') {
    // Handle Zod flatten() errors: { formErrors: [], fieldErrors: { field: [] } }
    if ('fieldErrors' in error || 'formErrors' in error) {
      const fieldErrors = Object.values(error.fieldErrors || {}).flat() as string[];
      const formErrors = (error.formErrors || []) as string[];
      const allErrors = [...formErrors, ...fieldErrors];
      if (allErrors.length > 0) return allErrors[0]; // Return the first error for simplicity
    }

    // Handle generic error message
    if (error.message) return error.message;

    // Handle array of errors
    if (Array.isArray(error)) {
      const first = error[0];
      if (typeof first === 'string') return first;
      if (first && typeof first === 'object' && first.message) return first.message;
    }
  }

  return 'An unexpected error occurred';
}


export function getSocialLink(value: string | null | undefined, type: 'github' | 'linkedin' | 'telegram'): string {
  if (!value) return "#";

  // If it's already a full URL, return it
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }

  // Clean the value (remove @ if present)
  const cleanValue = value.replace(/^@/, '');

  switch (type) {
    case 'github':
      return `https://github.com/${cleanValue}`;
    case 'linkedin':
      // LinkedIn usernames can be complex, but usually it's /in/username
      if (cleanValue.startsWith('in/')) {
        return `https://linkedin.com/${cleanValue}`;
      }
      return `https://linkedin.com/in/${cleanValue}`;
    case 'telegram':
      return `https://t.me/${cleanValue}`;
    default:
      return "#";
  }
}

export function calculateAcademicYear(batch: string | number | null | undefined, department?: string | null): string {
  if (!batch) return "-";
  const entryYear = Number(batch);
  if (isNaN(entryYear) || entryYear <= 0) return "-";

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-indexed

  // Academic year starts in September (month 9)
  // If we are in Sept-Dec, the "Academic Start Year" is the current year.
  // If we are in Jan-Aug, the "Academic Start Year" is the previous year.
  let academicYearStart = currentMonth >= 9 ? currentYear : currentYear - 1;
  let year = academicYearStart - entryYear + 1;

  if (year <= 0) return "Not Started";

  const isEngineering = department?.toLowerCase().includes("engineer") || false;
  const programLength = isEngineering ? 5 : 4;

  // Graduated if year exceeds program length 
  // OR if it's June (month 6) of the final year
  if (year > programLength) return "Graduated";
  if (year === programLength && currentMonth === 6) return "Graduated";

  const suffixes = ["st", "nd", "rd", "th", "th"];
  return `${year}${suffixes[year - 1] || "th"} Year`;
}

