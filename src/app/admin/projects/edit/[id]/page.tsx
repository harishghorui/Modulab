import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';
import Category from '@/models/Category';
import Skill from '@/models/Skill';
import ProjectForm from '../../new/ProjectForm';

export default async function EditProjectPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  await dbConnect();

  const [project, categories, skills] = await Promise.all([
    Project.findOne({ _id: id, userId: session.user.id }).lean(),
    Category.find({ userId: session.user.id }).sort({ name: 1 }).lean(),
    Skill.find({ userId: session.user.id }).sort({ name: 1 }).lean(),
  ]);

  if (!project) {
    notFound();
  }

  // Serialize data
  const serializedProject = JSON.parse(JSON.stringify(project));
  const serializedCategories = JSON.parse(JSON.stringify(categories));
  const serializedSkills = JSON.parse(JSON.stringify(skills));

  return (
    <ProjectForm 
      categories={serializedCategories} 
      skills={serializedSkills} 
      initialData={serializedProject} 
    />
  );
}
