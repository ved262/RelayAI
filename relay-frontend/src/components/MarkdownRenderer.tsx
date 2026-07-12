import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface IMarkdownRendererProps{
    content: string;
}

function MarkdownRenderer({content}:IMarkdownRendererProps){
    return (
        <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
    )
}

export default MarkdownRenderer;