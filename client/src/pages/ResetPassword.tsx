import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, ShieldCheck, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, Input, Button, Link, Heading, Paragraph } from '../components/common/UI';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const { resetPassword } = useAuth();
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error('The security token is missing from your link.');
      return;
    }

    if (!password || !confirmPassword) {
      toast.error('Please enter and confirm your new password.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    // Password strength check
    if (password.length < 6 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      toast.error('Password must be at least 6 characters and contain both letters and numbers.');
      return;
    }

    setIsSubmitting(true);
    const result = await resetPassword(token, password);
    setIsSubmitting(false);

    if (result.success) {
      setIsCompleted(true);
      toast.success('Your administrative password has been reset successfully!');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950">
      <Card className="max-w-md w-full p-8 space-y-6">
        
        {isCompleted ? (
          // Success redirection block
          <div className="text-center space-y-4">
            <div className="mx-auto p-3 bg-emerald-50 dark:bg-emerald-955/30 text-emerald-600 dark:text-emerald-400 rounded-full w-12 h-12 flex items-center justify-center">
              <ShieldCheck size={22} />
            </div>
            <div className="space-y-2">
              <Heading level={2} className="text-xl font-extrabold tracking-tight">Access Restored</Heading>
              <Paragraph className="text-xs leading-relaxed max-w-sm mx-auto">
                Your new administrative login security credentials are now live. Try logging in.
              </Paragraph>
            </div>
            <div className="pt-2">
              <Link
                to="/login"
                className="w-full flex justify-center py-2.5 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-lg shadow-sm transition"
              >
                Go to Sign In
              </Link>
            </div>
          </div>
        ) : !token ? (
          // Error token missing block
          <div className="text-center space-y-4">
            <div className="mx-auto p-3 bg-red-50 dark:bg-red-955/30 text-red-600 dark:text-red-400 rounded-full w-12 h-12 flex items-center justify-center">
              <HelpCircle size={22} />
            </div>
            <div className="space-y-2 pt-2">
              <Heading level={2} className="text-xl font-extrabold tracking-tight">Invalid Recovery Link</Heading>
              <Paragraph className="text-xs max-w-sm mx-auto leading-relaxed">
                This reset token is either expired or missing from the URL. Please trigger a new request on the forget password form.
              </Paragraph>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/forgot-password"
                className="inline-flex justify-center px-4 py-2 bg-slate-900 dark:bg-slate-800 text-xs font-bold text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 transition"
              >
                Request New Token
              </Link>
            </div>
          </div>
        ) : (
          // Password reset form block
          <div className="space-y-4">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 bg-blue-50 dark:bg-blue-955/40 text-blue-600 dark:text-blue-400 rounded-full">
                <Lock size={24} />
              </div>
              <Heading level={2} className="text-2xl font-extrabold tracking-tight">Choose New Password</Heading>
              <Paragraph className="text-xs max-w-xs">
                Complete your security update by choosing a strong password with letters and numbers.
              </Paragraph>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <Input
                id="new-pwd"
                type="password"
                required
                label="New Password"
                placeholder="Min 6 characters, letters & numbers"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="h-4 w-4" />}
              />

              <Input
                id="confirm-pwd"
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
                Change Password
              </Button>
            </form>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ResetPassword;
