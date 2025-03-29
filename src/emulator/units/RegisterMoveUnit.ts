import { DecodedInstruction, MemoryMoveType, RegisterType } from "../DecodedInstruction";
import { opcode } from "../DecodedInstruction";
import { Register } from "../Register";
import { Registers } from "../Registers";

export class RegisterMoveUnit {
    public static executeInstruction(instruction: DecodedInstruction, registers: Registers, didJump: {value: boolean}) {

        switch (instruction.opcode) {
            case opcode.move: {
                if(instruction.memoryMode != MemoryMoveType.none)
                    return;
                const source = this.getRegisterFromType(instruction.registerSource, registers);
                const destination = this.getRegisterFromType(instruction.registerDestination, registers);
                destination.value = source.value;
                if(instruction.registerDestination == RegisterType.programCounter)
                    didJump.value = true;
                else if(instruction.registerDestination == RegisterType.accumulator){
                    registers.zeroFlag.value = source.value == 0 ? 1 : 0;
                }
                break;
            }
            case opcode.loadAccumulator:
                registers.accumulator.value = instruction.argument;
                registers.zeroFlag.value = instruction.argument == 0 ? 1 : 0;
                break;
            case opcode.loadMemoryAddress:
                registers.memoryAddress.value = instruction.argument;
                break;
            
        }
    }

    private static getRegisterFromType(type: RegisterType, registers: Registers): Register {
        switch (type) {
            case RegisterType.accumulator:
                return registers.accumulator;
            case RegisterType.holdingCell:
                return registers.holdingCell;
            case RegisterType.buffer:
                return registers.buffer;
            case RegisterType.memoryAddress:
                return registers.memoryAddress;
            case RegisterType.programCounter:
                return registers.programCounter;
        }
    }
}