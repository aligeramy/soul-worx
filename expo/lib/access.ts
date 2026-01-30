import type { Video, CommunityChannel } from './types';

/**
 * Check if user can access a video based on their tier
 */
export function canAccessVideo(video: Video, userTierLevel: number): boolean {
  // First episodes are always free
  if (video.isFirstEpisode) {
    return true;
  }
  
  // Check if user's tier level meets the video's requirement
  return userTierLevel >= video.requiredTierLevel;
}

/**
 * Check if user can access a channel based on their tier
 */
export function canAccessChannel(channel: CommunityChannel, userTierLevel: number): boolean {
  return userTierLevel >= channel.requiredTierLevel;
}

/**
 * Get tier name from access level
 */
export function getTierName(accessLevel: number): string {
  switch (accessLevel) {
    case 1:
      return 'Free';
    case 2:
      return 'Pro';
    case 3:
      return 'Pro+';
    default:
      return 'Unknown';
  }
}

/**
 * Get tier color
 */
export function getTierColor(accessLevel: number): string {
  switch (accessLevel) {
    case 1:
      return '#9BA1A6'; // gray
    case 2:
      return '#E8D5B7'; // light gold/beige
    case 3:
      return '#9333EA'; // purple
    default:
      return '#687076';
  }
}

