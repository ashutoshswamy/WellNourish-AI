"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function MarkdownRenderer({
  content,
  className = "",
  size = "md",
}: MarkdownRendererProps) {
  // Debug log
  console.log("MarkdownRenderer - Content:", content);
  console.log("MarkdownRenderer - Content length:", content?.length);

  const sizeClasses = {
    sm: {
      prose: "prose-sm",
      h1: "text-lg font-bold mb-2",
      h2: "text-base font-semibold mb-2",
      h3: "text-sm font-medium mb-1",
      p: "mb-2 text-sm leading-relaxed",
      li: "text-sm",
      th: "text-xs",
      td: "text-xs",
    },
    md: {
      prose: "prose",
      h1: "text-xl font-bold mb-3",
      h2: "text-lg font-semibold mb-2",
      h3: "text-base font-medium mb-2",
      p: "mb-3 leading-relaxed",
      li: "text-sm",
      th: "text-sm",
      td: "text-sm",
    },
    lg: {
      prose: "prose-lg",
      h1: "text-2xl font-bold mb-4",
      h2: "text-xl font-semibold mb-3",
      h3: "text-lg font-medium mb-2",
      p: "mb-4 leading-relaxed",
      li: "",
      th: "text-sm",
      td: "text-sm",
    },
  };

  const styles = sizeClasses[size];

  // Handle empty or undefined content
  if (!content || content.trim() === "") {
    return (
      <div className="text-muted-foreground italic">No content available</div>
    );
  }

  return (
    <div
      className={`${styles.prose} max-w-none dark:prose-invert prose-slate ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className={`${styles.h1} text-foreground`}>{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className={`${styles.h2} text-foreground`}>{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className={`${styles.h3} text-foreground`}>{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-sm font-medium mb-1 text-foreground">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-sm font-medium mb-1 text-foreground">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-sm font-medium mb-1 text-foreground">
              {children}
            </h6>
          ),
          p: ({ children }) => (
            <p className={`${styles.p} text-foreground/90`}>{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 space-y-2 list-disc list-inside pl-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 space-y-2 list-decimal list-inside pl-4">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className={`${styles.li} text-foreground/90 mb-1`}>
              {children}
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-foreground/90">{children}</em>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/30 pl-4 my-3 italic text-foreground/80">
              {children}
            </blockquote>
          ),
          code: ({ children, ...props }) => {
            const inline = "inline" in props;
            return inline ? (
              <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono text-foreground">
                {children}
              </code>
            ) : (
              <code className="block bg-muted p-3 rounded text-sm font-mono text-foreground overflow-x-auto">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-muted p-3 rounded text-sm font-mono text-foreground overflow-x-auto mb-3">
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <table className="w-full border-collapse border border-border mb-3">
              {children}
            </table>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/50">{children}</thead>
          ),
          tbody: ({ children }) => <tbody>{children}</tbody>,
          th: ({ children }) => (
            <th
              className={`border border-border p-2 text-left font-semibold ${styles.th}`}
            >
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className={`border border-border p-2 ${styles.td}`}>
              {children}
            </td>
          ),
          hr: () => <hr className="my-4 border-border" />,
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-primary hover:text-primary/80 underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
