import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getGuardById } from '@/services/guardAuth';
import { checkGuardStatus } from '@/services/guardAuth';
import { Guard } from '@/types/guard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

const GuardAuth: React.FC = () => {
  const [guardId, setGuardId] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'id' | 'otp'>('id');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [guardRecord, setGuardRecord] = useState<Guard | null>(null);
  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null);
  const confirmationResult = useRef<ConfirmationResult | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (recaptchaVerifier.current) {
        recaptchaVerifier.current.clear();
      }
    };
  }, []);

  const initRecaptcha = async () => {
    if (!recaptchaVerifier.current) {
      recaptchaVerifier.current = new RecaptchaVerifier(auth, 'guard-recaptcha', {
        size: 'invisible'
      });
    }
    await recaptchaVerifier.current.render();
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const guard = await getGuardById(guardId);
      if (!guard) {
        setError('Guard ID not found. Please check and try again.');
        setLoading(false);
        return;
      }

      if (!guard.phone) {
        setError('Guard phone number is missing. Contact an administrator.');
        setLoading(false);
        return;
      }

      if (guard.status !== 'active') {
        setError('Your account is inactive. Please contact support.');
        setLoading(false);
        return;
      }

      await initRecaptcha();
      confirmationResult.current = await signInWithPhoneNumber(auth, guard.phone, recaptchaVerifier.current!);
      setGuardRecord(guard);
      setStep('otp');
      setSuccess('OTP sent to your registered phone.');
    } catch (err: any) {
      console.error('Error sending guard OTP:', err);
      setError(err.message || 'Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!confirmationResult.current) {
        setError('Please request an OTP first.');
        setLoading(false);
        return;
      }

      const result = await confirmationResult.current.confirm(otp);
      if (guardRecord && guardRecord.uid !== result.user.uid) {
        await auth.signOut();
        setError('Guard verification failed. Please contact an administrator.');
        setLoading(false);
        return;
      }

      const status = await checkGuardStatus(result.user.uid);
      if (!status.isGuard) {
        await auth.signOut();
        setError('Account is not authorized as a guard.');
        setLoading(false);
        return;
      }

      navigate('/guard');
    } catch (err: any) {
      console.error('Error verifying guard OTP:', err);
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle>Guard Login</CardTitle>
          <CardDescription>Use your Guard ID and OTP to access the gate console.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Access denied</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert>
              <AlertTitle>OTP sent</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {step === 'id' ? (
            <form className="space-y-5" onSubmit={handleSendOtp}>
              <div className="space-y-2">
                <Label htmlFor="guard-id">Guard ID</Label>
                <Input
                  id="guard-id"
                  value={guardId}
                  onChange={(e) => setGuardId(e.target.value.toUpperCase())}
                  placeholder="GUARD-XXXX-XXXXX"
                  className={cn(error && 'border-destructive focus-visible:ring-destructive')}
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleVerifyOtp}>
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit code"
                  maxLength={6}
                  className={cn('text-center tracking-[0.4em] font-mono', error && 'border-destructive focus-visible:ring-destructive')}
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setStep('id');
                    setOtp('');
                    setError(null);
                    setSuccess(null);
                  }}
                >
                  Use a different Guard ID
                </Button>
              </div>
            </form>
          )}

          <div id="guard-recaptcha" />
        </CardContent>
      </Card>
    </div>
  );
};

export default GuardAuth;
