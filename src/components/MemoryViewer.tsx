import React from 'react';

interface MemoryViewerProps {
  readMemory: (addr: number) => number;
  className?: string;
  startAddress?: number;
  endAddress?: number;
  bytesPerRow?: number;
}

const MemoryViewer: React.FC<MemoryViewerProps> = ({
  readMemory,
  className,
  startAddress = 0x000,
  endAddress = 0xFFF,
  bytesPerRow = 4,
}) => {
  const rows = [];

  for (let addr = startAddress; addr <= endAddress; addr += bytesPerRow) {
    const row = [];
    for (let offset = 0; offset < bytesPerRow; offset++) {
      const value = readMemory(addr + offset);
      row.push(
        <td key={offset} className="px-2 font-mono text-sm text-right">
          {value.toString()}
        </td>
      );
    }

    rows.push(
      <tr key={addr}>
        <td className="pr-2 font-mono text-sm text-gray-500">
          {addr.toString(16).padStart(4, '0').toUpperCase()}:
        </td>
        {row}
      </tr>
    );
  }

  return (
    <div className={`${className} overflow-auto  border  rounded p-2`}>
      <table className="text-xs">
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};

export default MemoryViewer;
