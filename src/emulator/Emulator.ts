import { AddressSpan } from "../assembler/AssemblyParser";
import { CustomAsm } from "../assembler/CustomAsm";
import { Stepper } from "./Stepper";
import { UE2 } from "./ue2";
import { Range } from "monaco-editor";

export class Emulator {

    public get computer() { return this._computer; };
    public set code(value: string) {
        this.stop();
        this._code = value;
    }
    public get breakpoints() { return this._breakpoints }
    public get isRunning() { return this.stepper.isRunning }
    public get isAssembled() { return this._isAssembled }
    public get tickRate() { return this.stepper.tickRate }
    public set tickRate(value: number) { this.stepper.tickRate = value; }
    public get tickCount() { return this.stepper.tickCount; }
    public get error() { return this._error; }

    private _computer: UE2 = new UE2();
    private stepper: Stepper;
    private assembler: CustomAsm = new CustomAsm();
    private addressSpans: { [key: number]: AddressSpan } = [];
    private _breakpoints: Set<number> = new Set<number>();
    private _isAssembled: boolean = false;
    private _code: string | null = null;
    private _error: string = "";

    constructor() {
        this.stepper = new Stepper(this.onStepped.bind(this));
    }

    public singleStep(): void {
        if (this._isAssembled || this.assemble()) {
            this.stepper.singleStep();
        }
    }

    public run(): void {
        if (this._isAssembled || this.assemble()) {
            this.stepper.run();
        }
    }

    public stop(): void {
        this.computer.reset();
        this._isAssembled = false;
        this.stepper.stop();
    }

    public pause(): void {
        this.stepper.pause();
    }

    public getLineHighlightRange(): Range | undefined {
        if (!this._isAssembled)
            return undefined;
        const span = this.addressSpans[this.computer.registers.programCounter.value];
        if (span == null)
            return undefined;
        else {
            return new Range(span.lineStart, span.columnStart, span.lineEnd, span.lineEnd);
        }
    }

    public toggleBreakpoint(line: number): void {
        if (this._breakpoints.has(line))
            this._breakpoints.delete(line);
        else
            this._breakpoints.add(line);
    }

    public onStateUpdated(callback: () => void): void {
        this.stepper.onUpdateEvent(callback);
    };


    private onStepped(): boolean {
        this._computer.step();

        const span = this.addressSpans[this._computer.registers.programCounter.value];
        if (span && this.breakpoints.has(span.lineStart)) {
            this.stepper.pause();
            return false; // pause execution
        }
        return true; // continue execution
    }

    

    private assemble(): boolean {
        if (this._code == null)
            return false;
        const result = this.assembler.assemble(this._code, this.computer.memory, this.addressSpans);
        this._isAssembled = result.success;
        this._error = result.error;

        if(!result.success) {
            this.stepper.emitUpdate();
            return false;
        }
        this.computer.registers.programCounter.value = result.startAddress;
        this.computer.registers.programCounter.latch();

        return true;
    }
}