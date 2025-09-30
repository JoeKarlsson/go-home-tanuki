// Test setup file for Jest
import { jest } from '@jest/globals';

// Mock Phaser.js for testing
global.Phaser = {
    Game: jest.fn().mockImplementation(() => ({
        state: {
            add: jest.fn(),
            start: jest.fn(),
        },
        add: {
            sprite: jest.fn().mockReturnValue({
                animations: {
                    add: jest.fn().mockReturnValue({
                        play: jest.fn(),
                    }),
                },
                anchor: {
                    setTo: jest.fn(),
                },
                body: {
                    gravity: { y: 0 },
                    velocity: { y: 0 },
                    collideWorldBounds: false,
                },
                alive: true,
                angle: 0,
            }),
            group: jest.fn().mockReturnValue({
                enableBody: true,
                createMultiple: jest.fn(),
                setAll: jest.fn(),
                getFirstExists: jest.fn().mockReturnValue({
                    reset: jest.fn(),
                    body: {
                        velocity: { x: 0 },
                        immovable: false,
                    },
                    kill: jest.fn(),
                }),
                forEachAlive: jest.fn(),
            }),
            tileSprite: jest.fn().mockReturnValue({
                tilePosition: { x: 0 },
                physicsType: 'SPRITE',
                body: {
                    allowGravity: false,
                    checkCollision: false,
                    immovable: false,
                    moves: false,
                },
            }),
            audio: jest.fn().mockReturnValue({
                play: jest.fn(),
                destroy: jest.fn(),
            }),
            text: jest.fn().mockReturnValue({
                text: '',
            }),
            tween: jest.fn().mockReturnValue({
                to: jest.fn().mockReturnValue({
                    start: jest.fn(),
                }),
            }),
        },
        physics: {
            enable: jest.fn(),
            arcade: {
                collide: jest.fn(),
                overlap: jest.fn(),
                enableBody: jest.fn(),
            },
        },
        input: {
            keyboard: {
                createCursorKeys: jest.fn().mockReturnValue({
                    up: { isDown: false },
                    down: { isDown: false },
                    left: { isDown: false },
                    right: { isDown: false },
                }),
                addKey: jest.fn().mockReturnValue({
                    isDown: false,
                }),
            },
            onDown: {
                add: jest.fn(),
            },
            activePointer: {
                isDown: false,
            },
        },
        time: {
            reset: jest.fn(),
            events: {
                loop: jest.fn(),
                remove: jest.fn(),
            },
            totalElapsedSeconds: jest.fn().mockReturnValue(0),
        },
        rnd: {
            integerInRange: jest.fn().mockReturnValue(5),
        },
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
    })),
    AUTO: 'AUTO',
    Physics: {
        ARCADE: 'ARCADE',
    },
    Keyboard: {
        SPACEBAR: 32,
    },
};

// Mock performance API
global.performance = {
    now: jest.fn().mockReturnValue(Date.now()),
    memory: {
        usedJSHeapSize: 50 * 1024 * 1024, // 50MB
    },
};

// Mock console methods to avoid noise in tests
global.console = {
    ...console,
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
};

// Mock import.meta for ES modules
global.import = {
    meta: {
        env: {
            DEV: true,
            PROD: false,
        },
    },
};
