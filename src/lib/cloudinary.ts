import { buildUrl } from 'cloudinary-build-url';

export const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'faith-jackson';

export const getCldUrl = (publicId: string, width?: number, height?: number) => {
  if (publicId.startsWith('http') || publicId.startsWith('input_file')) return publicId;
  
  try {
    return buildUrl(publicId, {
      cloud: { cloudName: CLOUD_NAME },
      transformations: {
        quality: 'auto',
        format: 'webp',
        resize: width && height ? { type: 'fill', width, height } : undefined,
      }
    });
  } catch (e) {
    return `https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=${width || 800}`;
  }
};
