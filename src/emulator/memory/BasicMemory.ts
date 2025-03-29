import { MemoryInterface } from "./MemoryInterface"

type PendingWrite = {
    address: number, 
    value: number
};

export class BasicMemory implements MemoryInterface {
    private data:Uint16Array = new Uint16Array(0xFFF); // 4k words
    private pendingWrites: PendingWrite[] = [];

    read(address: number): number {
        if(address < 0 || address >= this.data.length)
            return 0;
        return this.data[address];
    }
    write(address: number, value: number): void {
        if(address < 0 || address >= this.data.length)
            return;
        this.pendingWrites.push( { address: address, value: value } );
    }

    directWrite(address: number, value: number): void {
        if(address < 0 || address >= this.data.length)
            return;
        this.data[address] = value;
    }

    latch(): void {
        for(const pendingWrite of this.pendingWrites)
            this.data[pendingWrite.address] = pendingWrite.value;
        this.pendingWrites.length = 0;
    }

    clear(): void{
        for (let i = 0; i < this.data.length; i++) {
            this.data[i] = 0;
        }
        this.pendingWrites.length = 0; 
    }

}