import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Profile from '@/models/Profile';
import Project from '@/models/Project';
import Skill from '@/models/Skill';
import SkillCategory from '@/models/SkillCategory';
import Category from '@/models/Category'; // The model for Project categories
import { Metadata } from 'next';
import PortfolioClient from './PortfolioClient';
import { getDownloadUrl } from '@/lib/utils';

interface Props {
  params: Promise<{ username: string }>;
}

async function getPortfolioData(username: string) {
  await dbConnect();

  const user = (await User.findOne({ username: username.toLowerCase() }).lean()) as any;
  if (!user) return null;

  const [profile, projects, skills, skillCategories] = (await Promise.all([
    Profile.findOne({ userId: user._id }).lean(),
    Project.find({ userId: user._id })
      .populate('techStack')
      .populate('category')
      .sort({ featured: -1, createdAt: -1 })
      .lean(),
    Skill.find({ userId: user._id }).populate('category').lean(),
    SkillCategory.find({ userId: user._id }).sort({ name: 1 }).lean(),
  ])) as any[];

  if (profile && profile.resumeUrl) {
    profile.resumeUrl = getDownloadUrl(profile.resumeUrl);
  }

  return {
    user: JSON.parse(JSON.stringify(user)),
    profile: JSON.parse(JSON.stringify(profile)),
    projects: JSON.parse(JSON.stringify(projects)),
    skills: JSON.parse(JSON.stringify(skills)),
    skillCategories: JSON.parse(JSON.stringify(skillCategories)),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const data = await getPortfolioData(username);
  
  if (!data) return { title: 'User Not Found' };

  const fullName = `${data.user.firstName} ${data.user.lastName}`;
  const headline = data.profile?.headline || 'Portfolio';

  return {
    title: `${fullName} | ${headline}`,
    description: data.profile?.bio?.substring(0, 160) || `Check out ${fullName}'s portfolio`,
  };
}

export default async function PortfolioPage({ params }: Props) {
  const { username } = await params;
  const data = await getPortfolioData(username);

  if (!data) {
    notFound();
  }

  return <PortfolioClient data={data} />;
}
