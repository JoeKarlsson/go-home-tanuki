import assetManager from '../assets.js';

describe('AssetManager', () => {
    let mockGame;

    beforeEach(() => {
        mockGame = {
            load: {
                image: jest.fn().mockReturnValue({
                    onLoadComplete: { add: jest.fn() },
                    onLoadError: { add: jest.fn() },
                }),
                audio: jest.fn().mockReturnValue({
                    onLoadComplete: { add: jest.fn() },
                    onLoadError: { add: jest.fn() },
                }),
                start: jest.fn(),
            },
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        test('should initialize with empty maps and arrays', () => {
            expect(assetManager.loadedAssets).toBeInstanceOf(Map);
            expect(assetManager.assetCache).toBeInstanceOf(Map);
            expect(assetManager.preloadQueue).toEqual([]);
            expect(assetManager.loadedAssets.size).toBe(0);
            expect(assetManager.assetCache.size).toBe(0);
        });
    });

    describe('preloadCriticalAssets', () => {
        test('should return critical assets for preloading', () => {
            const criticalAssets = assetManager.preloadCriticalAssets(mockGame);

            expect(criticalAssets).toEqual([
                'tanukisprite_115_100',
                'ground',
                'starfield',
                'cloud1',
                'cloud2',
                'cloud3',
            ]);
        });

        test('should add assets to preload queue', () => {
            assetManager.preloadCriticalAssets(mockGame);

            expect(assetManager.preloadQueue).toHaveLength(6);
            expect(assetManager.preloadQueue).toContain('tanukisprite_115_100');
            expect(assetManager.preloadQueue).toContain('ground');
        });

        test('should not add already loaded assets to preload queue', () => {
            assetManager.loadedAssets.set('tanukisprite_115_100', true);

            const criticalAssets = assetManager.preloadCriticalAssets(mockGame);

            expect(criticalAssets).not.toContain('tanukisprite_115_100');
            expect(criticalAssets).toHaveLength(5);
        });
    });

    describe('loadImageOptimized', () => {
        test('should return cached asset if available', async () => {
            const mockLoader = { cached: true };
            assetManager.assetCache.set('test-image', mockLoader);

            const result = await assetManager.loadImageOptimized(mockGame, 'test-image', 'test-url');

            expect(result).toBe(mockLoader);
            expect(mockGame.load.image).not.toHaveBeenCalled();
        });

        test('should load new image asset', async () => {
            const mockLoader = {
                onLoadComplete: { add: jest.fn() },
                onLoadError: { add: jest.fn() },
            };
            mockGame.load.image.mockReturnValue(mockLoader);

            const promise = assetManager.loadImageOptimized(mockGame, 'test-image', 'test-url');

            // Simulate successful load
            const loadCompleteCallback = mockLoader.onLoadComplete.add.mock.calls[0][0];
            loadCompleteCallback();

            const result = await promise;

            expect(mockGame.load.image).toHaveBeenCalledWith('test-image', 'test-url');
            expect(result).toBe(mockLoader);
            expect(assetManager.assetCache.has('test-image')).toBe(true);
            expect(assetManager.loadedAssets.has('test-image')).toBe(true);
        });

        test('should handle load errors', async () => {
            const mockLoader = {
                onLoadComplete: { add: jest.fn() },
                onLoadError: { add: jest.fn() },
            };
            mockGame.load.image.mockReturnValue(mockLoader);

            const promise = assetManager.loadImageOptimized(mockGame, 'test-image', 'test-url');

            // Simulate load error
            const loadErrorCallback = mockLoader.onLoadError.add.mock.calls[0][0];

            await expect(() => {
                loadErrorCallback();
                return promise;
            }).rejects.toThrow('Failed to load asset: test-image');
        });

        test('should start loading immediately for high priority assets', async () => {
            const mockLoader = {
                onLoadComplete: { add: jest.fn() },
                onLoadError: { add: jest.fn() },
            };
            mockGame.load.image.mockReturnValue(mockLoader);

            assetManager.loadImageOptimized(mockGame, 'test-image', 'test-url', 'high');

            expect(mockGame.load.start).toHaveBeenCalled();
        });
    });

    describe('loadAssetBatch', () => {
        test('should load multiple assets successfully', async () => {
            const assets = [
                { key: 'image1', url: 'url1', type: 'image' },
                { key: 'image2', url: 'url2', type: 'image' },
            ];

            const mockLoader = {
                onLoadComplete: { add: jest.fn() },
                onLoadError: { add: jest.fn() },
            };
            mockGame.load.image.mockReturnValue(mockLoader);

            const promise = assetManager.loadAssetBatch(mockGame, assets);

            // Simulate successful loads for both assets
            const loadCompleteCallback = mockLoader.onLoadComplete.add.mock.calls[0][0];
            loadCompleteCallback();
            loadCompleteCallback();

            await promise;

            expect(mockGame.load.image).toHaveBeenCalledTimes(2);
            expect(mockGame.load.image).toHaveBeenCalledWith('image1', 'url1');
            expect(mockGame.load.image).toHaveBeenCalledWith('image2', 'url2');
        });

        test('should handle mixed asset types', async () => {
            const assets = [
                { key: 'image1', url: 'url1', type: 'image' },
                { key: 'audio1', url: 'url2', type: 'audio' },
            ];

            const mockImageLoader = {
                onLoadComplete: { add: jest.fn() },
                onLoadError: { add: jest.fn() },
            };
            const mockAudioLoader = {
                onLoadComplete: { add: jest.fn() },
                onLoadError: { add: jest.fn() },
            };

            mockGame.load.image.mockReturnValue(mockImageLoader);
            mockGame.load.audio.mockReturnValue(mockAudioLoader);

            const promise = assetManager.loadAssetBatch(mockGame, assets);

            // Simulate successful loads
            const imageLoadComplete = mockImageLoader.onLoadComplete.add.mock.calls[0][0];
            const audioLoadComplete = mockAudioLoader.onLoadComplete.add.mock.calls[0][0];
            imageLoadComplete();
            audioLoadComplete();

            await promise;

            expect(mockGame.load.image).toHaveBeenCalledWith('image1', 'url1');
            expect(mockGame.load.audio).toHaveBeenCalledWith('audio1', 'url2');
        });
    });

    describe('getLoadingStats', () => {
        test('should return correct loading statistics', () => {
            assetManager.loadedAssets.set('asset1', true);
            assetManager.loadedAssets.set('asset2', true);
            assetManager.assetCache.set('asset1', {});
            assetManager.preloadQueue.push('asset3', 'asset4');

            const stats = assetManager.getLoadingStats();

            expect(stats).toEqual({
                totalLoaded: 2,
                cacheSize: 1,
                preloadQueue: 2,
            });
        });
    });

    describe('preloadForState', () => {
        test('should return correct assets for splash state', () => {
            const assets = assetManager.preloadForState('splash');

            expect(assets).toEqual(['splash-main', 'tanuki-splash-1', 'tanuki-splash-2']);
        });

        test('should return correct assets for game state', () => {
            const assets = assetManager.preloadForState('game');

            expect(assets).toEqual(['tanukifly1', 'tanukifly2', 'rock1', 'rock2', 'lamp']);
        });

        test('should return correct assets for load state', () => {
            const assets = assetManager.preloadForState('load');

            expect(assets).toEqual(['plaque', 'checkmark', 'underline']);
        });

        test('should return empty array for unknown state', () => {
            const assets = assetManager.preloadForState('unknown');

            expect(assets).toEqual([]);
        });
    });

    describe('clearUnusedAssets', () => {
        test('should log current cache size', () => {
            assetManager.assetCache.set('asset1', {});
            assetManager.assetCache.set('asset2', {});

            assetManager.clearUnusedAssets();

            expect(console.log).toHaveBeenCalledWith('Asset cache size: 2 items');
        });
    });
});
