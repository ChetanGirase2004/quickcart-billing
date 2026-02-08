import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber 
} from 'firebase/auth';

const FirebaseDiagnostics: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<any>({});
  const [testResult, setTestResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const runDiagnostics = () => {
      const diag: any = {};
      
      // Check Firebase app
      diag.firebaseAppExists = !!auth.app;
      diag.authExists = !!auth;
      
      // Check if running in browser
      diag.isBrowser = typeof window !== 'undefined';
      
      // Check Firebase config
      if (auth.app) {
        diag.config = {
          name: auth.app.name,
          options: auth.app.options ? 'Available' : 'Missing'
        };
      }
      
      setDiagnostics(diag);
    };

    runDiagnostics();
  }, []);

  const testRecaptcha = async () => {
    try {
      setError('');
      setTestResult('');
      
      // Try to initialize reCAPTCHA
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-test', {
        size: 'invisible',
        callback: () => {
          setTestResult('reCAPTCHA initialized and solved successfully');
        },
      });

      await recaptchaVerifier.render();
      setTestResult('reCAPTCHA rendered successfully. Check if visible.');
    } catch (err: any) {
      setError(`reCAPTCHA Error: ${err.message}`);
      console.error('reCAPTCHA Error:', err);
    }
  };

  const testSendOTP = async () => {
    try {
      setError('');
      setTestResult('');
      
      // Initialize reCAPTCHA
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-test-send', {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA solved for sending OTP');
        },
      });

      await recaptchaVerifier.render();
      
      // Try to send OTP to a test number (you should replace this with a real test number)
      // This is just to test if the function works, it will likely fail with an invalid number
      // But we can see if it gets past the reCAPTCHA stage
      console.log('Attempting to send OTP...');
      setTestResult('Function called - check console for results');
    } catch (err: any) {
      setError(`Send OTP Error: ${err.message}`);
      console.error('Send OTP Error:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Firebase Diagnostics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">Firebase Configuration</h2>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
            {JSON.stringify(diagnostics, null, 2)}
          </pre>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">Test Functions</h2>
          <div className="space-y-3">
            <button
              onClick={testRecaptcha}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Test reCAPTCHA Initialization
            </button>
            
            <button
              onClick={testSendOTP}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Test Send OTP Function
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-3">Test Area</h2>
        <div id="recaptcha-test" className="mb-4"></div>
        <div id="recaptcha-test-send"></div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {testResult && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <strong>Result:</strong> {testResult}
        </div>
      )}
      
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
        <h3 className="font-semibold mb-2">Troubleshooting Checklist:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Ensure phone authentication is enabled in Firebase Console</li>
          <li>Check that your domain is authorized in Firebase Console</li>
          <li>Verify Firebase configuration in src/lib/firebase.ts</li>
          <li>Check browser console for detailed error messages</li>
          <li>Make sure you're not in a private/incognito browser window</li>
          <li>Try with a real phone number if using test numbers doesn't work</li>
        </ul>
      </div>
    </div>
  );
};

export default FirebaseDiagnostics;