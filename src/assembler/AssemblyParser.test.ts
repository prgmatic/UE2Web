import { describe, expect, it } from 'vitest';
import { AddressSpan, AssemblyParser } from './AssemblyParser';

describe('AssemblyParser.parseAssembledLine', () => {
    it('parses a valid line with binary values', () => {
        const line = "6:0 |   b1 | 011000010000110 010000011010101 111000000001000 111000000000011 ; MOI 213, 134";
        const result = AssemblyParser.parseAssembledLine(line);
        expect(result).toEqual({
            address: 0xb1,
            values: [
                parseInt('011000010000110', 2),
                parseInt('010000011010101', 2),
                parseInt('111000000001000', 2),
                parseInt('111000000000011', 2)
            ]
        });
    });

    it('returns null for malformed line with fewer than 3 pipe-separated parts', () => {
        const line = "bad line | missing | parts";
        const result = AssemblyParser.parseAssembledLine(line);
        expect(result).toBeNull();
    });

    it('returns null for non-hex address', () => {
        const line = "6:0 | notHex | 0110 ; comment";
        const result = AssemblyParser.parseAssembledLine(line);
        expect(result).toBeNull();
    });

    it('handles lines with no binary values', () => {
        const line = "6:0 | 1F | ; comment only";
        const result = AssemblyParser.parseAssembledLine(line);
        expect(result).toBeNull();
    });

    it('ignores single-bit "binary-like" values (less than 2 bits)', () => {
        const line = "6:0 | 2A | 1 0 11 101 ; mix of short bits";
        const result = AssemblyParser.parseAssembledLine(line);
        expect(result).toEqual({
            address: 0x2A,
            values: [
                parseInt('11', 2),
                parseInt('101', 2)
            ]
        });
    });
});


describe('AssemblyParser.parseAddressSpan', () => {
  it('parses a valid line correctly', () => {
    const input = '30:6 | 1a | asm:147:1:147:13';
    const result = AssemblyParser.parseAddressSpan(input, 0);

    const expected: AddressSpan = {
      address: 26, // 0x1a
      lineStart: 147,
      columnStart: 1,
      lineEnd: 147,
      columnEnd: 13,
    };

    expect(result).toEqual(expected);
  });

  it('returns null on missing parts', () => {
    const input = '30:6 | 1a'; // missing the third part
    const result = AssemblyParser.parseAddressSpan(input, 0);
    expect(result).toBeNull();
  });

  it('returns null on invalid address', () => {
    const input = '30:6 | ZZ | asm:147:1:147:13'; // invalid hex
    const result = AssemblyParser.parseAddressSpan(input, 0);
    expect(result).toBeNull();
  });

  it('returns null on malformed span', () => {
    const input = '30:6 | 1a | asm:147:1'; // not enough numbers
    const result = AssemblyParser.parseAddressSpan(input, 0);
    expect(result).toBeNull();
  });

  it('parses when source path has extra colons', () => {
    const input = '30:6 | 1a | some:file.asm:147:1:147:13';
    const result = AssemblyParser.parseAddressSpan(input, 0);

    expect(result).toEqual({
      address: 26,
      lineStart: 147,
      columnStart: 1,
      lineEnd: 147,
      columnEnd: 13,
    });
  });
});
