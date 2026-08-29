// --------------------------------------------------
// 💳 RAZORPAY PAYMENT GATEWAY CONFIGURATION
// --------------------------------------------------
// You can replace the Key ID below with your live/test Razorpay Key ID
// or set VITE_RAZORPAY_KEY_ID in your environment variables (.env).

export const RAZORPAY_CONFIG = {
  // Replace 'rzp_test_YOUR_KEY_HERE' below with your actual Razorpay Key ID
  keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_HERE',
  
  // Registration Fee Amount
  amountINR: 1100, // ₹1,100 INR
  amountPaise: 110000, // 1100 * 100 paise

  currency: 'INR',
  companyName: 'V Brothers Marriage Bureau',
  description: 'Membership Registration & Profile Verification Fee (₹1,100)',
  themeColor: '#581c87', // Brand Maroon / Purple
};
