import { DecodedInstruction, MemoryMoveType } from "../DecodedInstruction";
import { opcode } from "../DecodedInstruction";
import { MemoryInterface } from "../memory/MemoryInterface";
import { Registers } from "../Registers";

export class InputOutputUnit {
    public static executeInstruction(instruction: DecodedInstruction, registers: Registers, memoryInterface: MemoryInterface) {
        if(instruction.opcode != opcode.move)
            return;

        if(instruction.memoryMode == MemoryMoveType.inputToHoldingCell) {
            registers.holdingCell.value = memoryInterface.read(registers.memoryAddress.value);
        }

        if(instruction.memoryMode == MemoryMoveType.holdCellToOutput) {
            memoryInterface.write(registers.memoryAddress.value, registers.holdingCell.value);
        }
    }
}