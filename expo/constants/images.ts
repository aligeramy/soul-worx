/**
 * Image paths for Soulworx assets
 */

// Base URL for images from the web app
const WEB_APP_URL = 'https://beta.soulworx.ca'; // Your production web app URL
// For local dev: 'http://localhost:3000' (won't work on physical device)

export const Images = {
  logo: 'https://via.placeholder.com/200x200/F5F1E8/2C2C2C?text=Soulworx',
  
  // Quick nav images for Resources tab (from web app)
  quickNav: {
    poetry: `${WEB_APP_URL}/quick-nav/poetry.jpg`,
    programs: `${WEB_APP_URL}/quick-nav/programs.jpg`,
    blog: `${WEB_APP_URL}/quick-nav/poetry.jpg`,
    events: `${WEB_APP_URL}/home-gallery/1.jpg`,
    press: `${WEB_APP_URL}/quick-nav/poetry.jpg`,
  },
  
  // Placeholder for missing images
  placeholders: {
    program: `${WEB_APP_URL}/optimized/0K0A4102.jpg`,
    channel: `${WEB_APP_URL}/optimized/0K0A0826.jpg`,
    video: `${WEB_APP_URL}/optimized/0K0A2899.jpg`,
    profile: 'https://via.placeholder.com/400x400/D4AF37/FFFFFF?text=User',
  },
};

/**
 * Get image source for a program/channel
 * Converts relative paths from database to full URLs
 */
export function getImageSource(imageUrl: string | null | undefined, type: 'program' | 'channel' | 'video' = 'program') {
  if (imageUrl) {
    // If it's already a full URL, return as-is
    if (imageUrl.startsWith('http')) {
      return { uri: imageUrl };
    }
    
    // If it's a relative path, prepend the web app URL
    if (imageUrl.startsWith('/')) {
      return { uri: `${WEB_APP_URL}${imageUrl}` };
    }
    
    // Fallback: prepend web app URL
    return { uri: `${WEB_APP_URL}/${imageUrl}` };
  }
  
  // No image provided, use placeholder
  return { uri: Images.placeholders[type] };
}

