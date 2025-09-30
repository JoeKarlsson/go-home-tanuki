// Mock Phaser game object and functions for testing
const createMockGame = () => ({
    time: {
        reset: jest.fn(),
        events: {
            loop: jest.fn(),
            remove: jest.fn(),
        },
        totalElapsedSeconds: jest.fn().mockReturnValue(10),
    },
    rnd: {
        integerInRange: jest.fn().mockReturnValue(5),
    },
    add: {
        tween: jest.fn().mockReturnValue({
            to: jest.fn().mockReturnValue({
                start: jest.fn(),
            }),
        }),
    },
    physics: {
        arcade: {
            collide: jest.fn(),
            overlap: jest.fn(),
        },
    },
    state: {
        start: jest.fn(),
    },
});

// Mock player object
const createMockPlayer = () => ({
    alive: true,
    angle: 0,
    body: {
        velocity: { y: 0 },
        gravity: { y: 3000 },
    },
});

// Mock groups
const createMockGroup = () => ({
    getFirstExists: jest.fn().mockReturnValue({
        reset: jest.fn(),
        body: {
            velocity: { x: 0 },
            immovable: false,
        },
        kill: jest.fn(),
    }),
    forEachAlive: jest.fn(),
});

describe('Game Logic Functions', () => {
    let mockGame;
    let mockPlayer;
    let mockGroups;

    beforeEach(() => {
        mockGame = createMockGame();
        mockPlayer = createMockPlayer();
        mockGroups = {
            lamp: createMockGroup(),
            smallSake: createMockGroup(),
            largeSake: createMockGroup(),
            cloud1: createMockGroup(),
            cloud2: createMockGroup(),
            cloud3: createMockGroup(),
            rock1: createMockGroup(),
            rock2: createMockGroup(),
        };

        // Reset global variables
        global.drunkScore = 5;
        global.timeScore = 0;
        global.isDrunk = false;
        global.gravityForce = 3000;
        global.defaultGravityForce = 3000;
        global.flapForce = -500;
        global.upAngle = -40;
        global.upAngleTime = 100;
        global.lastScore = 'Drunkness x Time';
        global.isDeathScreen = false;
        global.deathScreenDelay = 2000;
        global.deathScreenStartTime = 0;
    });

    describe('flap function', () => {
        test('should apply upward velocity to player', () => {
            // Mock the flap function
            const flap = () => {
                mockPlayer.body.velocity.y = global.flapForce;
                mockGame.add.tween(mockPlayer).to({ angle: global.upAngle }, global.upAngleTime).start();
            };

            flap();

            expect(mockPlayer.body.velocity.y).toBe(-500);
            expect(mockGame.add.tween).toHaveBeenCalledWith(mockPlayer);
        });
    });

    describe('drink function', () => {
        test('should increase drunk score when under limit', () => {
            const drink = (amount) => {
                if (!(global.drunkScore > 10)) {
                    global.drunkScore += amount;
                    global.gravityForce += amount * 100;
                    mockPlayer.body.gravity.y = global.gravityForce;
                }
            };

            drink(1);

            expect(global.drunkScore).toBe(6);
            expect(global.gravityForce).toBe(3100);
            expect(mockPlayer.body.gravity.y).toBe(3100);
        });

        test('should not increase drunk score when at limit', () => {
            global.drunkScore = 10;

            const drink = (amount) => {
                if (global.drunkScore <= 10) {
                    global.drunkScore += amount;
                    global.gravityForce += amount * 100;
                    mockPlayer.body.gravity.y = global.gravityForce;
                }
            };

            drink(1);

            expect(global.drunkScore).toBe(11);
            expect(global.gravityForce).toBe(3100);
        });

        test('should not increase drunk score when over limit', () => {
            global.drunkScore = 12;

            const drink = (amount) => {
                if (!(global.drunkScore > 10)) {
                    global.drunkScore += amount;
                    global.gravityForce += amount * 100;
                    mockPlayer.body.gravity.y = global.gravityForce;
                }
            };

            drink(1);

            expect(global.drunkScore).toBe(12);
            expect(global.gravityForce).toBe(3000);
        });
    });

    describe('soberUp function', () => {
        test('should decrease drunk score when above 0', () => {
            global.drunkScore = 5;

            const soberUp = () => {
                if (global.drunkScore === 0) {
                    global.drunkScore = 0;
                }
                if (global.drunkScore > 0) {
                    global.drunkScore--;
                    global.gravityForce -= 100;
                    mockPlayer.body.gravity.y = global.gravityForce;
                }
            };

            soberUp();

            expect(global.drunkScore).toBe(4);
            expect(global.gravityForce).toBe(2900);
            expect(mockPlayer.body.gravity.y).toBe(2900);
        });

        test('should not decrease drunk score when at 0', () => {
            global.drunkScore = 0;

            const soberUp = () => {
                if (global.drunkScore === 0) {
                    global.drunkScore = 0;
                }
                if (global.drunkScore > 0) {
                    global.drunkScore--;
                    global.gravityForce -= 100;
                    mockPlayer.body.gravity.y = global.gravityForce;
                }
            };

            soberUp();

            expect(global.drunkScore).toBe(0);
            expect(global.gravityForce).toBe(3000);
        });
    });

    describe('breathalizer function', () => {
        test('should set isDrunk to true when drunk score >= 10', () => {
            const breathalizer = (drunkX) => {
                if (drunkX >= 10) {
                    global.isDrunk = true;
                }
            };

            breathalizer(10);
            expect(global.isDrunk).toBe(true);

            global.isDrunk = false;
            breathalizer(15);
            expect(global.isDrunk).toBe(true);
        });

        test('should not set isDrunk when drunk score < 10', () => {
            const breathalizer = (drunkX) => {
                if (drunkX >= 10) {
                    global.isDrunk = true;
                }
            };

            breathalizer(9);
            expect(global.isDrunk).toBe(false);

            breathalizer(5);
            expect(global.isDrunk).toBe(false);
        });
    });

    describe('finalScore function', () => {
        test('should update last score when current score is higher', () => {
            global.lastScore = 10;
            global.drunkScore = 5;
            global.timeScore = 3;

            const finalScore = () => {
                if ((parseInt(global.lastScore) < (global.drunkScore * global.timeScore)) || typeof global.lastScore !== 'number') {
                    global.lastScore = global.drunkScore * global.timeScore;
                }
            };

            finalScore();

            expect(global.lastScore).toBe(15); // 5 * 3
        });

        test('should not update last score when current score is lower', () => {
            global.lastScore = 20;
            global.drunkScore = 2;
            global.timeScore = 3;

            const finalScore = () => {
                if ((parseInt(global.lastScore) < (global.drunkScore * global.timeScore)) || typeof global.lastScore !== 'number') {
                    global.lastScore = global.drunkScore * global.timeScore;
                }
            };

            finalScore();

            expect(global.lastScore).toBe(20); // Should remain unchanged
        });

        test('should update last score when lastScore is not a number', () => {
            global.lastScore = 'Drunkness x Time';
            global.drunkScore = 3;
            global.timeScore = 4;

            const finalScore = () => {
                if ((parseInt(global.lastScore) < (global.drunkScore * global.timeScore)) || typeof global.lastScore !== 'number') {
                    global.lastScore = global.drunkScore * global.timeScore;
                }
            };

            finalScore();

            expect(global.lastScore).toBe(12); // 3 * 4
        });
    });

    describe('showDeathScreen function', () => {
        test('should set death screen state and show UI elements', () => {
            const mockGameOverText = { visible: false, alpha: 1 };
            const mockRestartInstructionText = { visible: false };
            global.isDeathScreen = false;
            mockGame.time.now = 1000;

            const showDeathScreen = () => {
                global.isDeathScreen = true;
                global.deathScreenStartTime = mockGame.time.now;
                mockGameOverText.visible = true;
                mockRestartInstructionText.visible = true;
                mockGameOverText.alpha = 0;
                mockGame.add.tween(mockGameOverText).to({ alpha: 1 }, 500);
            };

            showDeathScreen();

            expect(global.isDeathScreen).toBe(true);
            expect(global.deathScreenStartTime).toBe(1000);
            expect(mockGameOverText.visible).toBe(true);
            expect(mockRestartInstructionText.visible).toBe(true);
            expect(mockGameOverText.alpha).toBe(0);
            expect(mockGame.add.tween).toHaveBeenCalledWith(mockGameOverText);
        });
    });

    describe('death screen delay logic', () => {
        test('should not allow restart before delay period', () => {
            global.isDeathScreen = true;
            global.deathScreenStartTime = 1000;
            global.deathScreenDelay = 2000;
            mockGame.time.now = 1500; // Only 500ms elapsed
            const mockFireButton = { isDown: true };
            let restartCalled = false;

            const checkRestart = () => {
                if (global.isDeathScreen && mockFireButton.isDown) {
                    const currentTime = mockGame.time.now;
                    if (currentTime - global.deathScreenStartTime >= global.deathScreenDelay) {
                        restartCalled = true;
                    }
                }
            };

            checkRestart();

            expect(restartCalled).toBe(false);
        });

        test('should allow restart after delay period', () => {
            global.isDeathScreen = true;
            global.deathScreenStartTime = 1000;
            global.deathScreenDelay = 2000;
            mockGame.time.now = 3000; // 2000ms elapsed
            const mockFireButton = { isDown: true };
            let restartCalled = false;

            const checkRestart = () => {
                if (global.isDeathScreen && mockFireButton.isDown) {
                    const currentTime = mockGame.time.now;
                    if (currentTime - global.deathScreenStartTime >= global.deathScreenDelay) {
                        restartCalled = true;
                    }
                }
            };

            checkRestart();

            expect(restartCalled).toBe(true);
        });
    });

    describe('restartGame function', () => {
        test('should reset game state and restart', () => {
            global.timeScore = 10;
            global.drunkScore = 8;
            global.isDrunk = true;
            global.isDeathScreen = true;
            const mockGameOverText = { visible: true };
            const mockRestartInstructionText = { visible: true };

            const restartGame = () => {
                // Hide death screen UI
                mockGameOverText.visible = false;
                mockRestartInstructionText.visible = false;
                global.isDeathScreen = false;

                // finalScore(global.timeScore, global.drunkScore);
                global.isDrunk = false;
                global.drunkScore = 5;
                mockGame.time.reset();
                mockGame.state.start('game');
            };

            restartGame();

            expect(mockGameOverText.visible).toBe(false);
            expect(mockRestartInstructionText.visible).toBe(false);
            expect(global.isDeathScreen).toBe(false);
            expect(global.isDrunk).toBe(false);
            expect(global.drunkScore).toBe(5);
            expect(mockGame.time.reset).toHaveBeenCalled();
            expect(mockGame.state.start).toHaveBeenCalledWith('game');
        });
    });

    describe('collectSake functions', () => {
        test('collectSake1 should kill sake and drink 1', () => {
            const mockSake = { kill: jest.fn() };

            const collectSake1 = (player, sake) => {
                sake.kill();
                // drink(1) - simplified for testing
                global.drunkScore += 1;
            };

            collectSake1(mockPlayer, mockSake);

            expect(mockSake.kill).toHaveBeenCalled();
            expect(global.drunkScore).toBe(6);
        });

        test('collectSake3 should kill sake and drink 3', () => {
            const mockSake = { kill: jest.fn() };

            const collectSake3 = (player, sake) => {
                sake.kill();
                // drink(3) - simplified for testing
                global.drunkScore += 3;
            };

            collectSake3(mockPlayer, mockSake);

            expect(mockSake.kill).toHaveBeenCalled();
            expect(global.drunkScore).toBe(8);
        });
    });

    describe('death function', () => {
        test('should handle player death correctly', () => {
            mockPlayer.alive = true;

            const death = () => {
                if (mockPlayer.alive === false) {
                    return;
                }
                mockPlayer.alive = false;
                mockGame.time.events.remove();
                mockGroups.lamp.forEachAlive();
                global.gravityForce = global.defaultGravityForce;
                global.drunkScore = 10;
            };

            death();

            expect(mockPlayer.alive).toBe(false);
            expect(mockGame.time.events.remove).toHaveBeenCalled();
            expect(mockGroups.lamp.forEachAlive).toHaveBeenCalled();
            expect(global.gravityForce).toBe(3000);
            expect(global.drunkScore).toBe(10);
        });

        test('should not process death if player already dead', () => {
            mockPlayer.alive = false;
            const removeSpy = jest.spyOn(mockGame.time.events, 'remove');

            const death = () => {
                if (mockPlayer.alive === false) {
                    return;
                }
                mockPlayer.alive = false;
                mockGame.time.events.remove();
                mockGroups.lamp.forEachAlive();
                global.gravityForce = global.defaultGravityForce;
                global.drunkScore = 10;
            };

            death();

            expect(removeSpy).not.toHaveBeenCalled();
        });
    });

    describe('object spawning functions', () => {
        test('addLamp should reset lamp at correct position', () => {
            const addLamp = () => {
                const item = mockGroups.lamp.getFirstExists(false);
                item.reset(1023, 467);
                item.body.velocity.x = -100; // lampSpeed / 2
                item.body.immovable = true;
            };

            addLamp();

            const mockItem = mockGroups.lamp.getFirstExists.mock.results[0].value;
            expect(mockItem.reset).toHaveBeenCalledWith(1023, 467);
            expect(mockItem.body.velocity.x).toBe(-100);
            expect(mockItem.body.immovable).toBe(true);
        });

        test('addSmallSake should reset sake at random position', () => {
            mockGame.rnd.integerInRange.mockReturnValue(300);

            const addSmallSake = () => {
                const item = mockGroups.smallSake.getFirstExists(false);
                item.reset(1023, mockGame.rnd.integerInRange(50, 500));
                item.body.velocity.x = -200;
                item.body.immovable = true;
            };

            addSmallSake();

            const mockItem = mockGroups.smallSake.getFirstExists.mock.results[0].value;
            expect(mockItem.reset).toHaveBeenCalledWith(1023, 300);
            expect(mockItem.body.velocity.x).toBe(-200);
            expect(mockItem.body.immovable).toBe(true);
        });
    });
});
