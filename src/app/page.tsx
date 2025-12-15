import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LoginView } from '@/components/LoginView';

export default async function HomePage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const sessionCookie = await cookies().get('line-session');

  if (sessionCookie) {
    redirect('/welcome');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <LoginView error={searchParams.error} />
    </main>
  );
}
