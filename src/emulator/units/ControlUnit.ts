import { DecodedInstruction } from "../DecodedInstruction";
import { opcode } from "../DecodedInstruction";
import { Registers } from "../Registers";

export class ControlUnit {
    public static executeInstruction(instruction: DecodedInstruction, registers: Registers, didJump: { value: boolean }): void {
        switch (instruction.opcode) {
            case opcode.branchIfZeroFlagDirect:
                if(registers.zeroFlag.value){
                    didJump.value = true;
                    registers.programCounter.value = instruction.argument;
                }        
                break;
            case opcode.branchIfLinkFlagDirect:
                if(registers.carryFlag.value) {
                    didJump.value = true;
                    registers.programCounter.value = instruction.argument;
                }
                break;
        }
    }
}