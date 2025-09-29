// Performance monitoring utilities for Go Home Tanuki
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fps: 0,
      frameTime: 0,
      memoryUsage: 0,
      renderTime: 0,
    };
    this.isEnabled = false;
    this.frameCount = 0;
    this.lastTime = performance.now();
  }

  // Enable performance monitoring
  enable() {
    this.isEnabled = true;
    console.log('Performance monitoring enabled');
  }

  // Disable performance monitoring
  disable() {
    this.isEnabled = false;
    console.log('Performance monitoring disabled');
  }

  // Update FPS and frame time metrics
  updateFrameMetrics() {
    if (!this.isEnabled) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    
    this.frameCount++;
    
    // Calculate FPS every 60 frames
    if (this.frameCount % 60 === 0) {
      this.metrics.fps = Math.round(1000 / deltaTime);
      this.metrics.frameTime = deltaTime;
      
      // Log performance warnings
      if (this.metrics.fps < 30) {
        console.warn(`Low FPS detected: ${this.metrics.fps}fps`);
      }
      if (this.metrics.frameTime > 33) {
        console.warn(`High frame time: ${this.metrics.frameTime.toFixed(2)}ms`);
      }
    }
    
    this.lastTime = currentTime;
  }

  // Get current performance metrics
  getMetrics() {
    return { ...this.metrics };
  }

  // Log performance report
  logReport() {
    if (!this.isEnabled) return;
    
    console.log('=== Performance Report ===');
    console.log(`FPS: ${this.metrics.fps}`);
    console.log(`Frame Time: ${this.metrics.frameTime.toFixed(2)}ms`);
    console.log(`Memory Usage: ${(performance.memory?.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
    console.log('========================');
  }

  // Monitor memory usage
  updateMemoryMetrics() {
    if (!this.isEnabled || !performance.memory) return;
    
    this.metrics.memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024; // MB
    
    // Warn about high memory usage
    if (this.metrics.memoryUsage > 100) {
      console.warn(`High memory usage: ${this.metrics.memoryUsage.toFixed(2)}MB`);
    }
  }
}

// Create global performance monitor instance
const performanceMonitor = new PerformanceMonitor();

// Enable performance monitoring in development
if (import.meta.env.DEV) {
  performanceMonitor.enable();
  
  // Log performance report every 10 seconds
  setInterval(() => {
    performanceMonitor.logReport();
  }, 10000);
}

export default performanceMonitor;
