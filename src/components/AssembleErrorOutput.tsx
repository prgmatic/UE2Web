import AnsiToHtml from 'ansi-to-html';

const ansiConverter = new AnsiToHtml();

interface AssembleErrorOutputProps {
    output: string;
    className?: string;
}

const CompileErrorOutput: React.FC<AssembleErrorOutputProps> = ({ output, className }) => {
    if (output.trim().length === 0) return null;

    const htmlOutput = ansiConverter.toHtml(output);

    return (
        <div
            className={`${className} bg-neutral-900 px-6 py-2 rounded font-mono text-sm text-left`}
            style={{ whiteSpace: 'pre-wrap' }}
            dangerouslySetInnerHTML={{ __html: htmlOutput }}
        />
    );
};

export default CompileErrorOutput;