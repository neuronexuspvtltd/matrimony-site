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

  // Registration Fee Amount
  amountINR: 1100, // ₹1,100 INR
  amountPaise: 110000, // 1100 * 100 paise

  currency: 'INR',
  companyName: 'V Brothers Marriage Bureau',
  description: 'Membership Registration & Profile Verification Fee (₹1,100)',
  themeColor: '#581c87', // Brand Maroon / Purple
};
