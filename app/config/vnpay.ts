/**
 * VNPay Configuration File
 *
 * IMPORTANT: Replace these values with your actual VNPay credentials
 * You can get these from your VNPay merchant dashboard
 */

export const VNPAY_CONFIG = {
  // 👉 REPLACE WITH YOUR ACTUAL CREDENTIALS
  TMN_CODE: "XV01TBAT", // Your VNPay Terminal Code
  HASH_SECRET: "UN6ERU1UXDV4HIUGG8G8DZU9NWC98HSL", // Your VNPay Hash Secret

  // URLs
  SANDBOX_URL: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  PRODUCTION_URL: "https://pay.vnpayment.vn/vpcpay.html",

  // Return URLs (must be registered with VNPay)
  PRODUCTION_RETURN_URL: "ecommercenative://complete-payment", // Updated to match app scheme
  SANDBOX_RETURN_URL: "ecommercenative://complete-payment", // Updated to match app scheme

  // Environment
  IS_PRODUCTION: false, // Set to true for production

  // Payment Settings
  CURRENCY: "VND",
  LOCALE: "vn",
  VERSION: "2.1.0",
  COMMAND: "pay",
  ORDER_TYPE: "other",

  // Helper function to get current URL based on environment
  getCurrentUrl: () => {
    return VNPAY_CONFIG.IS_PRODUCTION
      ? VNPAY_CONFIG.PRODUCTION_URL
      : VNPAY_CONFIG.SANDBOX_URL;
  },

  // Helper function to get current return URL based on environment
  getCurrentReturnUrl: () => {
    return VNPAY_CONFIG.IS_PRODUCTION
      ? VNPAY_CONFIG.PRODUCTION_RETURN_URL
      : VNPAY_CONFIG.SANDBOX_RETURN_URL;
  },
};

export default VNPAY_CONFIG;
