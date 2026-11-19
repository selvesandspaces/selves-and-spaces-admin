import SettingsPageHeader from '@/components/settings/SettingsPageHeader';
import PasswordForm from '@/components/settings/PasswordForm';

export default function PasswordSettingsPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <SettingsPageHeader title="Password" description="Change the password you sign in with." />
      <PasswordForm />
    </div>
  );
}
