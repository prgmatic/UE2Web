
export class Stepper {
    public get isRunning() { return this._isRunning; }
    public breakpoints: Set<number> = new Set<number>();

    public tickCount: number = 0;
    public tickRate: number = 10; // ticks per second
    private onUpdateCallback: (() => void)[] = [];
    private _isRunning: boolean = false;
    private onStepCallback: (() => boolean);

    private lastTime: number = 0;
    private tickRemainder = 0;

    constructor(onStepCallback: (() => boolean)){
        this.onStepCallback = onStepCallback;
    }

    public onUpdateEvent(callback: () => void) {
        this.onUpdateCallback.push(callback);
    }

    public singleStep() {
        if (this.isRunning) return;
        this.tickCount++;
        this.onStepCallback();
        this.emitUpdate();
    }

    public run() {
        if (this._isRunning) return;
        this._isRunning = true;
    
        this.lastTime = performance.now();
        this.tickRemainder = 0;
    
        const loop = () => {
          if (!this._isRunning) return;
    
          const now = performance.now();
          const delta = (now - this.lastTime) / 1000; // seconds
          this.lastTime = now;

          const secondsPerTick = 1 / this.tickRate;
    
          const ticksToRun = Math.floor((delta + this.tickRemainder) / secondsPerTick);
          this.tickRemainder = (delta + this.tickRemainder) % secondsPerTick;
    
          for (let i = 0; i < ticksToRun; i++) {
              this.tickCount++;
              if(!this.onStepCallback())
                break;
          }
    
          this.emitUpdate();
          requestAnimationFrame(loop);
        };
    
        requestAnimationFrame(loop); // 🔥 Starts the loop
      }

    public pause() {
        this._isRunning = false;
        this.emitUpdate();
    }

    public stop() {
        this.tickCount = 0;
        this._isRunning = false;
        this.emitUpdate();
    }

    public emitUpdate(): void {
        for (const callback of this.onUpdateCallback) {
            callback();
        }
    }
}