
// Browser storage for images (fallback when Supabase storage fails)
const imageStorage = new Map<string, string>();

export const imageStorageAPI = {
  // Store image in browser memory
  storeImage: (key: string, imageData: string): void => {
    try {
      imageStorage.set(key, imageData);
      // Also try to store in localStorage for persistence
      localStorage.setItem(`img_${key}`, imageData);
    } catch (error) {
      console.warn('Failed to store image in localStorage:', error);
      // Fallback to memory only
      imageStorage.set(key, imageData);
    }
  },
  
  // Retrieve image from browser memory
  getImage: (key: string): string | null => {
    // First try memory
    let image = imageStorage.get(key);
    if (image) return image;
    
    // Then try localStorage
    try {
      image = localStorage.getItem(`img_${key}`);
      if (image) {
        imageStorage.set(key, image); // Cache in memory
        return image;
      }
    } catch (error) {
      console.warn('Failed to retrieve image from localStorage:', error);
    }
    
    return null;
  },
  
  // Convert file to base64 for storage
  fileToBase64: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
};
