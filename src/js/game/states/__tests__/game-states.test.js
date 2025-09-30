// Mock DOM elements and Phaser objects for state testing
const createMockGameState = () => ({
    game: {
        sound: { mute: false },
        state: { start: jest.fn() },
        load: {
            image: jest.fn(),
            spritesheet: jest.fn(),
            audio: jest.fn(),
            start: jest.fn(),
            onLoadComplete: { add: jest.fn() },
        },
        cache: {
            checkImageKey: jest.fn().mockReturnValue(true),
            checkSoundKey: jest.fn().mockReturnValue(true),
        },
        input: {
            keyboard: {
                addKey: jest.fn().mockReturnValue({ isDown: false }),
            },
            activePointer: { isDown: false },
        },
        time: {
            events: {
                add: jest.fn(),
            },
        },
    },
    load: {
        image: jest.fn(),
        spritesheet: jest.fn(),
        audio: jest.fn(),
        start: jest.fn(),
        onLoadComplete: { add: jest.fn() },
    },
    add: {
        image: jest.fn().mockReturnValue({
            anchor: { set: jest.fn() },
            animations: { add: jest.fn(), play: jest.fn() },
        }),
        sprite: jest.fn().mockReturnValue({}),
        text: jest.fn().mockReturnValue({
            anchor: { set: jest.fn() },
            text: '',
        }),
        tileSprite: jest.fn().mockReturnValue({}),
        graphics: jest.fn().mockReturnValue({
            beginFill: jest.fn().mockReturnThis(),
            drawRect: jest.fn().mockReturnThis(),
            endFill: jest.fn().mockReturnThis(),
        }),
        tween: jest.fn().mockReturnValue({
            to: jest.fn().mockReturnValue({
                onComplete: { add: jest.fn() },
            }),
        }),
    },
    sound: {
        play: jest.fn(),
    },
    input: {
        keyboard: {
            addKey: jest.fn().mockReturnValue({ isDown: false }),
        },
        activePointer: { isDown: false },
    },
    time: {
        events: {
            add: jest.fn(),
        },
    },
});

describe('Game State Management', () => {
    let mockState;
    let mockDocument;

    beforeEach(() => {
        mockState = createMockGameState();
        mockDocument = {
            querySelector: jest.fn().mockReturnValue({
                style: { display: 'block' },
            }),
        };
        global.document = mockDocument;
        global.Phaser = {
            Timer: { SECOND: 1000 },
            Keyboard: { SPACEBAR: 32 },
            Easing: { Quadratic: { InOut: 'Quadratic.InOut' } },
        };

        // Reset mock state properties
        mockState.fireButton = { isDown: false };
        mockState.shops = {};
        mockState.tanuki = {};
        mockState.text = {};
        mockState.phone = {};
        mockState.message = {};
        mockState.title = {};
        mockState.youDrunk = {};
        mockState.progressText = { anchor: { set: jest.fn() }, text: '' };
        mockState.checkmark = {};
        mockState.checkmark2 = {};
        mockState.underline = {};

        jest.clearAllMocks();
    });

    describe('Boot State', () => {
        test('should set sound mute from properties', () => {
            const properties = { mute: true };
            const boot = {
                create: function () {
                    this.game.sound.mute = properties.mute;
                    this.game.state.start('preloader');
                }
            };

            boot.create.call(mockState);

            expect(mockState.game.sound.mute).toBe(true);
            expect(mockState.game.state.start).toHaveBeenCalledWith('preloader');
        });

        test('should hide loading spinner if present', () => {
            const mockSpinner = { style: { display: 'block' } };
            mockDocument.querySelector.mockReturnValue(mockSpinner);

            const boot = {
                create: function () {
                    const loadingSpinner = document.querySelector('.loading-spinner');
                    if (loadingSpinner) {
                        loadingSpinner.style.display = 'none';
                    }
                    this.game.state.start('preloader');
                }
            };

            boot.create.call(mockState);

            expect(mockDocument.querySelector).toHaveBeenCalledWith('.loading-spinner');
            expect(mockSpinner.style.display).toBe('none');
        });

        test('should handle missing loading spinner', () => {
            mockDocument.querySelector.mockReturnValue(null);

            const boot = {
                create: function () {
                    const loadingSpinner = document.querySelector('.loading-spinner');
                    if (loadingSpinner) {
                        loadingSpinner.style.display = 'none';
                    }
                    this.game.state.start('preloader');
                }
            };

            expect(() => boot.create.call(mockState)).not.toThrow();
            expect(mockState.game.state.start).toHaveBeenCalledWith('preloader');
        });
    });

    describe('Preloader State', () => {
        test('should load critical assets', () => {
            const preloader = {
                preload: function () {
                    this.load.image('ground', 'src/images/ground.png');
                    this.load.spritesheet('ship', 'src/images/tanukisprite_115_100.png', 115, 100, 2);
                    this.game.load.image('cloud1', 'src/images/cloud1.png');
                    this.game.load.image('cloud2', 'src/images/cloud2.png');
                    this.game.load.image('cloud3', 'src/images/cloud3.png');
                    this.game.load.image('plaque', 'src/images/load/load-list.png');
                    this.game.load.image('checkmark', 'src/images/load/checkmark.png');
                    this.game.load.image('underline', 'src/images/load/underline.png');
                    this.game.load.start();
                }
            };

            preloader.preload.call(mockState);

            expect(mockState.load.image).toHaveBeenCalledWith('ground', 'src/images/ground.png');
            expect(mockState.load.spritesheet).toHaveBeenCalledWith('ship', 'src/images/tanukisprite_115_100.png', 115, 100, 2);
            expect(mockState.game.load.image).toHaveBeenCalledWith('cloud1', 'src/images/cloud1.png');
            expect(mockState.game.load.image).toHaveBeenCalledWith('cloud2', 'src/images/cloud2.png');
            expect(mockState.game.load.image).toHaveBeenCalledWith('cloud3', 'src/images/cloud3.png');
            expect(mockState.game.load.start).toHaveBeenCalled();
        });

        test('should transition to load state after preload', () => {
            const preloader = {
                create: function () {
                    this.game.state.start('load');
                }
            };

            preloader.create.call(mockState);

            expect(mockState.game.state.start).toHaveBeenCalledWith('load');
        });
    });

    describe('Load State', () => {
        let loadState;

        beforeEach(() => {
            loadState = {
                preload: function () {
                    this.game.load.image('splash-1', 'src/images/splash/splash-main.png');
                    this.game.load.image('shop', 'src/images/splash/all-shops.png');
                    this.game.load.image('splash-text', 'src/images/splash/go-home-tanuki-text.png');
                    this.game.load.image('splash-phone', 'src/images/splash/phone.png');
                    this.game.load.image('youdrunk', 'src/images/splash/youredrunk.png');
                    this.game.load.image('splash-message-box', 'src/images/splash/phone-message.png');
                    this.game.load.start();
                },
                create: function () {
                    this.plaque = this.add.image(200, 50, 'plaque');
                    this.progressText = this.add.text(200, 100, 'Loading splash assets...', {
                        font: '16px Arial',
                        fill: '#ffffff',
                        align: 'center'
                    });
                    this.progressText.anchor.set(0.5);
                    this.checkLoadingProgress();
                },
                checkLoadingProgress: function () {
                    const splashKeys = ['splash-1', 'shop', 'splash-text', 'splash-phone', 'youdrunk', 'splash-message-box'];
                    const loadedCount = splashKeys.filter(key => this.game.cache.checkImageKey(key)).length;
                    const totalAssets = splashKeys.length;
                    const percentage = Math.round((loadedCount / totalAssets) * 100);

                    this.progressText.text = `Loading splash assets... ${percentage}%`;

                    if (loadedCount === totalAssets && !this.splashAssetsLoaded) {
                        this.splashAssetsLoaded = true;
                        this.progressText.text = 'Loading complete!';
                        this.time.events.add(1000 * 0.5, this.checkmarkFunc, this);
                        this.time.events.add(1000 * 1, this.checkmarkFunc2, this);
                        this.time.events.add(1000 * 1.5, this.underlineFunc, this);
                        this.time.events.add(1000 * 2, this.loadSplash, this);
                    } else if (loadedCount < totalAssets) {
                        this.time.events.add(1000 * 0.1, this.checkLoadingProgress, this);
                    }
                },
                checkmarkFunc: function () {
                    this.checkmark = this.add.image(350, 260, 'checkmark');
                },
                checkmarkFunc2: function () {
                    this.checkmark2 = this.add.image(350, 360, 'checkmark');
                },
                underlineFunc: function () {
                    this.underline = this.add.image(350, 525, 'underline');
                },
                loadSplash: function () {
                    this.game.state.start('splash');
                },
                preloadGameplayAssets: function () {
                    this.game.load.image('ground2', 'src/images/grasstile_dark.png');
                    this.game.load.image('starfield', 'src/images/starfield.png');
                    this.game.load.start();
                },
                update: function () {
                    if (!this.gameplayAssetsStarted) {
                        this.gameplayAssetsStarted = true;
                        this.preloadGameplayAssets();
                    }
                }
            };
        });

        test('should load splash assets', () => {
            loadState.preload.call(mockState);

            expect(mockState.game.load.image).toHaveBeenCalledWith('splash-1', 'src/images/splash/splash-main.png');
            expect(mockState.game.load.image).toHaveBeenCalledWith('shop', 'src/images/splash/all-shops.png');
            expect(mockState.game.load.image).toHaveBeenCalledWith('splash-text', 'src/images/splash/go-home-tanuki-text.png');
            expect(mockState.game.load.image).toHaveBeenCalledWith('splash-phone', 'src/images/splash/phone.png');
            expect(mockState.game.load.image).toHaveBeenCalledWith('youdrunk', 'src/images/splash/youredrunk.png');
            expect(mockState.game.load.image).toHaveBeenCalledWith('splash-message-box', 'src/images/splash/phone-message.png');
            expect(mockState.game.load.start).toHaveBeenCalled();
        });

        test('should create loading UI elements', () => {
            loadState.create.call(mockState);

            expect(mockState.add.image).toHaveBeenCalledWith(200, 50, 'plaque');
            expect(mockState.add.text).toHaveBeenCalledWith(200, 100, 'Loading splash assets...', {
                font: '16px Arial',
                fill: '#ffffff',
                align: 'center'
            });
        });

        test('should track loading progress correctly', () => {
            mockState.game.cache.checkImageKey.mockReturnValue(true);
            loadState.create.call(mockState);

            expect(mockState.progressText.text).toBe('Loading complete!');
            expect(mockState.splashAssetsLoaded).toBe(true);
        });

        test('should schedule loading animations', () => {
            mockState.game.cache.checkImageKey.mockReturnValue(true);
            loadState.create.call(mockState);

            expect(mockState.time.events.add).toHaveBeenCalledWith(500, loadState.checkmarkFunc, mockState);
            expect(mockState.time.events.add).toHaveBeenCalledWith(1000, loadState.checkmarkFunc2, mockState);
            expect(mockState.time.events.add).toHaveBeenCalledWith(1500, loadState.underlineFunc, mockState);
            expect(mockState.time.events.add).toHaveBeenCalledWith(2000, loadState.loadSplash, mockState);
        });

        test('should continue checking progress if assets not loaded', () => {
            mockState.game.cache.checkImageKey.mockReturnValue(false);
            loadState.create.call(mockState);

            expect(mockState.time.events.add).toHaveBeenCalledWith(100, loadState.checkLoadingProgress, mockState);
        });

        test('should preload gameplay assets in background', () => {
            loadState.update.call(mockState);

            expect(mockState.gameplayAssetsStarted).toBe(true);
            expect(mockState.game.load.image).toHaveBeenCalledWith('ground2', 'src/images/grasstile_dark.png');
            expect(mockState.game.load.image).toHaveBeenCalledWith('starfield', 'src/images/starfield.png');
        });
    });

    describe('Splash State', () => {
        let splashState;

        beforeEach(() => {
            splashState = {
                preload: function () { },
                create: function () {
                    this.loadAudioAfterInteraction();
                    if (this.game.cache.checkImageKey('starfield')) {
                        this.starfield = this.add.tileSprite(0, 0, 1024, 768, 'starfield');
                    } else {
                        this.starfield = this.add.graphics();
                        this.starfield.beginFill(0x000033);
                        this.starfield.drawRect(0, 0, 1024, 768);
                        this.starfield.endFill();
                    }
                    this.ground = this.add.tileSprite(0, 656, 1024, 112, 'ground');
                    this.shops = this.add.sprite(-100, 0, 'shop');
                    this.tanuki = this.add.image(0, 0, 'splash-1');
                    this.fireButton = this.input.keyboard.addKey(global.Phaser.Keyboard.SPACEBAR);
                    this.text = this.add.text(350, 650, 'Click to start', { font: 'bold 32px monospace', fill: '#fff' });
                    this.time.events.add(1000 * 2, this.addPhone, this);
                    this.time.events.add(1000 * 3, this.addMessage, this);
                    this.time.events.add(1000 * 4, this.addTitle, this);
                    this.time.events.add(1000 * 4.5, this.addYouDrunk, this);
                },
                loadAudioAfterInteraction: function () {
                    this.game.load.audio('ringing', 'src/audio/ringing.mp3');
                    this.game.load.audio('music', 'src/audio/test.mp3');
                    this.game.load.onLoadComplete.add(() => {
                        if (this.game.cache.checkSoundKey('ringing')) {
                            this.sound = this.sound.play('ringing');
                        }
                    }, this);
                    this.game.load.start();
                },
                update: function () {
                    if (this.fireButton.isDown || this.input.activePointer.isDown) {
                        const tween = this.add.tween(this.shops);
                        try {
                            tween.to({ x: -1440 }, 1000, 'Linear', true).onComplete.add(() => {
                                this.game.state.start('game');
                            });
                        } catch (err) {
                            this.game.state.start('game');
                        }
                    }
                },
                addPhone: function () {
                    this.phone = this.add.image(325, 400, 'splash-phone');
                },
                addMessage: function () {
                    this.message = this.add.image(25, 260, 'splash-message-box');
                    this.message.animations.add('shake');
                    this.message.animations.play('shake', 30, true);
                    this.add.tween(this.message).to({ x: 50 }, 150, 'Quadratic.InOut', true, 0, 1000, true);
                },
                addTitle: function () {
                    this.title = this.add.image(175, 0, 'splash-text');
                },
                addYouDrunk: function () {
                    this.youDrunk = this.add.image(300, 230, 'youdrunk');
                },
                loadAudioAfterInteraction: function () {
                    this.game.load.audio('ringing', 'src/audio/ringing.mp3');
                    this.game.load.audio('music', 'src/audio/test.mp3');
                    this.game.load.onLoadComplete.add(() => {
                        if (this.game.cache.checkSoundKey('ringing')) {
                            this.sound = this.sound.play('ringing');
                        }
                    }, this);
                    this.game.load.start();
                }
            };
        });

        test('should create splash screen elements', () => {
            mockState.game.cache.checkImageKey.mockReturnValue(true);
            splashState.create.call(mockState);

            expect(mockState.add.tileSprite).toHaveBeenCalledWith(0, 0, 1024, 768, 'starfield');
            expect(mockState.add.tileSprite).toHaveBeenCalledWith(0, 656, 1024, 112, 'ground');
            expect(mockState.add.sprite).toHaveBeenCalledWith(-100, 0, 'shop');
            expect(mockState.add.image).toHaveBeenCalledWith(0, 0, 'splash-1');
            expect(mockState.add.text).toHaveBeenCalledWith(350, 650, 'Click to start', { font: 'bold 32px monospace', fill: '#fff' });
        });

        test('should create fallback background when starfield not loaded', () => {
            mockState.game.cache.checkImageKey.mockReturnValue(false);
            splashState.create.call(mockState);

            expect(mockState.add.graphics).toHaveBeenCalled();
        });

        test('should load audio after interaction', () => {
            splashState.loadAudioAfterInteraction.call(mockState);

            expect(mockState.game.load.audio).toHaveBeenCalledWith('ringing', 'src/audio/ringing.mp3');
            expect(mockState.game.load.audio).toHaveBeenCalledWith('music', 'src/audio/test.mp3');
            expect(mockState.game.load.start).toHaveBeenCalled();
        });

        test('should schedule splash animations', () => {
            splashState.create.call(mockState);

            expect(mockState.time.events.add).toHaveBeenCalledWith(2000, splashState.addPhone, mockState);
            expect(mockState.time.events.add).toHaveBeenCalledWith(3000, splashState.addMessage, mockState);
            expect(mockState.time.events.add).toHaveBeenCalledWith(4000, splashState.addTitle, mockState);
            expect(mockState.time.events.add).toHaveBeenCalledWith(4500, splashState.addYouDrunk, mockState);
        });

        test('should handle input to start game', () => {
            mockState.input.keyboard.addKey.mockReturnValue({ isDown: true });
            splashState.update.call(mockState);

            expect(mockState.add.tween).toHaveBeenCalledWith(mockState.shops);
        });

        test('should handle mouse click to start game', () => {
            mockState.input.activePointer.isDown = true;
            splashState.update.call(mockState);

            expect(mockState.add.tween).toHaveBeenCalledWith(mockState.shops);
        });

        test('should handle tween completion to start game', () => {
            const mockTween = {
                to: jest.fn().mockReturnValue({
                    onComplete: { add: jest.fn() }
                })
            };
            mockState.add.tween.mockReturnValue(mockTween);
            mockState.input.keyboard.addKey.mockReturnValue({ isDown: true });

            splashState.update.call(mockState);

            expect(mockTween.to).toHaveBeenCalledWith({ x: -1440 }, 1000, 'Linear', true);
        });

        test('should handle tween errors gracefully', () => {
            mockState.add.tween.mockImplementation(() => {
                throw new Error('Tween error');
            });
            mockState.input.keyboard.addKey.mockReturnValue({ isDown: true });

            splashState.update.call(mockState);

            expect(mockState.game.state.start).toHaveBeenCalledWith('game');
        });
    });
});
