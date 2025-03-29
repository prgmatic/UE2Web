import { describe, it, expect, beforeEach } from 'vitest';
import { Register } from './Register'; // adjust the import path as needed

describe('Register', () => {
    let reg: Register;

    beforeEach(() => {
        reg = new Register(4); // 4-bit register = max value 15 (0b1111)
    });

    it('initializes to 0', () => {
        expect(reg.value).toBe(0);
    });

    it('masks values correctly when setting', () => {
        reg.value = 0b11111111; // 255
        reg.latch();
        expect(reg.value).toBe(0b1111); // 15
    });

    it('does not latch immediately when setting value', () => {
        reg.value = 0b1010; // set, but not latched
        expect(reg.value).toBe(0); // still 0 until latch
    });

    it('latches value correctly', () => {
        reg.value = 0b0110;
        reg.latch();
        expect(reg.value).toBe(0b0110);
    });
});