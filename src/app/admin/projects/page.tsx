import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';
import ProjectsTable from './ProjectsTable';

export default async function AdminProjectsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  await dbConnect();

  const projects = await Project.find({ userId: session.user.id })
    .populate('category')
    .sort({ createdAt: -1 })
    .lean();

  // Serialize MongoDB data for the client component
  const serializedProjects = JSON.parse(JSON.stringify(projects));

  return <ProjectsTable initialProjects={serializedProjects} />;
}
