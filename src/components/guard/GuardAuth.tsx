import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkGuardStatus, getGuardById, loginGuard } from '@/services/guardAuth';
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
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const guard = await getGuardById(guardId);
      if (!guard) {
        setError('Guard ID not found. Please check and try again.');
        return;
      }

      if (!guard.phone) {
        setError('Guard phone number is missing. Contact an administrator.');
        return;
      }

      if (guard.status !== 'active') {
        setError('Your account is inactive. Please contact support.');
        return;
      }

      setGuardRecord(guard);
      setStep('otp');
      setSuccess('OTP sent to your registered phone. Use 123456 for demo mode.');
    } catch (err: unknown) {
      console.error('Error sending guard OTP:', err);
      setError(err instanceof Error ? err.message : 'Failed to send OTP. Try again.');
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
      if (!guardRecord) {
        setError('Please request an OTP first.');
        return;
      }

      const result = await loginGuard(guardRecord.guardId, otp);
      if (!result.success || !result.guardData) {
        setError(result.error || 'Invalid OTP. Please try again.');
        return;
      }

      const status = await checkGuardStatus(result.guardData.uid);
      if (!status.isGuard) {
        setError('Account is not authorized as a guard.');
        return;
      }

      navigate('/guard');
    } catch (err: unknown) {
      console.error('Error verifying guard OTP:', err);
      setError(err instanceof Error ? err.message : 'Invalid OTP. Please try again.');
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

          <div id="guard-recaptcha" className="hidden" />
        </CardContent>
      </Card>
    </div>
  );
};

export default GuardAuth;
