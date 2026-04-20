import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import Profile from '@/models/Profile';
import User from '@/models/User';
import ProfileForm from './ProfileForm';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  await dbConnect();

  const [user, profile] = await Promise.all([
    User.findById(session.user.id).lean(),
    Profile.findOne({ userId: session.user.id }).lean(),
  ]);

  if (!user) {
    redirect('/login');
  }

  // Convert MongoDB _id and other special types to plain objects for the client component
  const serializedProfile = profile ? JSON.parse(JSON.stringify(profile)) : null;
  const serializedUser = JSON.parse(JSON.stringify(user));

  return <ProfileForm initialData={serializedProfile} userData={serializedUser} />;
}
