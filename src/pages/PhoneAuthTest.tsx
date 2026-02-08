import React, { useState, useEffect } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const PhoneAuthTest: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Initialize reCAPTCHA
    const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'normal',
      callback: (response: any) => {
        console.log('reCAPTCHA solved:', response);
      },
    });

    // Clean up on unmount
    return () => {
      recaptchaVerifier.clear();
    };
  }, []);

  const handleSendOTP = async () => {
    try {
      setError('');
      setMessage('');

      // Get the reCAPTCHA verifier
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'send-button', {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA solved');
        },
      });

      // Format phone number
      const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

      // Send OTP
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhoneNumber, recaptchaVerifier);
      console.log('OTP sent:', confirmationResult);
      setMessage('OTP sent successfully! Check your phone.');

      // Store confirmationResult for later use
      (window as any).confirmationResult = confirmationResult;
    } catch (err: any) {
      console.error('Error sending OTP:', err);
      setError(err.message || 'Failed to send OTP');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Phone Auth Test</h2>
        
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number with country code"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          id="send-button"
          onClick={handleSendOTP}
          className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Send OTP
        </button>

        <div id="recaptcha-container" className="mt-4"></div>

        {message && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneAuthTest;