export interface CustomAsmExports {
    wasm_string_new(length: number): number;
    wasm_string_set_byte(ptr: number, index: number, value: number): void;
    wasm_string_get_len(ptr: number): number;
    wasm_string_get_byte(ptr: number, index: number): number;
    wasm_string_drop(ptr: number): void;
    wasm_assemble(formatPtr: number, asmPtr: number): number;
}

export function makeRustString(wasm: CustomAsmExports, str: string): number {
    const bytes = window.TextEncoder ? new TextEncoder().encode(str) : stringToUtf8ByteArray(str);
    const ptr = wasm.wasm_string_new(bytes.length);

    for (let i = 0; i < bytes.length; i++)
        wasm.wasm_string_set_byte(ptr, i, bytes[i])
    return ptr
}


export function readRustString(wasm: CustomAsmExports, ptr: number): string {
    const len = wasm.wasm_string_get_len(ptr)
    const bytes = []

    for (let i = 0; i < len; i++)
        bytes.push(wasm.wasm_string_get_byte(ptr, i))
    return window.TextDecoder ? new TextDecoder("utf-8").decode(new Uint8Array(bytes)) : utf8ByteArrayToString(bytes);
}


export function dropRustString(wasm: CustomAsmExports, ptr: number): void {
    wasm.wasm_string_drop(ptr)
}


export function stringToUtf8ByteArray(str: string): number[] {
    const out: number[] = [];
    let p: number = 0;
    for (let i = 0; i < str.length; i++) {
        let c = str.charCodeAt(i)
        if (c < 128) {
            out[p++] = c
        } else if (c < 2048) {
            out[p++] = (c >> 6) | 192
            out[p++] = (c & 63) | 128
        } else if (
            ((c & 0xFC00) == 0xD800) && (i + 1) < str.length &&
            ((str.charCodeAt(i + 1) & 0xFC00) == 0xDC00)) {
            // Surrogate Pair
            c = 0x10000 + ((c & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF)
            out[p++] = (c >> 18) | 240
            out[p++] = ((c >> 12) & 63) | 128
            out[p++] = ((c >> 6) & 63) | 128
            out[p++] = (c & 63) | 128
        } else {
            out[p++] = (c >> 12) | 224
            out[p++] = ((c >> 6) & 63) | 128
            out[p++] = (c & 63) | 128
        }
    }
    return out
}

function utf8ByteArrayToString(bytes: number[]): string {
    const out = []
    let pos = 0, c = 0;
    while (pos < bytes.length) {
        const c1 = bytes[pos++]
        if (c1 < 128) {
            out[c++] = String.fromCharCode(c1)
        } else if (c1 > 191 && c1 < 224) {
            const c2 = bytes[pos++]
            out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63)
        } else if (c1 > 239 && c1 < 365) {
            // Surrogate Pair
            const c2 = bytes[pos++]
            const c3 = bytes[pos++]
            const c4 = bytes[pos++]
            const u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 0x10000
            out[c++] = String.fromCharCode(0xD800 + (u >> 10))
            out[c++] = String.fromCharCode(0xDC00 + (u & 1023))
        } else {
            const c2 = bytes[pos++]
            const c3 = bytes[pos++]
            out[c++] =
                String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63)
        }
    }
    return out.join('')
}