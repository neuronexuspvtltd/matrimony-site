import { RAZORPAY_CONFIG } from '../config/razorpay';

// --------------------------------------------------
// 💳 RAZORPAY CHECKOUT SDK SERVICE
// --------------------------------------------------

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

// Dynamically load Razorpay Checkout JS SDK if not present on page
export const loadRazorpaySDK = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const openRazorpayPayment = async ({
  userDetails,
  onSuccess,
  onFailure,
}: {
  userDetails: { name: string; email: string; contact: string };
  onSuccess: (paymentId: string, response: RazorpaySuccessResponse) => void;
  onFailure: (errorMsg: string) => void;
}) => {
  const isLoaded = await loadRazorpaySDK();
  if (!isLoaded) {
    onFailure('Failed to load Razorpay payment gateway SDK. Please check your network connection.');
    return;
  }

  const options = {
    key: RAZORPAY_CONFIG.keyId,
    amount: RAZORPAY_CONFIG.amountPaise,
    currency: RAZORPAY_CONFIG.currency,
    name: RAZORPAY_CONFIG.companyName,
    description: RAZORPAY_CONFIG.description,
    image: '/v_brothers_icon.png',
    prefill: {
      name: userDetails.name,
      email: userDetails.email,
      contact: userDetails.contact,
    },
    theme: {
      color: RAZORPAY_CONFIG.themeColor,
    },
    handler: function (response: RazorpaySuccessResponse) {
      if (response.razorpay_payment_id) {
        onSuccess(response.razorpay_payment_id, response);
      } else {
        onFailure('Payment response missing transaction ID.');
      }
    },
    modal: {
      ondismiss: function () {
        onFailure('Payment checkout was closed or cancelled.');
      },
    },
  };

  try {
    const razorpayInstance = new (window as any).Razorpay(options);
    razorpayInstance.open();
  } catch (err: any) {
    console.error('Razorpay initialization error:', err);
    onFailure(err.message || 'Razorpay checkout error');
  }
};
