// --------------------------------------------------
// 💳 RAZORPAY PAYMENT GATEWAY CONFIGURATION
// --------------------------------------------------
// You can replace the Key ID and Key Secret below with your live/test credentials
// or set VITE_RAZORPAY_KEY_ID & VITE_RAZORPAY_KEY_SECRET in your environment (.env).

export const RAZORPAY_CONFIG = {
  // Replace 'rzp_test_YOUR_KEY_HERE' with your Razorpay Key ID
  keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TVYUdqwLb9fjkb',
  
  // Replace 'YOUR_KEY_SECRET_HERE' with your Razorpay Key Secret
  keySecret: import.meta.env.VITE_RAZORPAY_KEY_SECRET || 'aEB9W9xlX40NuevBr2DB8RKG',

  // Registration Fee Offer Pricing
  originalAmountINR: 5000, // ₹5,000 INR (Strikethrough original price)
  amountINR: 2499, // ₹2,499 INR (Special Offer Final Price)
  amountPaise: 249900, // 2499 * 100 paise

  currency: 'INR',
  companyName: 'V Brothers Marriage Bureau',
  description: 'Membership Registration & Profile Verification Fee (Special Offer ₹2,499)',
  themeColor: '#581c87', // Brand Maroon / Purple
};
