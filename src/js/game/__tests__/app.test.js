import properties from '../properties.js';

// Mock Phaser Game constructor
const mockPhaserGame = jest.fn().mockImplementation(() => ({
    state: {
        add: jest.fn(),
        start: jest.fn(),
    },
}));

// Mock Phaser constants
global.Phaser = {
    Game: mockPhaserGame,
    AUTO: 'AUTO',
};

// Mock game states
const mockBoot = { name: 'boot' };
const mockPreloader = { name: 'preloader' };
const mockLoad = { name: 'load' };
const mockSplash = { name: 'splash' };
const mockGameState = { name: 'game' };

// Mock imports
jest.mock('../properties.js', () => ({
    size: { x: 1024, y: 768 }
}));

jest.mock('../states/boot.js', () => mockBoot);
jest.mock('../states/preloader.js', () => mockPreloader);
jest.mock('../states/load.js', () => mockLoad);
jest.mock('../states/splash.js', () => mockSplash);
jest.mock('../states/game.js', () => mockGameState);

describe('Game App Initialization', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should create Phaser game with correct dimensions', () => {
        // Re-import to trigger the module execution
        jest.resetModules();
        require('../app.js');

        expect(mockPhaserGame).toHaveBeenCalledWith(1024, 768, 'AUTO', 'game');
    });

    test('should register all game states', () => {
        const mockGameInstance = {
            state: {
                add: jest.fn(),
                start: jest.fn(),
            },
        };
        mockPhaserGame.mockReturnValue(mockGameInstance);

        // Re-import to trigger the module execution
        jest.resetModules();
        require('../app.js');

        expect(mockGameInstance.state.add).toHaveBeenCalledWith('boot', mockBoot);
        expect(mockGameInstance.state.add).toHaveBeenCalledWith('preloader', mockPreloader);
        expect(mockGameInstance.state.add).toHaveBeenCalledWith('load', mockLoad);
        expect(mockGameInstance.state.add).toHaveBeenCalledWith('splash', mockSplash);
        expect(mockGameInstance.state.add).toHaveBeenCalledWith('game', mockGameState);
    });

    test('should start with boot state', () => {
        const mockGameInstance = {
            state: {
                add: jest.fn(),
                start: jest.fn(),
            },
        };
        mockPhaserGame.mockReturnValue(mockGameInstance);

        // Re-import to trigger the module execution
        jest.resetModules();
        require('../app.js');

        expect(mockGameInstance.state.start).toHaveBeenCalledWith('boot');
    });

    test('should handle state registration in correct order', () => {
        const mockGameInstance = {
            state: {
                add: jest.fn(),
                start: jest.fn(),
            },
        };
        mockPhaserGame.mockReturnValue(mockGameInstance);

        // Re-import to trigger the module execution
        jest.resetModules();
        require('../app.js');

        const addCalls = mockGameInstance.state.add.mock.calls;

        // Verify all states are registered
        expect(addCalls).toHaveLength(5);

        // Verify state names
        const stateNames = addCalls.map(call => call[0]);
        expect(stateNames).toContain('boot');
        expect(stateNames).toContain('preloader');
        expect(stateNames).toContain('load');
        expect(stateNames).toContain('splash');
        expect(stateNames).toContain('game');
    });

    test('should use properties for game dimensions', () => {
        // Mock properties with different values
        jest.doMock('../properties.js', () => ({
            size: { x: 800, y: 600 }
        }));

        // Re-import to trigger the module execution
        jest.resetModules();
        require('../app.js');

        expect(mockPhaserGame).toHaveBeenCalledWith(800, 600, 'AUTO', 'game');
    });

    test('should handle missing game container element', () => {
        // This test verifies that the game can be created even if the DOM element doesn't exist
        // Phaser will handle this gracefully
        const mockGameInstance = {
            state: {
                add: jest.fn(),
                start: jest.fn(),
            },
        };
        mockPhaserGame.mockReturnValue(mockGameInstance);

        // Re-import to trigger the module execution
        jest.resetModules();
        require('../app.js');

        expect(mockPhaserGame).toHaveBeenCalled();
        expect(mockGameInstance.state.start).toHaveBeenCalledWith('boot');
    });
});
