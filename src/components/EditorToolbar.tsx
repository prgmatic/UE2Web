import React, { useRef } from 'react';

interface EditorToolbarProps {
  onLoad: (code: string) => void;
  getCode: () => string;
  examples: { label: string; code: string }[];
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onLoad,
  getCode,
  examples,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLSelectElement>(null);



  const handleLoad = () => {
    if (dropdownRef.current?.selectedOptions[0].value === "upload") {
      fileInputRef.current?.click();
    }
    else {
      onLoad(dropdownRef.current!.selectedOptions[0].value);
    }
  }

  const fileChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file)
      return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        onLoad(e.target.result);
      }
    };
    reader.readAsText(file);
  }

  const handleSave = async () => {
    const code = getCode();

    // Try native file save dialog (File System Access API)
    if ('showSaveFilePicker' in window) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handle = await (window as any).showSaveFilePicker({
          types: [
            {
              description: 'Text Files',
              accept: { 'text/plain': ['.txt', '.asm', '.s'] },
            },
          ],
        });

        const writable = await handle.createWritable();
        await writable.write(code);
        await writable.close();
        return;
      } catch (err) {
        console.error('Save cancelled or failed:', err);
      }
    }
  };

  return (
    <div className="flex items-center gap-4 px-4 py-2">
      {/* Drop down */}
      <select className="px-2 py-1 border rounded" defaultValue="" ref={dropdownRef}>
        {examples.map((ex, i) => (
          <option className='bg-neutral-900' key={i} value={ex.code}>
            {ex.label}
          </option>
        ))}
        <option className='bg-neutral-900' value="upload">
          Upload File...
        </option>
      </select>

      {/* File Upload */}
      <input type="file" accept=".txt,.asm,.s" className="hidden" onChange={fileChanged} ref={fileInputRef} />

      {/* Load Button */}
      <button
        onClick={handleLoad}
        className="px-3 py-1 bg-blue-800 hover:bg-blue-900 text-white rounded">
        Load
      </button>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="px-3 py-1 bg-blue-800 hover:bg-blue-900 text-white rounded">
        Save
      </button>
    </div>
  );
};

export default EditorToolbar;