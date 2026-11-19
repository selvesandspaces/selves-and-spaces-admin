import { getSession } from '@/lib/session';
import { getUsers, USERS_PER_PAGE } from '@/lib/services/userService';
import SettingsPageHeader from '@/components/settings/SettingsPageHeader';
import UsersTable from '@/components/settings/UsersTable';

const ROLES = ['customer', 'super_admin'];

export default async function UsersSettingsPage({ searchParams }) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page, 10) || 1);
  const role = ROLES.includes(params.role) ? params.role : '';

  const [session, users] = await Promise.all([getSession(), getUsers({ page, role: role || undefined })]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <SettingsPageHeader title="Users" description="Everyone with an account. Deactivated users can't sign in." />
      <UsersTable
        users={users}
        currentUserId={session?.id}
        page={page}
        role={role}
        hasNext={users.length === USERS_PER_PAGE}
      />
    </div>
  );
}
