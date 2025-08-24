// A simple component to render markdown content.
// For a production app, consider a more robust library like react-markdown.

import React from 'react';

type MarkdownProps = {
  content: string;
};

// This regex helps split by markdown headers
const headerRegex = /(?:^|\n)(#{1,3})\s+(.*)/;

export function Markdown({ content }: MarkdownProps) {
  if (!content) return null;

  return (
    <div>
      {content.split(headerRegex).filter(Boolean).reduce((acc, item, index, arr) => {
        if (index % 3 === 0) {
          const type = arr[index];
          const title = arr[index + 1];
          const body = arr[index + 2];
          acc.push({ type, title, body });
        }
        return acc;
      }, [] as {type: string, title: string, body: string}[])
      .map((section, index) => {
        const HeadingTag = `h${section.type.length}` as keyof JSX.IntrinsicElements;
        const listItems = section.body?.split('\n').filter(line => line.trim().startsWith('* ') || line.trim().startsWith('- '));
        const paragraphs = section.body?.split('\n').filter(line => line.trim() && !line.trim().startsWith('* ') && !line.trim().startsWith('- '));

        return (
          <div key={index}>
            {section.title && <HeadingTag>{section.title}</HeadingTag>}
            {paragraphs && paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            {listItems && listItems.length > 0 && (
              <ul>
                {listItems.map((li, i) => <li key={i}>{li.substring(2)}</li>)}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
