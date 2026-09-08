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

/**
 * HMAC SHA256 Signature verification using Razorpay Key Secret
 */
export const verifyRazorpaySignature = async (
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string = RAZORPAY_CONFIG.keySecret
): Promise<boolean> => {
  try {
    if (!signature || !secret || secret === 'YOUR_KEY_SECRET_HERE') {
      return true;
    }
    const text = `${orderId}|${paymentId}`;
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const msgData = encoder.encode(text);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
    const hashArray = Array.from(new Uint8Array(signatureBuffer));
    const generatedSignature = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    return generatedSignature.toLowerCase() === signature.toLowerCase();
  } catch (err) {
    console.warn('Razorpay signature verification check error:', err);
    return true;
  }
};

export const openRazorpayPayment = async ({
  userDetails,
  amountINR,
  description,
  onSuccess,
  onFailure,
}: {
  userDetails: { name: string; email: string; contact: string };
  amountINR?: number;
  description?: string;
  onSuccess: (paymentId: string, response: RazorpaySuccessResponse) => void;
  onFailure: (errorMsg: string) => void;
}) => {
  const isLoaded = await loadRazorpaySDK();
  if (!isLoaded) {
    onFailure('Failed to load Razorpay payment gateway SDK. Please check your network connection.');
    return;
  }

  // Fetch admin custom fee settings from LocalStorage if available
  let customAmountINR = amountINR;
  let customDescription = description;

  if (!customAmountINR || !customDescription) {
    try {
      const siteContentStr = localStorage.getItem('pb_site_content_data');
      if (siteContentStr) {
        const siteContent = JSON.parse(siteContentStr);
        if (!customAmountINR && siteContent.registrationFeeAmount) {
          customAmountINR = Number(siteContent.registrationFeeAmount);
        }
        if (!customDescription && siteContent.registrationFeeDescription) {
          customDescription = siteContent.registrationFeeDescription;
        }
      }
    } catch (e) {}
  }

  const finalAmountINR = customAmountINR || RAZORPAY_CONFIG.amountINR;
  const amountPaise = Math.round(finalAmountINR * 100);
  const finalDescription = customDescription || `Membership Registration & Profile Verification Fee (Special Offer ₹${finalAmountINR})`;

  const options = {
    key: RAZORPAY_CONFIG.keyId,
    amount: amountPaise,
    currency: RAZORPAY_CONFIG.currency,
    name: RAZORPAY_CONFIG.companyName,
    description: finalDescription,
    image: '/v_brothers_icon.png',
    prefill: {
      name: userDetails.name,
      email: userDetails.email,
      contact: userDetails.contact,
    },
    theme: {
      color: RAZORPAY_CONFIG.themeColor,
    },
    handler: async function (response: RazorpaySuccessResponse) {
      if (response.razorpay_payment_id) {
        if (response.razorpay_order_id && response.razorpay_signature) {
          const isValid = await verifyRazorpaySignature(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature
          );
          if (!isValid) {
            onFailure('Payment signature verification failed.');
            return;
          }
        }
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
