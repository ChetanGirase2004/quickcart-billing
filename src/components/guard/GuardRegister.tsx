import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerGuardWithEmail, registerGuardWithPhone } from '@/services/guardAuth';
import { GuardRegistrationData } from '@/types/guard';

const GuardRegister: React.FC = () => {
  const [registrationMethod, setRegistrationMethod] = useState<'email' | 'phone'>('email');
  const [formData, setFormData] = useState<GuardRegistrationData>({
    name: '',
    email: '',
    phone: ''
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const result = await registerGuardWithEmail(
        { ...formData, name: formData.name },
        password
      );

      if (result.success) {
        setSuccess('Guard registered successfully! Redirecting to login...');
        // Clear form
        setFormData({
          name: '',
          email: '',
          phone: ''
        });
        setPassword('');
        setConfirmPassword('');
        // Redirect to auth page after 2 seconds
        setTimeout(() => {
          navigate('/guard/auth');
        }, 2000);
      } else {
        setError(result.error || 'Failed to register guard');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await registerGuardWithPhone({ ...formData, name: formData.name });

      if (result.success) {
        setSuccess('Phone verification initiated! Please check your phone for OTP.');
        // In a real implementation, you would proceed to OTP verification
        // For now, we'll just show a success message
        setTimeout(() => {
          navigate('/guard/auth');
        }, 2000);
      } else {
        setError(result.error || 'Failed to initiate phone registration');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Register as Guard
          </h2>
        </div>
        
        {/* Registration Method Selector */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setRegistrationMethod('email')}
            className={`px-4 py-2 rounded-md ${
              registrationMethod === 'email'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Email Registration
          </button>
          <button
            onClick={() => setRegistrationMethod('phone')}
            className={`px-4 py-2 rounded-md ${
              registrationMethod === 'phone'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Phone Registration
          </button>
        </div>

        {registrationMethod === 'email' ? (
          <form className="mt-8 space-y-6" onSubmit={handleEmailSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Full Name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm Password"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            {success && (
              <div className="text-green-500 text-sm text-center">
                {success}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Registering...' : 'Register Guard'}
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handlePhoneSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="phone-name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="phone-name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Full Name"
                />
              </div>
              
              <div>
                <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  id="phone-number"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Phone Number (with country code)"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            {success && (
              <div className="text-green-500 text-sm text-center">
                {success}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Initiating Registration...' : 'Register with Phone'}
              </button>
            </div>
          </form>
        )}
        
        <div className="text-center">
          <button
            onClick={() => navigate('/guard/auth')}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Back to Guard Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuardRegister;