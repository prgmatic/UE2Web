import { WORD_WIDTH, OPCODE_WIDTH, ARG_MASK, WORD_MASK } from "./BitConstants";

export class DecodedInstruction {

    public instruction: number;

    public static create(opcode: number, argument: number): DecodedInstruction {
        const argWidth = (WORD_WIDTH - OPCODE_WIDTH);
        opcode &= (1 << OPCODE_WIDTH) - 1
        opcode <<= argWidth;
        argument &= ARG_MASK;
        return new DecodedInstruction(opcode | argument);
    }

    get opcode(): opcode {
        return this.instruction >>> (WORD_WIDTH - OPCODE_WIDTH);
    }

    get argument(): number {
        return this.instruction & ARG_MASK;
    }

    get memoryMode(): MemoryMoveType {
        return this.argument & ((1 << 2) - 1);
    }

    get registerDestination(): RegisterType {
        return (this.argument >> 3) & ((1 << 3) - 1);
    }

    get registerSource(): RegisterType {
        return (this.argument >> 6) & ((1 << 3) - 1);
    }

    constructor(instruction: number) {
        this.instruction = instruction & WORD_MASK;
    }
}

export enum MemoryMoveType {
    none = 0,
    inputToHoldingCell = 1,
    holdCellToOutput = 3
}

export enum RegisterType {
    accumulator,
    holdingCell,
    buffer,
    memoryAddress,
    programCounter
}
export enum opcode {
    branchIfZeroFlagDirect,
    branchIfLinkFlagDirect,
    loadAccumulator,
    loadMemoryAddress,
    add,
    and,
    nor,
    move
}
