import React from "react";
import { Register } from "../emulator/Register";

interface RegisterTableProperties {
    registers: { [name: string]: Register };
}

const RegisterTable: React.FC<RegisterTableProperties> = ({ registers }) => {
    const entries = Object.entries(registers);
    const midpoint = Math.ceil(entries.length / 2);
    const firstColumn = entries.slice(midpoint);
    const secondColumn = entries.slice(0, midpoint);

    return (
        <div className="pb-2 min-w-full flex items-start justify-evenly gap-4">
            {[firstColumn, secondColumn].map((column, colIdx) => (
                <table key={colIdx} className="text-sm w-24">
                    <tbody>
                        {column.map(([name, register]) => (
                            <tr key={name}>
                                <td className="font-medium text-left">{register.shortLabel}</td>
                                <td className="text-right">{register.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ))}
        </div>
    );
};

export default RegisterTable;