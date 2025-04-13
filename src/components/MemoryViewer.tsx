import { FixedSizeList as List, ListChildComponentProps } from 'react-window';

interface MemoryViewerProps {
  readMemory: (addr: number) => number;
  className?: string;
  startAddress?: number;
  endAddress?: number;
  valuesPerRow?: number;
  rowHeight?: number;
}

const MemoryViewer: React.FC<MemoryViewerProps> = ({
  readMemory,
  className = "",
  startAddress = 0x0000,
  endAddress = 0x0FFF,
  valuesPerRow = 4,
  rowHeight = 24,
}) => {
  const totalRows = Math.ceil((endAddress - startAddress + 1) / valuesPerRow);

  const Row = ({ index, style }: ListChildComponentProps) => {
    const rowStartAddr = startAddress + index * valuesPerRow;
    const cells = [];

    for (let offset = 0; offset < valuesPerRow; offset++) {
      const addr = rowStartAddr + offset;
      if (addr > endAddress) break;
      const value = readMemory(addr);
      cells.push(
        <td key={offset} className="flex-1 px-2 font-mono text-sm text-right">
          {value.toString()}
        </td>
      );
    }

    return (
      <tr style={style}>
        <td className="pr-2 text-sm text-gray-500 font-mono">
          {rowStartAddr.toString(16).padStart(4, '0').toUpperCase()}:
        </td>
        {cells}
      </tr>
    );
  };

  return (
    // <div className={`${className ?? ""} table border rounded p-2`}>
    // <table className="text-xs w-full">
    //   <tbody className='w-full'>{rows}</tbody>

    <div className={`${className ?? ""} table border rounded p-2`}>
      <table className="text-xs w-full border-separate border-spacing-0">
        <tbody>
          <List
            height={400} // You can make this a prop too
            itemCount={totalRows}
            itemSize={rowHeight}
            width="100%"
          >
            {Row}
          </List>
        </tbody>
      </table>
    </div>
  );
};

export default MemoryViewer;
