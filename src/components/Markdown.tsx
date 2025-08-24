// A simple component to render markdown content.
// For a production app, consider a more robust library like react-markdown.

type MarkdownProps = {
  content: string;
};

export function Markdown({ content }: MarkdownProps) {
  const sections = content.split(/(\n## |\n# )/).slice(1);
  const parsedContent = [];

  for (let i = 0; i < sections.length; i += 2) {
      const headingText = sections[i + 1].split('\n')[0];
      const headingLevel = sections[i].includes('##') ? 'h2' : 'h1';
      const body = sections[i + 1].substring(headingText.length).trim();
      parsedContent.push({
        heading: headingText,
        headingLevel,
        body
      });
  }

  if (parsedContent.length === 0) {
    // Fallback for content that doesn't start with a heading
    return (
       <div
        className="prose prose-sm dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }}
      />
    )
  }

  return (
    <article className="prose prose-sm dark:prose-invert max-w-none">
      {parsedContent.map((section, index) => (
        <div key={index}>
          {section.headingLevel === 'h1' ? <h1>{section.heading}</h1> : <h2>{section.heading}</h2>}
          {section.body.split('\n').map((line, lineIndex) => {
             if (line.trim().startsWith('* ')) {
                return <ul key={lineIndex}><li key={lineIndex}>{line.substring(2)}</li></ul>
             }
             return <p key={lineIndex}>{line}</p>
          })}
        </div>
      ))}
    </article>
  );
}
