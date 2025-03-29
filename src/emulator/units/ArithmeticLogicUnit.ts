import { WORD_WIDTH } from "../BitConstants";
import { DecodedInstruction } from "../DecodedInstruction";
import { opcode } from "../DecodedInstruction";
import { Registers } from "../Registers";

export class ArithmeticLogicUnit {

    public static executeInstruction(instruction: DecodedInstruction, registers: Registers): void {
        switch(instruction.opcode)
        {
            case opcode.add: {
                const carryIn = instruction.argument & 1 ? registers.carryFlag.value : 0;
                const addResult = this.fullAdder(WORD_WIDTH, registers.accumulator.value, registers.holdingCell.value, carryIn);
                registers.accumulator.value = addResult.sum;
                registers.zeroFlag.value = addResult.sum == 0 ? 1 : 0;
                registers.carryFlag.value = addResult.carryOut;
                break;
            }
            case opcode.and: {
                const andResult = registers.accumulator.value & registers.holdingCell.value;
                registers.accumulator.value = andResult;
                registers.zeroFlag.value = andResult == 0 ? 1 : 0;
                break;
            }
            case opcode.nor: {
                const norResult = ~(registers.accumulator.value | registers.holdingCell.value);
                registers.accumulator.value = norResult;
                registers.zeroFlag.value = norResult == 0 ? 1 : 0;
                break;
            }

        }
    }

    public static fullAdder(bitWidth: number, a: number, b: number, carryIn: number): { sum: number, carryOut: number } {
        const resultMask = (1 << bitWidth) - 1;
        const result = a + b + carryIn;
        const sum = result & resultMask;
        const carry = (result & ~(resultMask)) > 0 ? 1 : 0;      
        return { sum, carryOut: carry };
    }
}