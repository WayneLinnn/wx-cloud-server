/**
 * Generate a random verification code
 * @returns {string} 6-digit verification code
 */
function generateRandomCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Validate phone number format (Chinese mainland)
 * @param {string} phoneNumber
 * @returns {boolean}
 */
function isValidPhoneNumber(phoneNumber) {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phoneNumber);
}

module.exports = {
  generateRandomCode,
  isValidPhoneNumber,
};
