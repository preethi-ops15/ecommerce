// Utility function to construct image URLs
const BACKEND_BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000';

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // If the path already starts with http, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If the path starts with /uploads/, construct the full URL
  if (imagePath.startsWith('/uploads/')) {
    return `${BACKEND_BASE_URL}${imagePath}`;
  }
  
  // If it's just a filename, assume it's in uploads
  if (!imagePath.startsWith('/')) {
    return `${BACKEND_BASE_URL}/uploads/${imagePath}`;
  }
  
  // Default case - return as is
  return imagePath;
}; 