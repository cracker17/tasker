'use client';

import { Bold, Italic, List, Link } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter description...",
  className = "",
  disabled = false
}: RichTextEditorProps) {
  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.querySelector('.rich-text-editor textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);

    onChange(newText);

    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  return (
    <div className={`rich-text-editor ${className}`}>
      {/* Simple Toolbar */}
      <div className="flex items-center gap-1 p-2 border border-border rounded-t-lg bg-muted">
        <button
          type="button"
          onClick={() => insertMarkdown('**', '**')}
          className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-accent transition-colors"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('*', '*')}
          className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-accent transition-colors"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('- ')}
          className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-accent transition-colors"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('[', '](url)')}
          className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-accent transition-colors"
          title="Link"
        >
          <Link className="h-4 w-4" />
        </button>
      </div>

      {/* Textarea */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full min-h-[120px] p-4 border border-input rounded-b-lg resize-none bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        style={{ minHeight: '120px' }}
      />

      {/* Help Text */}
      <div className="text-xs text-muted-foreground mt-1">
        Use **bold**, *italic*, - lists, or [link](url) for formatting
      </div>
    </div>
  );
}