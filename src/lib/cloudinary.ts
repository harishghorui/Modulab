/**
 * Utility for Cloudinary upload paths and configurations
 */

export type CloudinaryCategory = 'Profile_Photos' | 'Resumes' | 'Project_Images';

/**
 * Returns the hierarchical folder path for Cloudinary uploads.
 * Pattern: Modulab/{username}/{category}
 */
export function getCloudinaryPath(username: string, category: CloudinaryCategory) {
  // Ensure username is clean for folder names
  const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  return `Modulab/${cleanUsername}/${category}`;
}

/**
 * Standard upload options for Cloudinary to ensure consistency
 */
export const getBaseUploadOptions = (username: string, category: CloudinaryCategory) => ({
  folder: getCloudinaryPath(username, category),
  use_filename: true,
  unique_filename: true,
  overwrite: false,
});
