import properties from '../properties.js';

describe('Game Properties Configuration', () => {
    test('should export a valid configuration object', () => {
        expect(properties).toBeDefined();
        expect(typeof properties).toBe('object');
    });

    test('should have correct game title', () => {
        expect(properties.title).toBe('Go Home Tanuki');
    });

    test('should have correct game description', () => {
        expect(properties.description).toBe('Go Home Tanuki (You\'re Drunk) - A game built for the Global Game Jam 2016 with Phaser.js');
    });

    test('should have correct port configuration', () => {
        expect(properties.port).toBe(3017);
        expect(typeof properties.port).toBe('number');
    });

    test('should have correct live reload port', () => {
        expect(properties.liveReloadPort).toBe(3018);
        expect(typeof properties.liveReloadPort).toBe('number');
    });

    test('should have mute setting', () => {
        expect(typeof properties.mute).toBe('boolean');
    });

    test('should have showStats setting', () => {
        expect(typeof properties.showStats).toBe('boolean');
    });

    test('should have correct size configuration', () => {
        expect(properties.size).toBeDefined();
        expect(properties.size.x).toBe(1024);
        expect(properties.size.y).toBe(768);
        expect(typeof properties.size.x).toBe('number');
        expect(typeof properties.size.y).toBe('number');
    });

    test('should have analytics ID', () => {
        expect(properties.analyticsId).toBe('UA-50892214-2');
        expect(typeof properties.analyticsId).toBe('string');
    });

    test('should have all required properties', () => {
        const requiredProperties = [
            'title',
            'description',
            'port',
            'liveReloadPort',
            'mute',
            'showStats',
            'size',
            'analyticsId'
        ];

        requiredProperties.forEach(prop => {
            expect(properties).toHaveProperty(prop);
        });
    });

    test('should have valid size dimensions', () => {
        expect(properties.size.x).toBeGreaterThan(0);
        expect(properties.size.y).toBeGreaterThan(0);
        expect(properties.size.x).toBeGreaterThan(properties.size.y); // Width should be greater than height for landscape
    });

    test('should have valid port numbers', () => {
        expect(properties.port).toBeGreaterThan(1024); // Should be above well-known ports
        expect(properties.liveReloadPort).toBeGreaterThan(1024);
        expect(properties.liveReloadPort).toBeGreaterThan(properties.port); // Live reload port should be different
    });
});
