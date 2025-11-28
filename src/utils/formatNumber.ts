/**
 * Format a number with proper locale formatting (thousands separators)
 * @param num - The number to format
 * @param decimals - Optional number of decimal places (default: auto)
 * @returns Formatted number string
 */
export function formatNumber(num: number | string | null | undefined, decimals?: number): string {
  if (num === null || num === undefined) {
    return '0';
  }

  const numericValue = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(numericValue)) {
    return '0';
  }

  const options: Intl.NumberFormatOptions = {};
  
  if (decimals !== undefined) {
    options.minimumFractionDigits = decimals;
    options.maximumFractionDigits = decimals;
  }

  return numericValue.toLocaleString('en-US', options);
}

/**
 * Format calories with "cal" suffix
 * @param calories - The calorie value
 * @returns Formatted string like "2,000 cal"
 */
export function formatCalories(calories: number | string | null | undefined): string {
  return `${formatNumber(calories)} cal`;
}

/**
 * Format grams with "g" suffix
 * @param grams - The gram value
 * @param decimals - Optional number of decimal places
 * @returns Formatted string like "150g"
 */
export function formatGrams(grams: number | string | null | undefined, decimals?: number): string {
  return `${formatNumber(grams, decimals)}g`;
}

/**
 * Format minutes with "min" suffix
 * @param minutes - The minutes value
 * @returns Formatted string like "30 min"
 */
export function formatMinutes(minutes: number | string | null | undefined): string {
  return `${formatNumber(minutes)} min`;
}

/**
 * Format seconds to minutes with "min" suffix
 * @param seconds - The seconds value
 * @returns Formatted string like "5 min"
 */
export function formatSecondsToMinutes(seconds: number | string | null | undefined): string {
  if (seconds === null || seconds === undefined) {
    return '0 min';
  }
  const numericValue = typeof seconds === 'string' ? parseFloat(seconds) : seconds;
  if (isNaN(numericValue)) {
    return '0 min';
  }
  return `${Math.floor(numericValue / 60)} min`;
}
