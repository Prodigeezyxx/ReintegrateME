
export class ImagePreloader {
  private cache = new Map<string, HTMLImageElement>();
  private loadingPromises = new Map<string, Promise<HTMLImageElement>>();

  async preloadImage(url: string): Promise<HTMLImageElement> {
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url)!;
    }

    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.cache.set(url, img);
        this.loadingPromises.delete(url);
        resolve(img);
      };
      img.onerror = () => {
        this.loadingPromises.delete(url);
        reject(new Error(`Failed to load image: ${url}`));
      };
      img.src = url;
    });

    this.loadingPromises.set(url, promise);
    return promise;
  }

  async preloadImages(urls: string[]): Promise<HTMLImageElement[]> {
    return Promise.allSettled(urls.map(url => this.preloadImage(url)))
      .then(results => 
        results
          .filter(result => result.status === 'fulfilled')
          .map(result => (result as PromiseFulfilledResult<HTMLImageElement>).value)
      );
  }

  isImageCached(url: string): boolean {
    return this.cache.has(url);
  }

  clearCache(): void {
    this.cache.clear();
    this.loadingPromises.clear();
  }
}

export const imagePreloader = new ImagePreloader();
