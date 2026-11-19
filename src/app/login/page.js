import LoginForm from '@/components/auth/LoginForm';

const MESSAGES = {
  forbidden: 'This account does not have admin access.',
  expired: 'Your session has expired. Please sign in again.',
  reauth: 'Your account details changed. Please sign in again.',
};

export default async function LoginPage({ searchParams }) {
  const { error } = await searchParams;
  return <LoginForm initialError={MESSAGES[error] ?? null} />;
}
