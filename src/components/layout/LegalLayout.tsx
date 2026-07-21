interface LegalSection {
  heading: string;
  body: string[];
}

interface LegalLayoutProps {
  title: string;
  updatedAt: string;
  intro: string;
  sections: LegalSection[];
}

export function LegalLayout({ title, updatedAt, intro, sections }: LegalLayoutProps) {
  return (
    <article className="container-content max-w-3xl pb-24 pt-32 md:pt-40">
      <span className="eyebrow">Legal</span>
      <h1 className="mt-4 text-4xl font-medium text-chocolate md:text-5xl">{title}</h1>
      <p className="mt-3 text-sm text-cafe/70">Última actualización: {updatedAt}</p>
      <p className="mt-8 text-pretty text-lg leading-relaxed text-cafe">{intro}</p>

      <div className="mt-10 space-y-10">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-2xl font-medium text-chocolate">{section.heading}</h2>
            {section.body.map((p, i) => (
              <p key={i} className="mt-3 text-pretty leading-relaxed text-cafe">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}
