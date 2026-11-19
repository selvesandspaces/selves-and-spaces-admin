import { getSession } from '@/lib/session';
import SettingsPageHeader from '@/components/settings/SettingsPageHeader';
import EmailForm from '@/components/settings/EmailForm';

export default async function EmailSettingsPage() {
  const user = await getSession();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <SettingsPageHeader title="Email" description="The address you sign in with." />
      <EmailForm currentEmail={user?.email ?? ''} />
    </div>
  );
}
