
export const WORD_WIDTH: number = 15;
export const OPCODE_WIDTH: number = 3;
export const WORD_MASK = (1 << WORD_WIDTH) - 1;
export const ARG_MASK = (1 << (WORD_WIDTH - OPCODE_WIDTH)) - 1;
