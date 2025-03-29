import { ArithmeticLogicUnit } from "./units/ArithmeticLogicUnit";
import { BasicMemory } from "./memory/BasicMemory";
import { ControlUnit } from "./units/ControlUnit";
import { DecodedInstruction } from "./DecodedInstruction";
import { InputOutputUnit } from "./units/InputOutputUnit";
import { RegisterMoveUnit } from "./units/RegisterMoveUnit";
import { Registers } from "./Registers";

export class UE2 {
    public registers: Registers = new Registers();
    public memory: BasicMemory = new BasicMemory();

    public step(): void{
        this.registers.programCounter.latch();
        const didJump = { value: false };
        const instruction = this.memory.read(this.registers.programCounter.value);
        this.executeInstruction(instruction, didJump);

        if(!didJump.value) {
            this.registers.programCounter.value += 1;
        }
    }

    public executeInstruction(instruction: number, didJump: {value: boolean}) {
        const decodedInstruction = new DecodedInstruction(instruction);

        ArithmeticLogicUnit.executeInstruction(decodedInstruction, this.registers);
        ControlUnit.executeInstruction(decodedInstruction, this.registers, didJump);
        RegisterMoveUnit.executeInstruction(decodedInstruction, this.registers, didJump);
        InputOutputUnit.executeInstruction(decodedInstruction, this.registers, this.memory);

        this.registers.latchAllButProgramCounter();
        this.memory.latch();
    }

    public reset(): void {
        this.registers.reset();
        this.memory.clear();
    }
}

