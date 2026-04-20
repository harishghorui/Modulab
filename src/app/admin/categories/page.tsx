import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import CategoryList from './CategoryList';

export default async function AdminCategoriesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  await dbConnect();

  const categories = await Category.find({ userId: session.user.id })
    .sort({ name: 1 })
    .lean();

  // Serialize MongoDB data
  const serializedCategories = JSON.parse(JSON.stringify(categories));

  return <CategoryList initialCategories={serializedCategories} />;
}
