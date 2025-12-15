import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { logout } from '@/app/actions';

export default async function WelcomePage() {
  const sessionCookie = cookies().get('line-session');

  if (!sessionCookie) {
    redirect('/');
  }

  const userId = sessionCookie.value;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md animate-in fade-in-50 zoom-in-95 duration-500">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">Welcome!</CardTitle>
          <CardDescription>You have successfully logged in.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">Your Line User ID is:</p>
          <p className="break-all font-mono text-lg font-semibold text-primary">
            {userId}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <form action={logout}>
            <Button type="submit" variant="outline">
              Logout
            </Button>
          </form>
        </CardFooter>
      </Card>
    </main>
  );
}
