import { getSession } from '@/lib/session';
import { getUser } from '@/lib/services/userService';
import SettingsPageHeader from '@/components/settings/SettingsPageHeader';
import ProfileForm from '@/components/settings/ProfileForm';

export default async function ProfileSettingsPage() {
  const session = await getSession();
  const profile = await getUser(session.id);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <SettingsPageHeader title="Profile" description="Your name, phone and address." />
      {/* key: restart the form's state if the saved profile changes underneath it */}
      <ProfileForm key={profile.name + profile.phone} profile={profile} />
    </div>
  );
}
