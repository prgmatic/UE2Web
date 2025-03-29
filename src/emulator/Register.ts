export class Register {
    public shortLabel: string;
    public get rwMode() { return this._rwMode };
    private mask: number;
    private _value: number = 0;
    private unlatchedValue: number = 0;
    private _rwMode: RegisterRwMode;

    get value(): number {
        return this._value;
    }

    set value(newValue: number) {
        this.unlatchedValue = newValue & this.mask;
    }

    constructor(public width: number, rwMode: RegisterRwMode = RegisterRwMode.ReadAndWrite, shortLabel: string = "") {
        this.mask = (1 << width) - 1;
        this.shortLabel = shortLabel;
        this._rwMode = rwMode;
    }

    public latch(): void {
        this._value = this.unlatchedValue;
    }
}

export enum RegisterRwMode {
    ReadAndWrite,
    WriteOnly,
    None
}
