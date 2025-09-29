// Asset optimization utilities for Go Home Tanuki
class AssetManager {
  constructor() {
    this.loadedAssets = new Map();
    this.assetCache = new Map();
    this.preloadQueue = [];
  }

  // Preload critical assets
  preloadCriticalAssets(game) {
    const criticalAssets = [
      'tanukisprite_115_100',
      'ground',
      'starfield',
      'cloud1',
      'cloud2',
      'cloud3',
    ];

    criticalAssets.forEach(asset => {
      if (!this.loadedAssets.has(asset)) {
        this.preloadQueue.push(asset);
      }
    });

    return this.preloadQueue;
  }

  // Optimize image loading with lazy loading
  loadImageOptimized(game, key, url, priority = 'normal') {
    return new Promise((resolve, reject) => {
      // Check cache first
      if (this.assetCache.has(key)) {
        resolve(this.assetCache.get(key));
        return;
      }

      // Load with priority
      const loader = game.load.image(key, url);
      
      loader.onLoadComplete.add(() => {
        this.assetCache.set(key, loader);
        this.loadedAssets.set(key, true);
        resolve(loader);
      });

      loader.onLoadError.add(() => {
        reject(new Error(`Failed to load asset: ${key}`));
      });

      // Start loading based on priority
      if (priority === 'high') {
        game.load.start();
      }
    });
  }

  // Batch load multiple assets
  async loadAssetBatch(game, assets) {
    const loadPromises = assets.map(({ key, url, type = 'image' }) => {
      switch (type) {
        case 'image':
          return this.loadImageOptimized(game, key, url);
        case 'audio':
          return this.loadAudioOptimized(game, key, url);
        default:
          return Promise.resolve();
      }
    });

    try {
      await Promise.all(loadPromises);
      console.log(`Successfully loaded ${assets.length} assets`);
    } catch (error) {
      console.error('Error loading asset batch:', error);
    }
  }

  // Optimize audio loading
  loadAudioOptimized(game, key, url) {
    return new Promise((resolve, reject) => {
      if (this.assetCache.has(key)) {
        resolve(this.assetCache.get(key));
        return;
      }

      const loader = game.load.audio(key, url);
      
      loader.onLoadComplete.add(() => {
        this.assetCache.set(key, loader);
        this.loadedAssets.set(key, true);
        resolve(loader);
      });

      loader.onLoadError.add(() => {
        reject(new Error(`Failed to load audio: ${key}`));
      });
    });
  }

  // Get asset loading statistics
  getLoadingStats() {
    return {
      totalLoaded: this.loadedAssets.size,
      cacheSize: this.assetCache.size,
      preloadQueue: this.preloadQueue.length,
    };
  }

  // Clear unused assets from cache
  clearUnusedAssets() {
    // This would be implemented based on game state
    // For now, just log the current cache size
    console.log(`Asset cache size: ${this.assetCache.size} items`);
  }

  // Preload assets for next game state
  preloadForState(stateName) {
    const stateAssets = {
      splash: ['splash-main', 'tanuki-splash-1', 'tanuki-splash-2'],
      game: ['tanukifly1', 'tanukifly2', 'rock1', 'rock2', 'lamp'],
      load: ['plaque', 'checkmark', 'underline'],
    };

    return stateAssets[stateName] || [];
  }
}

// Create global asset manager instance
const assetManager = new AssetManager();

export default assetManager;
