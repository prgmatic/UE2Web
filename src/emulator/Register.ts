export class Register {
    public shortLabel: string;
    private mask: number;
    private _value: number = 0;
    private unlatchedValue: number = 0;

    get value(): number {
        return this._value;
    }

    set value(newValue: number) {
        this.unlatchedValue = newValue & this.mask;
    }

    constructor(public width: number, shortLabel: string) {
        this.mask = (1 << width) - 1;
        this.shortLabel = shortLabel;
    }

    public latch(): void {
        this._value = this.unlatchedValue;
    }
}
