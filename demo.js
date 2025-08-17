import LogAddSpinner from "./spinner.js";

console.log("Running ease-out spinner 20 times in a loop...\n");

class LoopingSpinner extends LogAddSpinner {
  constructor(options = {}) {
    super(options);
    this.loopCount = 0;
    this.maxLoops = options.maxLoops || 20;
    this.loopDelay = options.loopDelay || 300; // Delay between loops
  }

  stop() {
    if (!this.isRunning) return this;

    this.isRunning = false;

    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }

    // Show final frame
    process.stdout.write(this.clearLine + this.formatOutput());

    // Check if we should loop again
    this.loopCount++;
    if (this.loopCount < this.maxLoops) {
      // Reset and restart after delay
      setTimeout(() => {
        this.frameIndex = 0;
        this.start();
      }, this.loopDelay);
    } else {
      // Final completion
      process.stdout.write("\n");
      process.stdout.write(this.showCursor);
      console.log(`\nCompleted ${this.maxLoops} loops!`);
    }

    return this;
  }
}

// Create and start the looping spinner
const spinner = new LoopingSpinner({
  name: "LogWriter",
  logPath: "/var/log/app.log",
  useEaseOut: true,
  maxLoops: 20,
  loopDelay: 300, // 300ms delay between each loop
});

spinner.start();
