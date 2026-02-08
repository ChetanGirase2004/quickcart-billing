import React, { useState, useEffect } from 'react';
import { createFirebaseAuthHelpers } from '@/utils/firebaseAuthHelpers';

const ImprovedPhoneLogin: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  
  const authHelpers = createFirebaseAuthHelpers();

  // Initialize reCAPTCHA on component mount
  useEffect(() => {
    const initRecaptcha = async () => {
      try {
        await authHelpers.initializeRecaptcha('recaptcha-container');
      } catch (err: any) {
        setError(err.message || 'Failed to initialize reCAPTCHA');
      }
    };

    initRecaptcha();

    // Cleanup on unmount
    return () => {
      authHelpers.reset();
    };
  }, []);

  const sendOtp = async () => {
    if (!phoneNumber) {
      setError('Please enter a phone number');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      await authHelpers.sendOTP(phoneNumber);
      setStep('otp');
      setMessage('OTP sent successfully! Please check your phone.');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      await authHelpers.verifyOTP(otp);
      setMessage('Authentication successful! Redirecting...');
      
      // In a real app, you would redirect or update auth state here
      setTimeout(() => {
        alert('Authentication successful!');
        // Reset and go back to phone input
        authHelpers.reset();
        setStep('phone');
        setOtp('');
        setPhoneNumber('');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const resetFlow = () => {
    authHelpers.reset();
    setStep('phone');
    setOtp('');
    setPhoneNumber('');
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
            <p className="font-medium">Troubleshooting Tips:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Ensure phone authentication is enabled in Firebase Console</li>
              <li>Add test phone numbers in Firebase Authentication settings</li>
              <li>Check browser console for detailed error messages</li>
              <li>Make sure you're using a valid phone number format (+1234567890)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImprovedPhoneLogin;