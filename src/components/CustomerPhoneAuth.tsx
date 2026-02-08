import React, { useState, useRef, useEffect } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';

const CustomerPhoneAuth: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showOtpInput, setShowOtpInput] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  const recaptchaVerifier = useRef<any>(null);
  const confirmationResult = useRef<ConfirmationResult | null>(null);
  const navigate = useNavigate();

  // Initialize reCAPTCHA verifier
  useEffect(() => {
    const initRecaptcha = () => {
      try {
        if (!recaptchaVerifier.current) {
          recaptchaVerifier.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible',
            callback: () => {
              // reCAPTCHA solved
            },
            'expired-callback': () => {
              // Response expired. Ask user to solve reCAPTCHA again.
              setError('reCAPTCHA expired. Please try again.');
            }
          });
        }
      } catch (err: any) {
        console.error('Error initializing reCAPTCHA:', err);
        setError('Failed to initialize reCAPTCHA. Please refresh the page and try again.');
      }
    };

    initRecaptcha();

    return () => {
      if (recaptchaVerifier.current) {
        recaptchaVerifier.current.clear();
      }
    };
  }, []);

  const sendOtp = async () => {
    if (!phoneNumber) {
      setError('Please enter a phone number');
      return;
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    
    if (!phoneRegex.test(formattedPhoneNumber)) {
      setError('Please enter a valid phone number with country code (e.g., +1234567890)');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!recaptchaVerifier.current) {
        throw new Error('reCAPTCHA not initialized. Please refresh the page and try again.');
      }

      // Render reCAPTCHA widget
      await recaptchaVerifier.current.render();
      
      const result = await signInWithPhoneNumber(auth, formattedPhoneNumber, recaptchaVerifier.current);
      confirmationResult.current = result;
      
      setShowOtpInput(true);
      setSuccess('OTP sent successfully! Please check your phone.');
    } catch (err: any) {
      console.error('Error sending OTP:', err);
      setError(err.message || 'Failed to send OTP. Please check your phone number and try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    if (!confirmationResult.current) {
      setError('Please send OTP first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await confirmationResult.current.confirm(otp);
      console.log('User signed in successfully:', result.user);
      setSuccess('Authentication successful! Redirecting...');
      
      // Redirect to dashboard/home page
      setTimeout(() => {
        navigate('/customer');
      }, 1500);
    } catch (err: any) {
      console.error('Error verifying OTP:', err);
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Customer Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in with your phone number
          </p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          {!showOtpInput ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="phone-number"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter phone number with country code (e.g., +1234567890)"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md p-2 border"
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
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  Enter OTP
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="otp"
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md p-2 border"
                  />
                </div>
              </div>
              
              <button
                onClick={verifyOtp}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              
              <button
                onClick={() => {
                  setShowOtpInput(false);
                  setOtp('');
                }}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Phone Number
              </button>
            </div>
          )}
          
          <div id="recaptcha-container" className="mt-4"></div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
              {success}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerPhoneAuth;