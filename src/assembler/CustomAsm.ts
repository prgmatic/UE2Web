import { MemoryInterface } from "../emulator/memory/MemoryInterface";
import { AddressSpan, AssemblyParser } from "./AssemblyParser";
import { CustomAsmExports, dropRustString, makeRustString, readRustString } from "./CustomAsmUtils";
import header from './AssemblyHeader.txt?raw'

export class CustomAsm {
    private exports!: CustomAsmExports;


    constructor() {
        const loadWasm = async () => {
            const response = await fetch('customasm.wasm');
            const bytes = await response.arrayBuffer();
            const result = await WebAssembly.instantiate(bytes);

            this.exports = result.instance.exports as unknown as CustomAsmExports;
            console.log('WASM loaded');
        };

        loadWasm().catch(console.error);

    }

    public assemble(code: string, memory: MemoryInterface, addressSpans: { [key: number]: AddressSpan }): { success: boolean, error: string, startAddress: number } {
        const headerLineCount = header.split(/\r\n|\r|\n/).length;

        code = header + code;

        const startAddressResult = this.extractStartAddress(code);
        let startAddress = 0;
        if(startAddressResult.success) {
            console.log("cool");
            code = startAddressResult.modifiedCode!;
            code = this.setCodeStartAddress(code, startAddressResult.address!);
            startAddress = startAddressResult.address!;
        }

        const asmPtr = makeRustString(this.exports, code);
        const formatPtr = makeRustString(this.exports, "annotated,base:2,group:15");
        const spanFormatPtr = makeRustString(this.exports, "addrspan");



        let outputPtr = null
        try {
            outputPtr = this.exports.wasm_assemble(formatPtr, asmPtr);
        }
        catch (e) {
            alert("Error assembling!\n\n" + e);
            throw e;
        }

        let spanPtr = null;
        try {
            spanPtr = this.exports.wasm_assemble(spanFormatPtr, asmPtr);
        }
        catch (e) {
            alert("Error assembling!\n\n" + e);
            throw e;
        }


        const output = readRustString(this.exports, outputPtr);
        const addressSpansString = readRustString(this.exports, spanPtr);

        dropRustString(this.exports, asmPtr);
        dropRustString(this.exports, formatPtr);
        dropRustString(this.exports, outputPtr);
        dropRustString(this.exports, spanPtr);

        

        if (output.trimStart().startsWith("\u001b[90m\u001b[1m\u001b[91merror:")) {
            return { success: false, error: output, startAddress: startAddress };
        }

        output.split(/\r?\n/).forEach((line: string) => {
            const data = AssemblyParser.parseAssembledLine(line);
            if (data != null) {
                data.values.forEach((value, index) => {
                    memory.directWrite(data.address + index, value);
                });
            }
        })


        for (const key in addressSpans)
            delete addressSpans[key];

        addressSpansString.split(/\r?\n/).forEach((line: string) => {
            const data = AssemblyParser.parseAddressSpan(line, headerLineCount - 1);
            if (data != null)
                addressSpans[data.address] = data;
        })

        return { success: true, error: "", startAddress: startAddress };
    }

    private extractStartAddress(code: string): { success: boolean, modifiedCode?: string, address?: number } {
        const regex = /^#start_address[ \t]+(0x[0-9a-fA-F]+|\d+)/m;
        const match = code.match(regex);

        if (match) {

            const valueRaw = match[1];
            const address = valueRaw.startsWith('0x')
                ? parseInt(valueRaw, 16)
                : parseInt(valueRaw, 10);

            console.log('Parsed Start Address:', address); 
            code = code.replace(regex, '');
            return { success: true, modifiedCode: code, address: address };
        } 
        console.log("fail");
        
        return { success: false };
    }

    private setCodeStartAddress(code: string, address: number): string {
        const size = 0xFF0 - address;
        code = code.replace(/#addr 0x0/, `#addr ${address}`);
        code = code.replace(/#size 0x0/, `#size ${size}`);
        return code;
    }
}