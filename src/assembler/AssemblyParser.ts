export type ParsedAssemblyLine = {
    address: number;
    values: number[];
}

export type AddressSpan = {
    address: number;
    lineStart: number;
    columnStart: number;
    lineEnd: number;
    columnEnd: number;
};


export class AssemblyParser{
    public static parseAssembledLine(line: string): ParsedAssemblyLine | null {
        const parts = line.split('|');
        if (parts.length < 3) return null;
    
        const addressHex = parts[1].trim();
        const address = parseInt(addressHex, 16);
        if (isNaN(address)) return null;
    
        const binaryMatches = parts[2].match(/\b[01]{2,}\b/g) || [];
        const values = binaryMatches.map(bin => parseInt(bin, 2));

        if(values.length == 0)
            return null;
    
        return { address, values };
    }

    public static parseAddressSpan(line: string, offset: number): AddressSpan | null {
        const parts = line.split('|');
        if (parts.length < 3) return null;
    
        const addressHex = parts[1].trim();
        const address = parseInt(addressHex, 16);
        if (isNaN(address)) return null;
    
        const match = parts[2].match(/(\d+):(\d+):(\d+):(\d+)/);
        if (!match) return null;
    
        // eslint-disable-next-line prefer-const
        let [, lineStart, columnStart, lineEnd, columnEnd] = match.map(Number);
        lineStart += 1 - offset;
        lineEnd += 1 - offset;

        return {
            address,
            lineStart,
            columnStart,
            lineEnd,
            columnEnd,
        };
    }    
}