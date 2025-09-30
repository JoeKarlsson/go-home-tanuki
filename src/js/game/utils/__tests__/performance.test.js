import PerformanceMonitor from '../performance.js';

describe('PerformanceMonitor', () => {
    let performanceMonitor;

    beforeEach(() => {
        performanceMonitor = new PerformanceMonitor();
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        test('should initialize with default values', () => {
            expect(performanceMonitor.metrics).toEqual({
                fps: 0,
                frameTime: 0,
                memoryUsage: 0,
                renderTime: 0,
            });
            expect(performanceMonitor.isEnabled).toBe(false);
            expect(performanceMonitor.frameCount).toBe(0);
            expect(typeof performanceMonitor.lastTime).toBe('number');
        });
    });

    describe('enable', () => {
        test('should enable performance monitoring', () => {
            performanceMonitor.enable();

            expect(performanceMonitor.isEnabled).toBe(true);
            expect(console.log).toHaveBeenCalledWith('Performance monitoring enabled');
        });
    });

    describe('disable', () => {
        test('should disable performance monitoring', () => {
            performanceMonitor.disable();

            expect(performanceMonitor.isEnabled).toBe(false);
            expect(console.log).toHaveBeenCalledWith('Performance monitoring disabled');
        });
    });

    describe('updateFrameMetrics', () => {
        beforeEach(() => {
            performanceMonitor.enable();
            performance.now.mockReturnValue(1000);
        });

        test('should not update metrics when disabled', () => {
            performanceMonitor.disable();
            performanceMonitor.updateFrameMetrics();

            expect(performanceMonitor.metrics.fps).toBe(0);
            expect(performanceMonitor.metrics.frameTime).toBe(0);
        });

        test('should increment frame count', () => {
            performanceMonitor.updateFrameMetrics();

            expect(performanceMonitor.frameCount).toBe(1);
        });

        test('should calculate FPS every 60 frames', () => {
            // Mock performance.now to return different values
            performance.now
                .mockReturnValueOnce(1000)  // First call
                .mockReturnValueOnce(1016);  // Second call (16ms later = ~60fps)

            // Call updateFrameMetrics 60 times
            for (let i = 0; i < 60; i++) {
                performanceMonitor.updateFrameMetrics();
            }

            expect(performanceMonitor.metrics.fps).toBe(62); // 1000/16 ≈ 62fps
            expect(performanceMonitor.metrics.frameTime).toBe(16);
        });

        test('should warn about low FPS', () => {
            performance.now
                .mockReturnValueOnce(1000)
                .mockReturnValueOnce(1100); // 100ms = 10fps

            for (let i = 0; i < 60; i++) {
                performanceMonitor.updateFrameMetrics();
            }

            expect(console.warn).toHaveBeenCalledWith('Low FPS detected: 10fps');
        });

        test('should warn about high frame time', () => {
            performance.now
                .mockReturnValueOnce(1000)
                .mockReturnValueOnce(1100); // 100ms frame time

            for (let i = 0; i < 60; i++) {
                performanceMonitor.updateFrameMetrics();
            }

            expect(console.warn).toHaveBeenCalledWith('High frame time: 100.00ms');
        });
    });

    describe('getMetrics', () => {
        test('should return a copy of metrics', () => {
            performanceMonitor.metrics.fps = 60;
            performanceMonitor.metrics.frameTime = 16;

            const metrics = performanceMonitor.getMetrics();

            expect(metrics).toEqual({
                fps: 60,
                frameTime: 16,
                memoryUsage: 0,
                renderTime: 0,
            });

            // Should be a copy, not a reference
            metrics.fps = 30;
            expect(performanceMonitor.metrics.fps).toBe(60);
        });
    });

    describe('logReport', () => {
        test('should not log when disabled', () => {
            performanceMonitor.disable();
            performanceMonitor.logReport();

            expect(console.log).not.toHaveBeenCalled();
        });

        test('should log performance report when enabled', () => {
            performanceMonitor.enable();
            performanceMonitor.metrics.fps = 60;
            performanceMonitor.metrics.frameTime = 16.67;

            performanceMonitor.logReport();

            expect(console.log).toHaveBeenCalledWith('=== Performance Report ===');
            expect(console.log).toHaveBeenCalledWith('FPS: 60');
            expect(console.log).toHaveBeenCalledWith('Frame Time: 16.67ms');
            expect(console.log).toHaveBeenCalledWith('Memory Usage: 50.00MB');
            expect(console.log).toHaveBeenCalledWith('========================');
        });
    });

    describe('updateMemoryMetrics', () => {
        test('should not update when disabled', () => {
            performanceMonitor.disable();
            performanceMonitor.updateMemoryMetrics();

            expect(performanceMonitor.metrics.memoryUsage).toBe(0);
        });

        test('should update memory usage when enabled', () => {
            performanceMonitor.enable();
            performanceMonitor.updateMemoryMetrics();

            expect(performanceMonitor.metrics.memoryUsage).toBe(50); // 50MB from mock
        });

        test('should warn about high memory usage', () => {
            // Mock high memory usage
            global.performance.memory.usedJSHeapSize = 150 * 1024 * 1024; // 150MB

            performanceMonitor.enable();
            performanceMonitor.updateMemoryMetrics();

            expect(console.warn).toHaveBeenCalledWith('High memory usage: 150.00MB');
        });

        test('should handle missing performance.memory', () => {
            const originalMemory = global.performance.memory;
            delete global.performance.memory;

            performanceMonitor.enable();
            performanceMonitor.updateMemoryMetrics();

            expect(performanceMonitor.metrics.memoryUsage).toBe(0);

            // Restore original
            global.performance.memory = originalMemory;
        });
    });

    describe('integration tests', () => {
        test('should work with multiple updates', () => {
            performanceMonitor.enable();

            // Simulate multiple frame updates
            performance.now
                .mockReturnValueOnce(1000)
                .mockReturnValueOnce(1016)
                .mockReturnValueOnce(1032)
                .mockReturnValueOnce(1048);

            for (let i = 0; i < 120; i++) { // 2 cycles of 60 frames
                performanceMonitor.updateFrameMetrics();
            }

            expect(performanceMonitor.frameCount).toBe(120);
            expect(performanceMonitor.metrics.fps).toBeGreaterThan(0);
        });

        test('should handle rapid enable/disable cycles', () => {
            performanceMonitor.enable();
            performanceMonitor.disable();
            performanceMonitor.enable();

            expect(performanceMonitor.isEnabled).toBe(true);
        });
    });
});
