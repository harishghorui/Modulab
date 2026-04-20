import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ProjectForm from './ProjectForm';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import Skill from '@/models/Skill';

export default async function NewProjectPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  await dbConnect();
  
  const [categories, skills] = await Promise.all([
    Category.find({ userId: session.user.id }).sort({ name: 1 }).lean(),
    Skill.find({ userId: session.user.id }).sort({ name: 1 }).lean()
  ]);

  const serializedCategories = JSON.parse(JSON.stringify(categories));
  const serializedSkills = JSON.parse(JSON.stringify(skills));

  return <ProjectForm categories={serializedCategories} skills={serializedSkills} />;
}
