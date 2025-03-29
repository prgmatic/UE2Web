import { Register, RegisterRwMode } from "./Register";

export class Registers {
    accumulator   : Register = new Register(15, RegisterRwMode.ReadAndWrite, "ACR");
    holdingCell   : Register = new Register(15, RegisterRwMode.ReadAndWrite, "HCR");
    buffer        : Register = new Register(15, RegisterRwMode.ReadAndWrite, "BFR");
    memoryAddress : Register = new Register(12, RegisterRwMode.WriteOnly,    "MAR");
    programCounter: Register = new Register(12, RegisterRwMode.WriteOnly,    "PCR");
    zeroFlag      : Register = new Register( 1, RegisterRwMode.None,         "ZFlag");
    carryFlag     : Register = new Register( 1, RegisterRwMode.None,         "LFlag");

    public latch(): void {
        this.accumulator.latch();
        this.holdingCell.latch();
        this.buffer.latch();
        this.memoryAddress.latch();
        this.programCounter.latch();
        this.zeroFlag.latch();
        this.carryFlag.latch();
    }

    public latchAllButProgramCounter(): void {
        this.accumulator.latch();
        this.holdingCell.latch();
        this.buffer.latch();
        this.memoryAddress.latch();
        this.zeroFlag.latch();
        this.carryFlag.latch();
    }

    public reset(): void {
        this.accumulator.value = 0;
        this.holdingCell.value = 0;
        this.buffer.value = 0;
        this.memoryAddress.value = 0;
        this.programCounter.value = 0;
        this.zeroFlag.value = 0;
        this.carryFlag.value = 0;

        this.latch();
    }
}
