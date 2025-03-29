import { describe, it, expect } from 'vitest';
import { DecodedInstruction } from './DecodedInstruction';
import { WORD_WIDTH, OPCODE_WIDTH, ARG_MASK, WORD_MASK } from './BitConstants';

describe('DecodedInstruction', () => {
  it('creates instruction with proper encoding', () => {
    const opcode = 0b101; // 5
    const argument = 0b110011001; // 409
    const instruction = DecodedInstruction.create(opcode, argument);

    // Recalculate what the encoded value should be
    const argWidth = WORD_WIDTH - OPCODE_WIDTH;
    const expectedInstruction = ((opcode & ((1 << OPCODE_WIDTH) - 1)) << argWidth) | (argument & ((1 << argWidth) - 1));
    expect(instruction.instruction).toBe(expectedInstruction & WORD_MASK);
  });

  it('extracts opcode correctly', () => {
    const opcode = 0b011;
    const argument = 0;
    const instruction = DecodedInstruction.create(opcode, argument);
    expect(instruction.opcode).toBe(opcode);
  });

  it('extracts argument correctly', () => {
    const opcode = 0b000;
    const argument = 0b1010101010101010;
    const instruction = DecodedInstruction.create(opcode, argument);
    expect(instruction.argument).toBe(argument & ARG_MASK);
  });

  it('extracts memoryMode from argument (bits 0-1)', () => {
    const argument = 0b000000011; // memoryMode = 0b11 = 3
    const instruction = DecodedInstruction.create(0, argument);
    expect(instruction.memoryMode).toBe(0b11);
  });

  it('extracts registerDestination from argument (bits 3-5)', () => {
    const argument = 0b00111000; // registerDestination = 0b111 = 7
    const instruction = DecodedInstruction.create(0, argument);
    expect(instruction.registerDestination).toBe(0b111);
  });

  it('extracts registerSource from argument (bits 6-8)', () => {
    const argument = 0b111000000; // registerSource = 0b111 = 7
    const instruction = DecodedInstruction.create(0, argument);
    expect(instruction.registerSource).toBe(0b111);
  });

  it('masks instruction to WORD_MASK in constructor', () => {
    const overflow = (1 << WORD_WIDTH) | 0b101010101010101;
    const decoded = new DecodedInstruction(overflow);
    expect(decoded.instruction).toBe(overflow & WORD_MASK);
  });
});
