import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult,
  PhoneAuthProvider,
  Auth
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export interface FirebaseAuthHelpers {
  confirmationResult: ConfirmationResult | null;
  recaptchaVerifier: RecaptchaVerifier | null;
  initializeRecaptcha: (elementId: string) => Promise<void>;
  sendOTP: (phoneNumber: string) => Promise<ConfirmationResult | null>;
  verifyOTP: (otp: string) => Promise<boolean>;
  reset: () => void;
}

export const createFirebaseAuthHelpers = (): FirebaseAuthHelpers => {
  let confirmationResult: ConfirmationResult | null = null;
  let recaptchaVerifier: RecaptchaVerifier | null = null;

  const initializeRecaptcha = async (elementId: string = 'recaptcha-container') => {
    try {
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
      }

      recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
        },
        'error-callback': (error) => {
          console.error('reCAPTCHA error:', error);
        }
      });

      // Render the reCAPTCHA widget
      await recaptchaVerifier.render();
      console.log('reCAPTCHA initialized successfully');
    } catch (error) {
      console.error('Error initializing reCAPTCHA:', error);
      throw new Error('Failed to initialize reCAPTCHA. Please refresh the page and try again.');
    }
  };

  const sendOTP = async (phoneNumber: string): Promise<ConfirmationResult | null> => {
    try {
      // Validate phone number
      if (!phoneNumber) {
        throw new Error('Phone number is required');
      }

      // Format phone number
      const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      
      // Validate phone number format
      const phoneRegex = /^\+[1-9]\d{1,14}$/;
      if (!phoneRegex.test(formattedPhoneNumber)) {
        throw new Error('Please enter a valid phone number with country code (e.g., +1234567890)');
      }

      // Initialize reCAPTCHA if not already done
      if (!recaptchaVerifier) {
        await initializeRecaptcha();
      }

      console.log('Sending OTP to:', formattedPhoneNumber);
      
      // Send OTP
      confirmationResult = await signInWithPhoneNumber(
        auth, 
        formattedPhoneNumber, 
        recaptchaVerifier!
      );
      
      // Store globally as requested
      (window as any).confirmationResult = confirmationResult;
      
      console.log('OTP sent successfully');
      return confirmationResult;
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      throw new Error(error.message || 'Failed to send OTP. Please check the phone number and try again.');
    }
  };

  const verifyOTP = async (otp: string): Promise<boolean> => {
    try {
      if (!otp) {
        throw new Error('OTP is required');
      }

      if (!confirmationResult && !(window as any).confirmationResult) {
        throw new Error('Please send OTP first');
      }

      const confirmation = confirmationResult || (window as any).confirmationResult;
      
      if (!confirmation) {
        throw new Error('Confirmation result not found');
      }

      console.log('Verifying OTP:', otp);
      
      // Verify OTP
      const result = await confirmation.confirm(otp);
      console.log('User signed in successfully:', result.user);
      
      return true;
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      throw new Error(error.message || 'Invalid OTP. Please try again.');
    }
  };

  const reset = () => {
    confirmationResult = null;
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
      recaptchaVerifier = null;
    }
    (window as any).confirmationResult = null;
  };

  return {
    confirmationResult,
    recaptchaVerifier,
    initializeRecaptcha,
    sendOTP,
    verifyOTP,
    reset
  };
};