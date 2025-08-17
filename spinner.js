import cliSpinners from "cli-spinners";

// Custom spinner definition following cli-spinners format
const logAddSpinner = {
  interval: 120,
  frames: ["→   ", " →  ", "  → ", "   →", "   ✓"],
};

// Enhanced version with ease-out timing
const logAddSpinnerEaseOut = {
  // Base interval - will be modified for ease-out effect
  interval: 80,
  frames: ["→___", "-→__", "--→_", "---→", "---→", "---→", "---✓"],
  // Custom ease-out intervals for each frame (in milliseconds)
  easeOutIntervals: [80, 85, 95, 110, 130, 160, 500],
};

class LogAddSpinner {
  constructor(options = {}) {
    this.name = options.name || "Process";
    this.logPath = options.logPath || "/var/log/app.log";
    this.spinner = options.useEaseOut ? logAddSpinnerEaseOut : logAddSpinner;
    this.frameIndex = 0;
    this.isRunning = false;
    this.intervalId = null;
    this.startTime = null;

    // Terminal control sequences
    this.hideCursor = "\x1B[?25l";
    this.showCursor = "\x1B[?25h";
    this.clearLine = "\x1B[2K\r";
  }

  getCurrentFrame() {
    return this.spinner.frames[this.frameIndex] || "";
  }

  getNextInterval() {
    if (this.spinner.easeOutIntervals) {
      return (
        this.spinner.easeOutIntervals[this.frameIndex] || this.spinner.interval
      );
    }
    return this.spinner.interval;
  }

  formatOutput() {
    const frame = this.getCurrentFrame();
    return `${this.name.padEnd(15)} ${frame} ${this.logPath}`;
  }

  render() {
    if (!this.isRunning) return;

    // Clear current line and write new content
    process.stdout.write(this.clearLine + this.formatOutput());

    // Check if we've reached the end of frames
    if (this.frameIndex >= this.spinner.frames.length - 1) {
      // We're at the last frame (checkmark), show it and then stop
      setTimeout(() => {
        this.stop();
      }, this.getNextInterval());
      return;
    }

    this.frameIndex++;

    // Schedule next frame with appropriate timing
    const nextInterval = this.getNextInterval();
    this.intervalId = setTimeout(() => this.render(), nextInterval);
  }

  start() {
    if (this.isRunning) return this;

    this.isRunning = true;
    this.frameIndex = 0;
    this.startTime = Date.now();

    // Hide cursor for cleaner animation
    process.stdout.write(this.hideCursor);

    // Start the animation
    this.render();

    return this;
  }

  stop() {
    if (!this.isRunning) return this;

    this.isRunning = false;

    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }

    // Show final frame and restore cursor
    process.stdout.write(this.clearLine + this.formatOutput() + "\n");
    process.stdout.write(this.showCursor);

    return this;
  }

  // Method to manually set completion state
  succeed() {
    this.frameIndex = this.spinner.frames.length - 1; // Set to checkmark frame
    this.stop();
    return this;
  }
}

// Export the class as default
export default LogAddSpinner;

// Example usage:
/*
// Basic usage
const spinner1 = new LogAddSpinner({
  name: 'DatabaseSync',
  logPath: '/var/log/db-sync.log'
});

spinner1.start();

// Simulate async operation
setTimeout(() => {
  spinner1.stop();
}, 3000);

// With ease-out effect
const spinner2 = new LogAddSpinner({
  name: 'FileUpload',
  logPath: '/var/log/uploads.log',
  useEaseOut: true
});

spinner2.start();

// Example of integration with async operations
async function logOperation(operationName, logPath) {
  const spinner = new LogAddSpinner({
    name: operationName,
    logPath: logPath,
    useEaseOut: true
  });
  
  spinner.start();
  
  try {
    // Your async operation here
    await someAsyncOperation();
    spinner.succeed(); // Will show checkmark
  } catch (error) {
    spinner.stop();
    console.error(`Failed: ${error.message}`);
  }
}

// Multiple concurrent operations
async function multipleLogs() {
  const operations = [
    { name: 'APICall', path: '/var/log/api.log' },
    { name: 'CacheUpdate', path: '/var/log/cache.log' },
    { name: 'IndexRebuild', path: '/var/log/search.log' }
  ];
  
  const spinners = operations.map(op => 
    new LogAddSpinner({
      name: op.name,
      logPath: op.path,
      useEaseOut: true
    })
  );
  
  // Start all spinners
  spinners.forEach(s => s.start());
  
  // Simulate operations completing at different times
  setTimeout(() => spinners[0].succeed(), 1000);
  setTimeout(() => spinners[1].succeed(), 2000);
  setTimeout(() => spinners[2].succeed(), 3000);
}
*/
