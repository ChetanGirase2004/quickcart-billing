import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGuardById, loginGuard, generateUniqueGuardId, registerGuardWithEmail } from '@/services/guardAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

const GuardAuth: React.FC = () => {
  const [flow, setFlow] = useState<'prompt' | 'existing' | 'new'>('prompt');
  const [existingGuardId, setExistingGuardId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [registerForm, setRegisterForm] = useState({
    guardName: '',
    phone: '',
    email: ''
  });
  const [generatedGuardId, setGeneratedGuardId] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10;
  };

  const handleExistingSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

    const guardId = existingGuardId.trim().toUpperCase();
    if (!guardId) {
      setError('Guard ID is required.');
      setLoading(false);
      return;
    }

    try {
      const guard = await getGuardById(guardId);
      if (!guard) {
        setError('Guard ID not found. Please check and try again.');
        setLoading(false);
        return;
      }

      if (guard.status !== 'active') {
        setError('Guard account is inactive. Contact admin.');
        setLoading(false);
        return;
      }

      const result = await loginGuard(guard.guardId, '123456');
      if (!result.success) {
        setError(result.error || 'Unable to log in.');
        setLoading(false);
        return;
      }

      navigate('/guard');
    } catch (err: unknown) {
      console.error('Error in guard sign-in:', err);
      setError(err instanceof Error ? err.message : 'Sign in failed.');
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

    const name = registerForm.guardName.trim();
    const phone = registerForm.phone.trim();
    const email = registerForm.email.trim().toLowerCase();

    if (!name || !phone || !email) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    if (!validatePhone(phone)) {
      setError('Phone number must be 10 digits.');
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const response = await registerGuardWithEmail({ name, email, phone }, '');
      if (!response.success || !response.guardId) {
        setError(response.error || 'Guard registration failed.');
        setLoading(false);
        return;
      }

      setGeneratedGuardId(response.guardId);
      setInfo(`Registration successful. Your Guard ID is ${response.guardId}`);

      const loginResult = await loginGuard(response.guardId, '123456');
      if (!loginResult.success) {
        setError(loginResult.error || 'Could not sign in after registration.');
        setLoading(false);
        return;
      }

      navigate('/guard');
    } catch (err: unknown) {
      console.error('Error in guard registration:', err);
      setError(err instanceof Error ? err.message : 'Registration failed.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (flow !== 'new') return;

    let mounted = true;
    setError(null);
    setInfo(null);
    setGeneratedGuardId('');

    (async () => {
      setLoading(true);
      try {
        const guardId = await generateUniqueGuardId();
        if (mounted) {
          setGeneratedGuardId(guardId);
        }
      } catch (err: unknown) {
        console.error('Error generating Guard ID:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Unable to generate Guard ID.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [flow]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle>{flow === 'prompt' ? 'Guard Access' : flow === 'existing' ? 'Guard Sign In' : 'Guard Registration'}</CardTitle>
          <CardDescription>
            {flow === 'prompt'
              ? 'Are you an existing guard or a new user?'
              : flow === 'existing'
              ? 'Enter your Guard ID to sign in.'
              : 'Complete registration to get your Guard ID.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {info && (
            <Alert>
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{info}</AlertDescription>
            </Alert>
          )}

          {flow === 'prompt' ? (
            <div className="space-y-3">
              <Button className="w-full" onClick={() => setFlow('existing')}>
                Existing Guard
              </Button>
              <Button className="w-full" onClick={() => setFlow('new')}>
                New Guard
              </Button>
            </div>
          ) : flow === 'existing' ? (
            <form className="space-y-5" onSubmit={handleExistingSignIn}>
              <div className="space-y-2">
                <Label htmlFor="guard-id">Guard ID</Label>
                <Input
                  id="guard-id"
                  value={existingGuardId}
                  onChange={(e) => setExistingGuardId(e.target.value.toUpperCase())}
                  placeholder="GUARD1234"
                  className={cn(error && 'border-destructive focus-visible:ring-destructive')}
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
              <Button type="button" variant="outline" onClick={() => { setFlow('prompt'); setError(null); setInfo(null); }}>
                Back
              </Button>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleRegister}>
              <div className="space-y-2">
                <Label htmlFor="guard-name">Guard Name</Label>
                <Input
                  id="guard-name"
                  value={registerForm.guardName}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, guardName: e.target.value }))}
                  placeholder="Enter your name"
                  className={cn(error && 'border-destructive focus-visible:ring-destructive')}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guard-phone">Phone Number</Label>
                <Input
                  id="guard-phone"
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="10 digit phone number"
                  className={cn(error && 'border-destructive focus-visible:ring-destructive')}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guard-email">Email Address</Label>
                <Input
                  id="guard-email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, email: e.target.value }))}
                  type="email"
                  placeholder="guard@example.com"
                  className={cn(error && 'border-destructive focus-visible:ring-destructive')}
                  required
                />
              </div>
              {generatedGuardId && (
                <div className="space-y-2">
                  <Label htmlFor="generated-id">Your Guard ID</Label>
                  <Input id="generated-id" value={generatedGuardId} readOnly className="bg-secondary/10" />
                </div>
              )}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Registering...' : 'Register'}
              </Button>
              <Button type="button" variant="outline" onClick={() => { setFlow('prompt'); setError(null); setInfo(null); }}>
                Back
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GuardAuth;
