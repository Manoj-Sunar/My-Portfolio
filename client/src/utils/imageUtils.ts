/**
 * Transforms Cloudinary URLs to append dynamic optimization parameters.
 * E.g., setting format to auto, quality to auto, custom resizing, and smart cropping.
 */
export const transformCloudinaryUrl = (
  url: string | undefined, 
  transformations: string = 'f_auto,q_auto'
): string => {
  if (!url) return '';
  // Support both HTTP and HTTPS Cloudinary URLs
  if (url.includes('res.cloudinary.com') && url.includes('image/upload/')) {
    // Avoid double-inserting if transformations are already present
    if (url.includes('f_auto') || url.includes('q_auto') || url.includes('c_fill')) {
      return url;
    }
    return url.replace('image/upload/', `image/upload/${transformations}/`);
  }
  return url;
};

/**
 * Generates an optimized URL for dynamic responsive profiling/avatars.
 * Focused on face detection cropping.
 */
export const getOptimizedAvatarUrl = (url: string | undefined, size: number = 400): string => {
  return transformCloudinaryUrl(url, `w_${size},h_${size},c_fill,g_face,f_auto,q_auto`);
};

/**
 * Generates an optimized URL for project media assets.
 * Uses smart content-aware (g_auto) landscape aspect-ratio cropping.
 */
export const getOptimizedProjectUrl = (url: string | undefined, width: number = 800, height: number = 450): string => {
  return transformCloudinaryUrl(url, `w_${width},h_${height},c_fill,g_auto,f_auto,q_auto`);
};
