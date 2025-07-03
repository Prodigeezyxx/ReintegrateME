
// Browser storage for images (fallback when Supabase storage fails)
const imageStorage = new Map<string, string>();

export const imageStorageAPI = {
  // Store image in browser memory with better error handling
  storeImage: (key: string, imageData: string): void => {
    // Always store in memory first
    imageStorage.set(key, imageData);
    
    try {
      // Try to clear old images if localStorage is getting full
      const storageKeys = Object.keys(localStorage);
      const imageKeys = storageKeys.filter(k => k.startsWith('img_'));
      
      // If we have more than 5 images, remove the oldest ones
      if (imageKeys.length > 5) {
        const keysToRemove = imageKeys.slice(0, imageKeys.length - 4);
        keysToRemove.forEach(k => {
          try {
            localStorage.removeItem(k);
          } catch (e) {
            console.warn('Failed to remove old image:', e);
          }
        });
      }
      
      // Try to store the new image
      localStorage.setItem(`img_${key}`, imageData);
    } catch (error) {
      console.warn('LocalStorage full, using memory only:', error);
      // Image is still stored in memory, so it will work for this session
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
