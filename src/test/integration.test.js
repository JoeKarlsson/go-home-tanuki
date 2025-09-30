// Simple integration test to verify the testing setup works
describe('Testing Setup Integration', () => {
    test('should have working Jest configuration', () => {
        expect(true).toBe(true);
    });

    test('should have Phaser mocks available', () => {
        expect(global.Phaser).toBeDefined();
        expect(global.Phaser.Game).toBeDefined();
    });

    test('should have performance API mocks', () => {
        expect(global.performance).toBeDefined();
        expect(global.performance.now).toBeDefined();
    });

    test('should have console mocks', () => {
        expect(global.console.log).toBeDefined();
        expect(jest.isMockFunction(global.console.log)).toBe(true);
    });
});
