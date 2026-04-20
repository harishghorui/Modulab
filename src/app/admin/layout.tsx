import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/AdminSidebar';
import dbConnect from '@/lib/db';
import Profile from '@/models/Profile';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  await dbConnect();
  const profile = await Profile.findOne({ userId: session.user.id }).lean();
  const serializedProfile = profile ? JSON.parse(JSON.stringify(profile)) : null;

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100">
      <AdminSidebar user={session.user} profile={serializedProfile} />
      <main className="flex-1 min-w-0 flex flex-col">
        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
