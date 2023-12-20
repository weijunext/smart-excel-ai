/**
 * Formats a number according to specified rules, such as adding a comma every three digits.
 * 
 * @example
 * formatNumber({
 *   apart: 3,
 *   separator: ',',
 *   value: 123456789
 * }) // returns "123,456,789"
 * 
 * @param {number} [apart=3] - Number of digits between separators
 * @param {string} [separator=','] - Character to be used as a separator
 * @param {number|string} value - The number or numeric string to format
 * @returns {string|null} - The formatted string or null if input is invalid
 */
interface FormatNumberType {
  apart?: number;
  separator?: string;
  value: number | string;
}

export const formatNumber = ({
  apart = 3,
  separator = ',',
  value
}: FormatNumberType): string | null => {
  const stringValue = String(value).trim();

  // Verify if the value is a number and is not empty
  if (isNaN(Number(value)) || stringValue === '') {
    console.error('An invalid value was passed to formatNumber');
    return null; // Return null to indicate an error
  }

  const regex = new RegExp(`(\\d)(?=(\\d{${apart}})+(?!\\d))`, 'g');
  const [integerPart, decimalPart] = stringValue.split('.');

  // Format the integer part
  const formattedIntegerPart = integerPart.replace(regex, `$1${separator}`);

  // Concatenate the integer part with the decimal part if it exists
  return decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;
}
