import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import ImageUpload from '../../components/common/ImageUpload';
import { Settings, Lock } from 'lucide-react';
import { Card, Input, Button, Heading, Paragraph, Label } from '../../components/common/UI';
import toast from 'react-hot-toast';

const SettingsPage: React.FC = () => {
  const { user, updateProfile, changePassword } = useAuth();

  // Profile states
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [profileImage, setProfileImage] = useState<{ url: string; publicId: string } | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);

  // Security states
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isChangingPwd, setIsChangingPwd] = useState<boolean>(false);

  // Sync profile details
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setProfileImage(user.profileImage || null);
    }
  }, [user]);

  const handleProfileSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email) {
      toast.error('Name and Email are required.');
      return;
    }

    setIsSavingProfile(true);
    await updateProfile({
      name,
      email,
      profileImage: profileImage || { url: '', publicId: '' },
    });
    setIsSavingProfile(false);
  }, [name, email, profileImage, updateProfile]);

  const handlePasswordSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('Please complete all password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Your new passwords do not match.');
      return;
    }

    if (newPassword.length < 6 || !/\d/.test(newPassword) || !/[a-zA-Z]/.test(newPassword)) {
      toast.error('The new password must be at least 6 characters and contain both letters and numbers.');
      return;
    }

    setIsChangingPwd(true);
    const result = await changePassword(oldPassword, newPassword);
    setIsChangingPwd(false);

    if (result.success) {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Your administrative password has been modified successfully.');
    } else {
      toast.error(result.message);
    }
  }, [oldPassword, newPassword, confirmPassword, changePassword]);

  return (
    <div className="space-y-10 text-xs text-left animate-fade-in">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <Heading level={1} className="text-slate-900 tracking-tight leading-tight">
          Account Settings
        </Heading>
        <Paragraph className="text-xs text-slate-500 font-semibold uppercase tracking-widest text-blue-600 leading-relaxed bg-transparent mt-1">
          Modify administrator user traits, reset master password, and update profile photo
        </Paragraph>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Admin profile */}
        <Card className="lg:col-span-6">
          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <Heading level={4} className="text-base font-bold text-slate-900 flex items-center mb-1 border-b border-slate-100 dark:border-slate-850 pb-3">
              <Settings size={18} className="text-blue-600 mr-2" />
              <span>Admin Profile Credentials</span>
            </Heading>

            <Input
              id="settings-name"
              type="text"
              required
              label="Full Name"
              placeholder="Sarah Dev"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              id="settings-email"
              type="email"
              required
              label="Administrator Email"
              placeholder="admin@portfolio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Profile Photo Upload */}
            <div className="space-y-1.55">
              <Label className="mb-1 block">Admin Profile Image</Label>
              <ImageUpload
                value={profileImage || undefined}
                onChange={(val) => setProfileImage(val)}
                folder="admin"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
              <Button
                type="submit"
                isLoading={isSavingProfile}
                className="px-5 py-2"
              >
                Save Profile updates
              </Button>
            </div>
          </form>
        </Card>

        {/* Right column: Password update */}
        <Card className="lg:col-span-6">
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <Heading level={4} className="text-base font-bold text-slate-900 flex items-center mb-1 border-b border-slate-100 dark:border-slate-850 pb-3">
              <Lock size={18} className="text-blue-600 mr-2" />
              <span>Change Admin Password</span>
            </Heading>

            <Input
              id="pwd-old"
              type="password"
              required
              label="Current Password"
              placeholder="••••••••"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />

            <Input
              id="pwd-new"
              type="password"
              required
              label="New Password"
              placeholder="Min 6 characters, text & numbers"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <Input
              id="pwd-confirm"
              type="password"
              required
              label="Confirm New Password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
              <Button
                type="submit"
                isLoading={isChangingPwd}
                className="px-5 py-2"
              >
                Change Password
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
