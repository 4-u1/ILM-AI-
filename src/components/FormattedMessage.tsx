import React from 'react';

interface FormattedMessageProps {
  content: string;
  isUser?: boolean;
}

export const FormattedMessage: React.FC<FormattedMessageProps> = ({ content, isUser = false }) => {
  if (!content) return null;

  // Split lines while maintaining empty lines for paragraph separation
  const lines = content.split('\n');

  // Helper to parse inline bolding (**text**) and other basic tokens
  const parseInline = (text: string) => {
    // Regex matches ***bold-italic*** or **bold** or *italic*
    // Matches **something** non-greedily
    const parts: React.ReactNode[] = [];
    // Regex that captures **...** and `...`
    const regex = /(\*\*\*[\s\S]+?\*\*\*|\*\*[\s\S]+?\*\*|`[^`]+`|«[^»]+»)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      // Add plain text before match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const raw = match[0];

      if (raw.startsWith('***') && raw.endsWith('***')) {
        const inner = raw.slice(3, -3).trim();
        parts.push(
          <strong key={match.index} className={`font-bold italic ${isUser ? 'text-white' : 'text-slate-950'}`}>
            {inner}
          </strong>
        );
      } else if (raw.startsWith('**') && raw.endsWith('**')) {
        const inner = raw.slice(2, -2).trim();
        parts.push(
          <strong key={match.index} className={`font-bold ${isUser ? 'text-amber-300' : 'text-slate-950'}`}>
            {inner}
          </strong>
        );
      } else if (raw.startsWith('`') && raw.endsWith('`')) {
        const inner = raw.slice(1, -1);
        parts.push(
          <code key={match.index} className="px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-800 text-[11px] font-mono">
            {inner}
          </code>
        );
      } else if (raw.startsWith('«') && raw.endsWith('»')) {
        parts.push(
          <span key={match.index} className={`font-serif tracking-normal ${isUser ? 'text-amber-200 font-semibold' : 'text-amber-950 font-bold'}`}>
            {raw}
          </span>
        );
      }

      lastIndex = match.index + raw.length;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  // Group lines into blocks (quotes, lists, paragraphs, horizontal rules)
  const elements: React.ReactNode[] = [];
  let blockquoteBuffer: string[] = [];

  const flushBlockquote = (key: number) => {
    if (blockquoteBuffer.length > 0) {
      elements.push(
        <div
          key={`quote-${key}`}
          className={`my-2 p-3 rounded-2xl border-s-4 font-serif text-xs sm:text-sm leading-relaxed ${
            isUser
              ? 'bg-white/10 border-amber-400 text-white'
              : 'bg-amber-50/80 border-amber-500 text-amber-950 shadow-2xs'
          }`}
        >
          {blockquoteBuffer.map((line, bIdx) => (
            <div key={bIdx} className={bIdx > 0 ? 'mt-1' : ''}>
              {parseInline(line)}
            </div>
          ))}
        </div>
      );
      blockquoteBuffer = [];
    }
  };

  lines.forEach((rawLine, idx) => {
    const trimmed = rawLine.trim();

    // Check for blockquote line: > text
    if (trimmed.startsWith('>')) {
      const quoteText = trimmed.replace(/^>\s*/, '');
      blockquoteBuffer.push(quoteText);
      return;
    }

    // Flush any pending blockquote when hitting a non-quote line
    flushBlockquote(idx);

    // Horizontal Rule: --- or ***
    if (/^(\-{3,}|\*{3,})$/.test(trimmed)) {
      elements.push(
        <hr
          key={`hr-${idx}`}
          className={`my-3 border-t ${isUser ? 'border-white/20' : 'border-slate-200'}`}
        />
      );
      return;
    }

    // Empty line / paragraph break
    if (trimmed === '') {
      elements.push(<div key={`space-${idx}`} className="h-2" />);
      return;
    }

    // Numbered list item: 1. or 2.
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numberedMatch) {
      const num = numberedMatch[1];
      const itemText = numberedMatch[2];
      elements.push(
        <div key={`num-${idx}`} className="flex items-start gap-2 my-1">
          <span
            className={`w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 ${
              isUser
                ? 'bg-white/20 text-white'
                : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}
          >
            {num}
          </span>
          <div className="flex-1 leading-relaxed">{parseInline(itemText)}</div>
        </div>
      );
      return;
    }

    // Bullet list item: * or -
    const bulletMatch = trimmed.match(/^[\*\-]\s+(.*)$/);
    if (bulletMatch) {
      const itemText = bulletMatch[1];
      elements.push(
        <div key={`bullet-${idx}`} className="flex items-start gap-2 my-1">
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 mt-2 ${
              isUser ? 'bg-amber-400' : 'bg-amber-600'
            }`}
          />
          <div className="flex-1 leading-relaxed">{parseInline(itemText)}</div>
        </div>
      );
      return;
    }

    // Normal paragraph line
    elements.push(
      <div key={`line-${idx}`} className="leading-relaxed">
        {parseInline(rawLine)}
      </div>
    );
  });

  // Flush any final quotes
  flushBlockquote(lines.length);

  return <div className="space-y-1">{elements}</div>;
};
