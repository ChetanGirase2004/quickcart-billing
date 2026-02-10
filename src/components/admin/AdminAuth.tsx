import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hasRegisteredAdmin, loginAdmin, registerAdmin } from '@/services/adminAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface SignInForm {
  email: string;
  password: string;
}

interface RegisterForm {
  mallName: string;
  adminName: string;
  email: string;
  phone: string;
  password: string;
}

const AdminAuth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [isRegisterMode, setIsRegisterMode] = useState(() => !hasRegisteredAdmin());

  const [signInForm, setSignInForm] = useState<SignInForm>({
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    mallName: '',
    adminName: '',
    email: '',
    phone: '',
    password: ''
  });

  const hasAdminAccount = hasRegisteredAdmin();

  const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await loginAdmin(signInForm.email, signInForm.password);

      if (result.success && result.isAdmin) {
        navigate('/admin');
      } else {
        setError(result.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await registerAdmin(registerForm);
      if (result.success) {
        navigate('/admin');
      } else {
        setError(result.error || 'Failed to register admin account.');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle>{isRegisterMode ? 'Admin Registration' : 'Admin Login'}</CardTitle>
          <CardDescription>
            {isRegisterMode
              ? 'Create your QuickCart admin account to start managing the mall console.'
              : 'Use your QuickCart admin credentials to sign in.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>{isRegisterMode ? 'Registration failed' : 'Sign-in failed'}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isRegisterMode ? (
            <form className="space-y-5" onSubmit={handleRegisterSubmit}>
              <div className="space-y-2">
                <Label htmlFor="mallName">Mall Name</Label>
                <Input id="mallName" name="mallName" required value={registerForm.mallName} onChange={handleRegisterChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminName">Admin Name</Label>
                <Input id="adminName" name="adminName" required value={registerForm.adminName} onChange={handleRegisterChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registerEmail">Email Address</Label>
                <Input id="registerEmail" name="email" type="email" required value={registerForm.email} onChange={handleRegisterChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" required value={registerForm.phone} onChange={handleRegisterChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registerPassword">Password</Label>
                <Input id="registerPassword" name="password" type="password" autoComplete="new-password" required value={registerForm.password} onChange={handleRegisterChange} />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Registering...' : 'Register & Continue'}
              </Button>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleSignInSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={signInForm.email}
                  onChange={handleSignInChange}
                  className={cn(error && 'border-destructive focus-visible:ring-destructive')}
                  placeholder="admin@quickcart.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={signInForm.password}
                  onChange={handleSignInChange}
                  className={cn(error && 'border-destructive focus-visible:ring-destructive')}
                  placeholder="Enter your password"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          )}

          {hasAdminAccount && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setError(null);
                setIsRegisterMode((prev) => !prev);
              }}
              className="w-full"
            >
              {isRegisterMode ? 'Already registered? Sign In' : 'Need to re-register admin?'}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuth;
