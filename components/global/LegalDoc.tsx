interface LegalDocProps {
  title: string;
  intro: string;
  updated: string;
  sections: { title: string; content: string }[];
  contactPrompt: string;
}

export function LegalDoc({ title, intro, updated, sections, contactPrompt }: LegalDocProps) {
  return (
    <article className="mx-auto w-full max-w-3xl py-12 md:py-20">
      <header className="rise border-b border-line pb-10">
        <h1 className="display text-[clamp(2.4rem,5vw,3.8rem)]">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">{intro}</p>
        <p className="mt-4 font-mono text-sm text-ink-3">Last updated {updated}</p>
      </header>

      <ol className="divide-y divide-line">
        {sections.map((s, i) => (
          <li key={s.title} className="reveal grid gap-3 py-9 md:grid-cols-[4rem_1fr]">
            <span className="font-mono text-sm text-ink-3">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h2 className="text-xl font-semibold">{s.title}</h2>
              <p className="mt-3 max-w-[65ch] leading-relaxed text-ink-2">{s.content}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="border-t border-line pt-8 text-ink-2">
        {contactPrompt}{" "}
        <a href="mailto:ashutoshswamy397@gmail.com" className="link font-medium">
          ashutoshswamy397@gmail.com
        </a>
      </p>
    </article>
  );
}
