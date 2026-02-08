import React, { useState, useRef, useEffect } from 'react';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult,
  PhoneAuthProvider
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface WindowWithConfirmation extends Window {
  confirmationResult?: ConfirmationResult;
}

const PhoneLogin: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const confirmationResultRef = useRef<ConfirmationResult | null>(null);

  // Initialize reCAPTCHA verifier
  useEffect(() => {
    initializeRecaptcha();
    
    return () => {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
      }
    };
  }, []);

  const initializeRecaptcha = () => {
    try {
      if (!recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {
            console.log('reCAPTCHA solved');
          },
          'expired-callback': () => {
            console.log('reCAPTCHA expired');
            setError('reCAPTCHA expired. Please try again.');
          },
          'error-callback': (error: any) => {
            console.error('reCAPTCHA error:', error);
            setError('reCAPTCHA error. Please try again.');
          }
        });
      }
    } catch (err) {
      console.error('Error initializing reCAPTCHA:', err);
      setError('Failed to initialize reCAPTCHA. Please check console for details.');
    }
  };

  const sendOtp = async () => {
    if (!phoneNumber) {
      setError('Please enter a phone number');
      return;
    }

    // Basic phone number validation
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    
    if (!phoneRegex.test(formattedPhoneNumber)) {
      setError('Please enter a valid phone number with country code (e.g., +1234567890)');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Ensure reCAPTCHA is initialized
      if (!recaptchaVerifierRef.current) {
        initializeRecaptcha();
        
        // Wait a bit for reCAPTCHA to initialize
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (!recaptchaVerifierRef.current) {
        throw new Error('reCAPTCHA failed to initialize');
      }

      console.log('Sending OTP to:', formattedPhoneNumber);
      
      // Send OTP
      const result = await signInWithPhoneNumber(auth, formattedPhoneNumber, recaptchaVerifierRef.current);
      confirmationResultRef.current = result;
      
      // Store globally as requested
      (window as WindowWithConfirmation).confirmationResult = result;
      
      setStep('otp');
      setMessage('OTP sent successfully! Please check your phone.');
      console.log('OTP sent successfully:', result);
    } catch (err: any) {
      console.error('Error sending OTP:', err);
      setError(err.message || 'Failed to send OTP. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    if (!confirmationResultRef.current && !(window as WindowWithConfirmation).confirmationResult) {
      setError('Please send OTP first');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const confirmation = confirmationResultRef.current || (window as WindowWithConfirmation).confirmationResult;
      
      if (!confirmation) {
        throw new Error('Confirmation result not found');
      }

      console.log('Verifying OTP:', otp);
      
      // Verify OTP
      const result = await confirmation.confirm(otp);
      console.log('User signed in successfully:', result.user);
      
      setMessage('Authentication successful!');
      
      // In a real app, you would redirect or update auth state here
      setTimeout(() => {
        alert('Authentication successful! In a real app, you would be redirected now.');
      }, 2000);
    } catch (err: any) {
      console.error('Error verifying OTP:', err);
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetFlow = () => {
    setStep('phone');
    setOtp('');
    setError('');
    setMessage('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Phone Number Authentication
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in with your phone number
          </p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          {step === 'phone' ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="phone-input" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="mt-1">
                  <input
                    id="phone-input"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter phone number with country code (e.g., +1234567890)"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              
              <button
                onClick={sendOtp}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="otp-input" className="block text-sm font-medium text-gray-700">
                  Enter OTP
                </label>
                <div className="mt-1">
                  <input
                    id="otp-input"
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={verifyOtp}
                  disabled={loading}
                  className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
                
                <button
                  onClick={resetFlow}
                  className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back
                </button>
              </div>
            </div>
          )}
          
          <div id="recaptcha-container" className="mt-4"></div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {message && (
            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
              {message}
            </div>
          )}
          
          <div className="mt-4 text-xs text-gray-500">
            <p>Note: Make sure phone authentication is enabled in Firebase Console</p>
            <p>Test phone numbers can be added in Firebase Authentication settings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneLogin;