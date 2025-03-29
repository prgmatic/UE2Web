export interface MemoryInterface {
    read(address: number): number;
    write(address: number, value: number): void;
    directWrite(address: number, value: number): void;
    latch(): void;
    clear(): void;
}