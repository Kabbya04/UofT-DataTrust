// Utility for mapping real images from /public/images to different content types
// Excludes auth.jpg as per requirements
// Person images are used specifically for user avatars
// Other images are used for thumbnails

const personImages = [
  "/images/person1.png",
  "/images/person2.png",
  "/images/person3.png",
  "/images/person4.png",
  "/images/person5.png"
];

const thumbnailImages = [
  "/images/2df0acae5b7ea4dd9960a42f453711667fbcaa9f.jpg",
  "/images/77f3f898fe24b0ff09a94e0828a9f96d45408027.png",
  "/images/7bd6d33b78bfbb7439919297ce27c227e923c4c8.jpg",
  "/images/Rectangle 23 (1).png",
  "/images/c3f0513a98c489d16af55838c819a4fef8a43228.png",
  "/images/source_0b25c9a78fb612143ad7552caa5a697045c03e9f.jpg",
  "/images/source_167ba86902787cdad7116f380c4eb65f9ee7eccc.jpg",
  "/images/source_511b8bb9342f6aae19b3141090fd11455ed8bfd9.jpg",
  "/images/source_56e6603f1fc53076d2fd818e854429da7b6989a7.jpg",
  "/images/source_695ca5b7835924e69dd3ee9eb5c5fd939c3873c1.jpg",
  "/images/source_7b42da3919104120fe9f4156c829e539a7cfbbdb.jpg",
  "/images/source_d6786e8c2c69698a35b0c69155d78ba5b114fc06.jpg"
];

// Legacy combined array for backward compatibility
const availableImages = [...thumbnailImages];

// Cache for consistent image assignment
const imageAssignmentCache = new Map<string, string>();

/**
 * Get a random thumbnail image from the thumbnail images pool
 */
export function getRandomThumbnail(): string {
  const randomIndex = Math.floor(Math.random() * thumbnailImages.length);
  return thumbnailImages[randomIndex];
}

/**
 * Get a random person image for avatars
 */
export function getRandomPersonImage(): string {
  const randomIndex = Math.floor(Math.random() * personImages.length);
  return personImages[randomIndex];
}

/**
 * Get a random image from the available images pool (legacy function)
 */
export function getRandomImage(): string {
  const randomIndex = Math.floor(Math.random() * availableImages.length);
  return availableImages[randomIndex];
}

/**
 * Get a consistent image for a given identifier (like user ID, community ID, etc.)
 * This ensures the same content always shows the same image
 */
export function getImageForId(id: string, type: 'community' | 'dataset' | 'avatar' | 'thumbnail' = 'thumbnail'): string {
  const cacheKey = `${type}_${id}`;
  
  if (imageAssignmentCache.has(cacheKey)) {
    return imageAssignmentCache.get(cacheKey)!;
  }
  
  // Use a simple hash function to consistently map IDs to images
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  let selectedImage: string;
  
  // Use person images for avatars, thumbnail images for everything else
  if (type === 'avatar') {
    const imageIndex = Math.abs(hash) % personImages.length;
    selectedImage = personImages[imageIndex];
  } else {
    const imageIndex = Math.abs(hash) % thumbnailImages.length;
    selectedImage = thumbnailImages[imageIndex];
  }
  
  imageAssignmentCache.set(cacheKey, selectedImage);
  return selectedImage;
}

/**
 * Get images specifically suited for community covers
 * Returns thumbnail images when possible
 */
export function getCommunityImage(communityId: string): string {
  return getImageForId(communityId, 'community');
}

/**
 * Get images for dataset thumbnails
 */
export function getDatasetThumbnail(datasetId: string): string {
  return getImageForId(datasetId, 'thumbnail');
}

/**
 * Get person images for user avatars
 */
export function getUserAvatar(userId: string): string {
  return getImageForId(userId, 'avatar');
}

/**
 * Get all available thumbnail images
 */
export function getAllThumbnailImages(): string[] {
  return [...thumbnailImages];
}

/**
 * Get all available person images
 */
export function getAllPersonImages(): string[] {
  return [...personImages];
}

/**
 * Get all available images (for debugging or selection purposes)
 */
export function getAllAvailableImages(): string[] {
  return [...availableImages];
}

/**
 * Reset the cache (useful for testing)
 */
export function resetImageCache(): void {
  imageAssignmentCache.clear();
}