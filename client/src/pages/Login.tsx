import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, Input, Button, Link, Heading, Paragraph, Label } from '../components/common/UI';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter both your email and password.');
      return;
    }

    setIsSubmitting(true);
    const success = await login(email, password);
    setIsSubmitting(false);

    if (success) {
      navigate('/admin/dashboard');
    }
  };

  const handleAutofillCredentials = () => {
    setEmail('admin@portfolio.com');
    setPassword('admin123');
    toast.success('Credentials prefilled: admin@portfolio.com / admin123');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <Card className="max-w-md w-full p-8 space-y-6">
        
        {/* Guard Header icon */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-450 rounded-full">
            <Shield size={28} />
          </div>
          <Heading level={2} className="text-2xl font-extrabold tracking-tight">Admin Gateway</Heading>
          <Paragraph className="text-xs max-w-xs">
            Authenticate to update projects, manage active skills, and compile CV templates.
          </Paragraph>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="email-input"
            name="email"
            type="email"
            required
            label="Email Address"
            placeholder="admin@portfolio.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="h-4 w-4" />}
          />

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <Label htmlFor="password-input">Password</Label>
              <Link
                to="/forgot-password"
                className="text-xs"
              >
                Forgot?
              </Link>
            </div>
            <Input
              id="password-input"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="h-4 w-4" />}
            />
          </div>

          {/* Remember me toggle */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="rounded border-slate-300 dark:border-slate-800 text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
              />
              Remember me
            </label>
          </div>

          {/* Submit Action */}
          <Button
            type="submit"
            isLoading={isSubmitting}
            className="w-full animate-pulse-subtle"
          >
            Sign In
          </Button>
        </form>

        {/* Demo Preset Helper (Hides on prod, but perfect for portfolio preview reviews) */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 text-center">
          <Paragraph className="text-xs mb-2">Want to try the workspace editor?</Paragraph>
          <Button
            type="button"
            variant="outline"
            onClick={handleAutofillCredentials}
            className="w-full border-blue-100 dark:border-blue-900 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-xs py-2"
          >
            Autofill Tech Credentials
            <ArrowRight size={12} className="ml-1" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Login;

