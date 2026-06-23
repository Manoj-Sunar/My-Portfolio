import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, ArrowLeft, KeyRound, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, Input, Button, Link, Heading, Paragraph, Label } from '../components/common/UI';

type RecoveryStep = 'EMAIL' | 'OTP' | 'RESET' | 'SUCCESS';

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<RecoveryStep>('EMAIL');
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [resetToken, setResetToken] = useState<string>('');
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  const { forgotPassword, verifyOTP, resetPassword } = useAuth();
  const navigate = useNavigate();

  // Cooldown timer for OTP Resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Handle Step 1: Submit email to request OTP
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please specify the administrator email address.');
      return;
    }

    setIsSubmitting(true);
    const result = await forgotPassword(email);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Security OTP dispatched successfully.');
      setStep('OTP');
      setResendCooldown(60); // 60 seconds resend cooldown
    } else {
      toast.error(result.message);
    }
  };

  // Handle Resending OTP
  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    setIsSubmitting(true);
    const result = await forgotPassword(email);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('New OTP code generated and dispatched!');
      setResendCooldown(60);
    } else {
      toast.error(result.message);
    }
  };

  // Handle Step 2: Validate 6-digit OTP
  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 6) {
      toast.error('Please enter a valid 6-digit numeric OTP code.');
      return;
    }

    setIsSubmitting(true);
    const result = await verifyOTP(email, otp.trim());
    setIsSubmitting(false);

    if (result.success && result.token) {
      setResetToken(result.token);
      toast.success('OTP code verified. Identity confirmed.');
      setStep('RESET');
    } else {
      toast.error(result.message || 'Verification failed.');
    }
  };

  // Handle Step 3: Set and confirm new admin password
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error('All password fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match. Please verify.');
      return;
    }

    if (password.length < 6 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      toast.error('Password must be at least 6 characters and contain both letters and numbers.');
      return;
    }

    setIsSubmitting(true);
    const result = await resetPassword(resetToken, password);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Administrative password updated successfully.');
      setStep('SUCCESS');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950">
      <Card className="max-w-md w-full p-8 space-y-6">
        
        {/* Back navigation */}
        {step !== 'SUCCESS' && (
          <button
            onClick={() => {
              if (step === 'OTP') setStep('EMAIL');
              else if (step === 'RESET') setStep('OTP');
              else navigate('/login');
            }}
            className="inline-flex items-center text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
          >
            <ArrowLeft size={14} className="mr-1.5" />
            {step === 'EMAIL' ? 'Back to Login Gate' : 'Back to previous step'}
          </button>
        )}

        {/* STEP 1: Email Form */}
        {step === 'EMAIL' && (
          <div className="space-y-4">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 bg-blue-50 dark:bg-blue-955/45 text-blue-600 dark:text-blue-400 rounded-full">
                <KeyRound size={24} />
              </div>
              <Heading level={2} className="text-2xl font-extrabold tracking-tight">Recovery Dispatch</Heading>
              <Paragraph className="text-xs max-w-xs leading-relaxed">
                Provide your administrator email and we will send a 6-digit numeric verification OTP instantly.
              </Paragraph>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-4 pt-2">
              <Input
                id="forgot-email"
                type="email"
                required
                label="Admin Email Address"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="h-4 w-4" />}
              />

              <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full"
              >
                Send Verification OTP
              </Button>
            </form>
          </div>
        )}

        {/* STEP 2: Verify 6-digit OTP */}
        {step === 'OTP' && (
          <div className="space-y-4">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 bg-blue-50 dark:bg-blue-955/40 text-blue-600 dark:text-blue-450 rounded-full">
                <ShieldCheck size={24} />
              </div>
              <Heading level={2} className="text-2xl font-extrabold tracking-tight">Identity Authentication</Heading>
              <Paragraph className="text-xs max-w-sm leading-relaxed">
                We sent a 6-digit Secure OTP code to <strong className="text-slate-800 dark:text-slate-200">{email}</strong>. 
                Enter the code below. If you don't receive it, check the backend server logs.
              </Paragraph>
            </div>

            <form onSubmit={handleOTPSubmit} className="space-y-4 pt-2">
              <Input
                id="otp-code"
                type="text"
                maxLength={6}
                required
                label="6-Digit OTP Verification Code"
                className="text-center text-2xl tracking-[0.5em] font-extrabold"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              />

              <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full"
              >
                Verify Authentication OTP
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  disabled={resendCooldown > 0 || isSubmitting}
                  onClick={handleResendOTP}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:no-underline transition bg-transparent border-none p-0 cursor-pointer"
                >
                  {resendCooldown > 0 ? `Resend new code in ${resendCooldown}s` : 'Resend Verification Code'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: Reset Password */}
        {step === 'RESET' && (
          <div className="space-y-4">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-full">
                <Lock size={24} />
              </div>
              <Heading level={2} className="text-2xl font-extrabold tracking-tight">Choose New Password</Heading>
              <Paragraph className="text-xs max-w-xs leading-relaxed">
                Your authorization session is verified! Please enter a new strong administrative password now.
              </Paragraph>
            </div>

            <form onSubmit={handleResetSubmit} className="space-y-4 pt-2">
              <Input
                id="new-password"
                type="password"
                required
                label="New Password"
                placeholder="Min 6 chars, letters & numbers"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="h-4 w-4" />}
              />

              <Input
                id="confirm-password"
                type="password"
                required
                label="Confirm Password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<Lock className="h-4 w-4" />}
              />

              <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full"
              >
                Apply New Password
              </Button>
            </form>
          </div>
        )}

        {/* STEP 4: Success Screen */}
        {step === 'SUCCESS' && (
          <div className="text-center space-y-4">
            <div className="mx-auto p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-full w-12 h-12 flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div className="space-y-2">
              <Heading level={2} className="text-2xl font-extrabold tracking-tight">Security Credentials Updated</Heading>
              <Paragraph className="text-xs leading-relaxed max-w-sm mx-auto">
                Your primary administrative account password has been successfully reset. Dual verification is completed.
              </Paragraph>
            </div>
            <div className="pt-2">
              <Link
                to="/login"
                className="w-full inline-flex justify-center py-3 px-4 text-xs font-bold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 rounded-lg shadow-sm transition"
              >
                Go to Administrative Login
              </Link>
            </div>
          </div>
        )}

      </Card>
    </div>
  );
};

export default ForgotPassword;
