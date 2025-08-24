'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type MarkdownProps = {
  content: string;
};

export function Markdown({ content }: MarkdownProps) {
  if (!content) return null;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className="prose prose-sm dark:prose-invert max-w-none"
      components={{
        h1: ({node, ...props}) => <h1 className="font-headline text-3xl" {...props} />,
        h2: ({node, ...props}) => <h2 className="font-headline text-2xl" {...props} />,
        h3: ({node, ...props}) => <h3 className="font-headline text-xl" {...props} />,
        p: ({node, ...props}) => <p className="font-body" {...props} />,
        ul: ({node, ...props}) => <ul className="list-disc pl-5 font-body" {...props} />,
        ol: ({node, ...props}) => <ol className="list-decimal pl-5 font-body" {...props} />,
        li: ({node, ...props}) => <li className="mb-2" {...props} />,
        a: ({node, ...props}) => <a className="text-primary hover:underline" {...props} />,
        blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary pl-4 italic" {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
