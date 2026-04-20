'use server';

import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function createProject(prevState: any, formData: FormData) {
  const session = await auth();

  if (!session) {
    throw new Error('Unauthorized');
  }

  await dbConnect();

  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const summary = formData.get('summary') as string;
  const description = formData.get('description') as string;
  const categoryJson = formData.get('category') as string;
  const techStackJson = formData.get('techStack') as string;
  
  let categoryIds = [];
  let techStackIds = [];

  try {
    const rawCategories = categoryJson ? JSON.parse(categoryJson) : [];
    categoryIds = (Array.isArray(rawCategories) ? rawCategories : [rawCategories])
      .map(id => new mongoose.Types.ObjectId(id));
  } catch (e) {
    return { error: 'Invalid category data' };
  }

  try {
    const rawTechStack = techStackJson ? JSON.parse(techStackJson) : [];
    techStackIds = (Array.isArray(rawTechStack) ? rawTechStack : [rawTechStack])
      .map(id => new mongoose.Types.ObjectId(id));
  } catch (e) {
    return { error: 'Invalid tech stack data' };
  }

  const liveLink = formData.get('liveLink') as string;
  const githubLink = formData.get('githubLink') as string;
  const imageBase64 = formData.get('image') as string;
  const featured = formData.get('featured') === 'on';

  let imageUrl = '';

  // 1. Upload to Cloudinary first
  if (imageBase64) {
    try {
      const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
        upload_preset: 'portfolio_preset',
      });
      imageUrl = uploadResponse.secure_url;
    } catch (error: any) {
      console.error('Cloudinary upload error:', error);
      return { error: 'Image upload failed. Please check your cloud configuration.' };
    }
  } else {
    return { error: 'Project image is required' };
  }

  // 2. Save to Database
  try {
    const newProject = new Project({
      userId: session.user.id,
      title,
      slug,
      summary,
      description,
      category: categoryIds,
      liveLink,
      githubLink,
      image: imageUrl,
      featured,
      techStack: techStackIds,
    });
    
    await newProject.save();

    revalidatePath('/admin');
    revalidatePath('/');
  } catch (error: any) {
    if (error.code === 11000) {
      return { error: 'Slug must be unique' };
    }
    return { error: error.message || 'Failed to create project' };
  }

  redirect('/admin?success=true');
}

export async function updateProject(projectId: string, prevState: any, formData: FormData) {
  const session = await auth();

  if (!session) {
    throw new Error('Unauthorized');
  }

  await dbConnect();

  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const summary = formData.get('summary') as string;
  const description = formData.get('description') as string;
  const categoryJson = formData.get('category') as string;
  const techStackJson = formData.get('techStack') as string;
  const liveLink = formData.get('liveLink') as string;
  const githubLink = formData.get('githubLink') as string;
  const imageBase64 = formData.get('image') as string;
  const featured = formData.get('featured') === 'on';

  let categoryIds = [];
  let techStackIds = [];

  try {
    const rawCategories = categoryJson ? JSON.parse(categoryJson) : [];
    categoryIds = (Array.isArray(rawCategories) ? rawCategories : [rawCategories])
      .map(id => new mongoose.Types.ObjectId(id));
  } catch (e) {
    return { error: 'Invalid category data' };
  }

  try {
    const rawTechStack = techStackJson ? JSON.parse(techStackJson) : [];
    techStackIds = (Array.isArray(rawTechStack) ? rawTechStack : [rawTechStack])
      .map(id => new mongoose.Types.ObjectId(id));
  } catch (e) {
    return { error: 'Invalid tech stack data' };
  }

  try {
    const project = await Project.findOne({ _id: projectId, userId: session.user.id });
    if (!project) {
      return { error: 'Project not found' };
    }

    let imageUrl = project.image;

    // Only upload if it's a new base64 image (not the existing URL)
    if (imageBase64 && imageBase64.startsWith('data:image')) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
          upload_preset: 'portfolio_preset',
        });
        imageUrl = uploadResponse.secure_url;
      } catch (error: any) {
        return { error: 'Image upload failed' };
      }
    }

    project.title = title;
    project.slug = slug;
    project.summary = summary;
    project.description = description;
    project.category = categoryIds;
    project.techStack = techStackIds;
    project.liveLink = liveLink;
    project.githubLink = githubLink;
    project.image = imageUrl;
    project.featured = featured;

    await project.save();

    revalidatePath('/admin');
    revalidatePath(`/admin/projects/edit/${projectId}`);
    revalidatePath('/');
  } catch (error: any) {
    if (error.code === 11000) {
      return { error: 'Slug must be unique' };
    }
    return { error: error.message || 'Failed to update project' };
  }

  redirect('/admin?success=true');
}

export async function deleteProject(projectId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  await dbConnect();

  try {
    const project = await Project.findOneAndDelete({
      _id: projectId,
      userId: session.user.id,
    });

    if (!project) {
      return { error: 'Project not found or unauthorized' };
    }

    revalidatePath('/admin/projects');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Failed to delete project' };
  }
}
