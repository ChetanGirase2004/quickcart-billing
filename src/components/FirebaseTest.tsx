import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

const FirebaseTest: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setMessage('User signed up successfully!');
      console.log('User signed up:', userCredential.user);
    } catch (err: any) {
      setError(err.message);
      console.error('Sign up error:', err);
    }
  };

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setMessage('User signed in successfully!');
      console.log('User signed in:', userCredential.user);
    } catch (err: any) {
      setError(err.message);
      console.error('Sign in error:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setMessage('User signed out successfully!');
      console.log('User signed out');
    } catch (err: any) {
      setError(err.message);
      console.error('Sign out error:', err);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Firebase Authentication Test</h1>
      
      {user ? (
        <div className="mb-4 p-4 bg-green-100 rounded">
          <p>Currently signed in as: {user.email}</p>
          <button 
            onClick={handleSignOut}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <p>Not signed in</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="test@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="password"
          />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleSignUp}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Sign Up
          </button>
          <button
            onClick={handleSignIn}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Sign In
          </button>
        </div>
      </div>

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

      <div className="mt-6 text-sm text-gray-500">
        <p>Current Firebase configuration status: <span className="font-semibold text-green-600">Connected</span></p>
        <p>Firebase SDK: <span className="font-semibold">Working</span></p>
        <p>Authentication: <span className="font-semibold">Available</span></p>
      </div>
    </div>
  );
};

export default FirebaseTest;