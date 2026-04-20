'use server';

import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import Profile from '@/models/Profile';
import User from '@/models/User';
import { revalidatePath } from 'next/cache';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function updateProfile(prevState: any, formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: 'Unauthorized' };
  }

  await dbConnect();

  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const username = formData.get('username') as string;

  const headline = formData.get('headline') as string;
  const bio = formData.get('bio') as string;
  const imageBase64 = formData.get('image') as string;
  const resumeBase64 = formData.get('resumeUrl') as string;

  const socialLinks = {
    github: formData.get('github') as string,
    linkedin: formData.get('linkedin') as string,
    twitter: formData.get('twitter') as string,
    website: formData.get('website') as string,
  };

  try {
    // 1. Update User
    const existingUserWithUsername = await User.findOne({ 
      username: username.toLowerCase(), 
      _id: { $ne: session.user.id } 
    });
    
    if (existingUserWithUsername) {
      return { error: 'Username is already taken' };
    }

    await User.findByIdAndUpdate(session.user.id, {
      firstName,
      lastName,
      username: username.toLowerCase(),
    });

    // 2. Handle Cloudinary Uploads
    let imageUrl = '';
    let resumeUrl = '';
    
    // Get existing profile to keep old URLs if not changed
    const existingProfile = await Profile.findOne({ userId: session.user.id });
    if (existingProfile) {
      imageUrl = existingProfile.image;
      resumeUrl = existingProfile.resumeUrl;
    }

    // Upload image if it's new (starts with data:image)
    if (imageBase64 && imageBase64.startsWith('data:image')) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
          upload_preset: 'portfolio_preset',
        });
        imageUrl = uploadResponse.secure_url;
      } catch (error: any) {
        console.error('Image upload error:', error);
        return { error: 'Failed to upload profile image' };
      }
    } else if (!imageBase64) {
      imageUrl = '';
    }

    // Upload resume if it's new (starts with data:)
    if (resumeBase64 && resumeBase64.startsWith('data:')) {
      try {
        // Detect extension from MIME type
        let extension = '';
        if (resumeBase64.startsWith('data:application/pdf')) {
          extension = '.pdf';
        } else if (resumeBase64.startsWith('data:application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
          extension = '.docx';
        } else if (resumeBase64.startsWith('data:application/msword')) {
          extension = '.doc';
        }

        // Use a clean ID with extension. Raw files MUST include the extension in public_id.
        const cleanId = `resume_${session.user.id}_${Date.now()}${extension}`;
        
        const uploadResponse = await cloudinary.uploader.upload(resumeBase64, {
          resource_type: 'raw', // Force raw for all formats to trigger browser download behavior
          public_id: cleanId,
          folder: 'resumes',
          filename_override: `resume${extension}`,
          display_name: `resume${extension}`,
          use_filename: false,
          unique_filename: false,
          overwrite: true,
          context: '', 
          tags: [],
        });
        resumeUrl = uploadResponse.secure_url;
      } catch (error: any) {
        console.error('Full Cloudinary Error:', JSON.stringify(error, null, 2));
        return { error: `Failed to upload resume: ${error.message || 'Check server logs for details'}` };
      }
    } else if (!resumeBase64) {
      resumeUrl = '';
    }

    // 3. Update Profile
    await Profile.findOneAndUpdate(
      { userId: session.user.id },
      {
        userId: session.user.id,
        headline,
        bio,
        // we keep the existing skills array as is, managed by separate skills page
        image: imageUrl,
        resumeUrl,
        socialLinks,
      },
      { upsert: true, new: true, runValidators: true }
    );

    revalidatePath('/admin/profile');
    revalidatePath('/admin');
    revalidatePath(`/${username}`);
    revalidatePath('/');
    
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Failed to update profile' };
  }
}

export async function checkUsernameAvailability(username: string) {
  const session = await auth();
  if (!session?.user?.id) return { available: false };

  await dbConnect();
  const existingUser = await User.findOne({ 
    username: username.toLowerCase(), 
    _id: { $ne: session.user.id } 
  });
  
  return { available: !existingUser };
}
