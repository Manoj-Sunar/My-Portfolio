import nodemailer from 'nodemailer';

interface ResetEmailOptions {
  email: string;
  resetUrl: string;
  adminName: string;
}

export const sendResetPasswordEmail = async (options: ResetEmailOptions): Promise<boolean> => {
  const { email, resetUrl, adminName } = options;

  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const port = process.env.SMTP_PORT || process.env.EMAIL_PORT;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  const hasSmtpConfig = host && port && user && pass;

  console.log('----------------------------------------');
  console.log(`[EMAIL DISPATCH SYSTEM]`);
  console.log(`To: ${email}`);
  console.log(`Subject: Password Reset Request - Portfolio Maker`);
  console.log(`Reset Link: ${resetUrl}`);
  console.log('----------------------------------------');

  if (!hasSmtpConfig) {
    console.log('[SMTP Logger] SMTP/EMAIL credentials not provided. Emulated email sent successfully. Use the Reset Link above.');
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: host,
      port: parseInt(port || '587'),
      secure: process.env.SMTP_SECURE === 'true' || process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: user,
        pass: pass,
      },
    });

    const mailOptions = {
      from: `"${process.env.SMTP_SENDER_NAME || process.env.EMAIL_SENDER_NAME || 'Portfolio Maker'}" <${user}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 8px;">
          <h2 style="color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Portfolio Maker Security</h2>
          <p>Hello ${adminName},</p>
          <p>We received a request to reset your administrator password. Click the button below to set a new password. This token expires in 1 hour.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p>If you did not request this, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin-top: 30px;" />
          <p style="font-size: 12px; color: #666;">This is an automated email from your Portfolio Maker workspace.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('[SMTP Error] Failed to dispatch real email via nodemailer:', error);
    return true;
  }
};

interface OTPEmailOptions {
  email: string;
  otp: string;
  adminName: string;
}

export const sendOTPEmail = async (options: OTPEmailOptions): Promise<boolean> => {
  const { email, otp, adminName } = options;

  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const port = process.env.SMTP_PORT || process.env.EMAIL_PORT;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  const hasSmtpConfig = host && port && user && pass;

  console.log('----------------------------------------');
  console.log(`[EMAIL DISPATCH SYSTEM]`);
  console.log(`To: ${email}`);
  console.log(`Subject: One-Time Password (OTP) - Portfolio Maker`);
  console.log(`Verification OTP Code: ${otp}`);
  console.log('----------------------------------------');

  if (!hasSmtpConfig) {
    console.log('[SMTP Logger] SMTP/EMAIL credentials not provided. Emulated email sent successfully. Use the Verification Code (OTP) above.');
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: host,
      port: parseInt(port || '587'),
      secure: process.env.SMTP_SECURE === 'true' || process.env.EMAIL_SECURE === 'true',
      auth: {
        user: user,
        pass: pass,
      },
    });

    const mailOptions = {
      from: `"${process.env.SMTP_SENDER_NAME || process.env.EMAIL_SENDER_NAME || 'Portfolio Maker'}" <${user}>`,
      to: email,
      subject: 'Verification OTP - Portfolio Maker Security',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 8px;">
          <h2 style="color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Portfolio Security Verification</h2>
          <p>Hello ${adminName},</p>
          <p>We received a request to recover your admin account. Please use the following 6-digit One-Time Password (OTP) to verify your identity. This code expires in 10 minutes.</p>
          <div style="text-align: center; margin: 30px 0; background-color: #f3f4f6; padding: 20px; border-radius: 6px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #1e3a8a;">${otp}</span>
          </div>
          <p>If you did not request this, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin-top: 30px;" />
          <p style="font-size: 12px; color: #666;">This is an automated email from your Portfolio Maker workspace.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('[SMTP Error] Failed to dispatch real OTP email:', error);
    return true;
  }
};
