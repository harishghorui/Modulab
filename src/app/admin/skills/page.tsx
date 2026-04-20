import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import Skill from '@/models/Skill';
import SkillCategory from '@/models/SkillCategory';
import SkillManager from './SkillManager';

export default async function AdminSkillsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  await dbConnect();

  // Fetch categories
  const categories = await SkillCategory.find({ userId: session.user.id })
    .sort({ name: 1 })
    .lean();

  // Fetch skills and populate category
  const skills = await Skill.find({ userId: session.user.id })
    .populate('category')
    .sort({ name: 1 })
    .lean();

  // Serialize data
  const serializedCategories = JSON.parse(JSON.stringify(categories));
  const serializedSkills = JSON.parse(JSON.stringify(skills));

  return (
    <SkillManager 
      initialSkills={serializedSkills} 
      initialCategories={serializedCategories} 
    />
  );
}
