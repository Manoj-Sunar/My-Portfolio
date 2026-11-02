"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";
import { useForgotPassword, useLogin, useResetPassword, useVerifyOTP } from "@/hook/useAuth";

// 1. Import the Provider
import { QueryProvider } from "@/providers/query-provider"; 

export const dynamic = "force-dynamic";

const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password required"),
});
type LoginForm = z.infer<typeof loginSchema>;

// 2. Rename the default export to a wrapper
export default function AdminLoginPageWrapper() {
  return (
    <QueryProvider>
      <AdminLoginPage />
    </QueryProvider>
  );
}

// 3. Your original component goes here (no changes needed inside)
function AdminLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "forgot" | "otp" | "reset">("login");
  const [resetToken, setResetToken] = useState("");
  const [email, setEmail] = useState("");

  const login = useLogin();
  const forgot = useForgotPassword();
  const verify = useVerifyOTP();
  const reset = useResetPassword();

  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onLogin = (d: LoginForm) => {
    login.mutate(d, {
      onSuccess: () => {
        toast.success("Welcome back!");
        router.push("/admin");
      },
      onError: (e) => toast.error(e.message),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" />
      </div>

      <Card className="w-full max-w-md glass border-border/40">
        <CardHeader className="text-center">
          <Link href="/" className="font-display text-2xl font-bold gradient-text block mb-2">
            MANOJ<span className="text-foreground">.</span>admin
          </Link>
          <CardTitle>Admin Access</CardTitle>
          <CardDescription>Sign in to manage your portfolio content</CardDescription>
        </CardHeader>
        <CardContent>
          {mode === "login" && (
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <div>
                <Input placeholder="Email" type="email" {...loginForm.register("email")} />
                {loginForm.formState.errors.email && (
                  <p className="text-xs text-destructive mt-1">{loginForm.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <Input placeholder="Password" type="password" {...loginForm.register("password")} />
                {loginForm.formState.errors.password && (
                  <p className="text-xs text-destructive mt-1">{loginForm.formState.errors.password.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={login.isPending}>
                {login.isPending ? "Signing in..." : "Sign In"}
              </Button>
              <button
                type="button"
                onClick={() => setMode("forgot")}
                className="text-xs text-primary hover:underline w-full text-center"
              >
                Forgot password?
              </button>
            </form>
          )}

          {mode === "forgot" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const em = String(fd.get("email"));
                setEmail(em);
                forgot.mutate(em, {
                  onSuccess: (d) => { toast.success(d.message); setMode("otp"); },
                  onError: (e) => toast.error(e.message),
                });
              }}
              className="space-y-4"
            >
              <Input name="email" placeholder="Your email" type="email" required />
              <Button type="submit" className="w-full" disabled={forgot.isPending}>
                {forgot.isPending ? "Sending..." : "Send OTP"}
              </Button>
              <button type="button" onClick={() => setMode("login")} className="text-xs text-primary hover:underline w-full text-center">
                Back to login
              </button>
            </form>
          )}

          {mode === "otp" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const otp = String(fd.get("otp"));
                verify.mutate({ email, otp }, {
                  onSuccess: (d) => { setResetToken(d.token); toast.success("Verified!"); setMode("reset"); },
                  onError: (e) => toast.error(e.message),
                });
              }}
              className="space-y-4"
            >
              <p className="text-sm text-muted-foreground">Enter the 6-digit code sent to <strong>{email}</strong></p>
              <Input name="otp" placeholder="000000" maxLength={6} required className="text-center text-2xl tracking-widest" />
              <Button type="submit" className="w-full" disabled={verify.isPending}>
                {verify.isPending ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>
          )}

          {mode === "reset" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const password = String(fd.get("password"));
                reset.mutate({ token: resetToken, password }, {
                  onSuccess: () => { toast.success("Password reset! Please log in."); setMode("login"); },
                  onError: (e) => toast.error(e.message),
                });
              }}
              className="space-y-4"
            >
              <Input name="password" type="password" placeholder="New password" required minLength={6} />
              <Button type="submit" className="w-full" disabled={reset.isPending}>
                {reset.isPending ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}