import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginCustomerSession } from '@/services/guardAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

const DEMO_OTP = '123456';

const CustomerPhoneAuth: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showOtpInput, setShowOtpInput] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const navigate = useNavigate();

  const sendOtp = async () => {
    if (!phoneNumber) {
      setError('Please enter a phone number');
      return;
    }

    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

    if (!phoneRegex.test(formattedPhoneNumber)) {
      setError('Please enter a valid phone number with country code (e.g., +1234567890)');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    setTimeout(() => {
      setShowOtpInput(true);
      setSuccess('OTP sent successfully! Use 123456 for demo login.');
      setLoading(false);
      setPhoneNumber(formattedPhoneNumber);
    }, 500);
  };

  const verifyOtp = async () => {
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (otp !== DEMO_OTP) {
        setError('Invalid OTP. Please use 123456 in demo mode.');
        return;
      }

      await loginCustomerSession(phoneNumber);
      setSuccess('Authentication successful! Redirecting...');

      setTimeout(() => {
        navigate('/customer');
      }, 1200);
    } catch (err: unknown) {
      console.error('Error verifying OTP:', err);
      setError(err instanceof Error ? err.message : 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const maskedPhone = phoneNumber.length > 4 ? `${phoneNumber.slice(0, 2)}••••${phoneNumber.slice(-2)}` : phoneNumber;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle>Customer Login</CardTitle>
          <CardDescription>Sign in with your phone number to continue.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!showOtpInput ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone-number">Phone Number</Label>
                <Input
                  id="phone-number"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number with country code (e.g., +1234567890)"
                  className={cn(error && 'border-destructive focus-visible:ring-destructive')}
                />
              </div>
              <Button onClick={sendOtp} disabled={loading} className="w-full">
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                We&apos;ve sent a 6-digit OTP to {maskedPhone || 'your phone'}.
              </div>
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className={cn('text-center tracking-[0.5em] font-mono', error && 'border-destructive focus-visible:ring-destructive')}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button onClick={verifyOtp} disabled={loading} className="w-full">
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowOtpInput(false);
                    setOtp('');
                    setError('');
                    setSuccess('');
                  }}
                  className="w-full"
                >
                  Back to Phone Number
                </Button>
              </div>
            </div>
          )}

          <div id="recaptcha-container" className="hidden" />

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Authentication error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerPhoneAuth;
