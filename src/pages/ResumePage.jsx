import { getResumeData } from "../resume/getResumeData";
import "../styles/resume.css";

function Section({ title, children }) {
  return (
    <section className="rSection">
      <h2 className="rH2">{title}</h2>
      <div className="rSectionBody">{children}</div>
    </section>
  );
}

function ProjectTitle({ title, sourceUrl, tags }) {
  const top = (
    <div className="rItemTop">
      <div className="rItemTitle">{title}</div>
      {tags?.length ? (
        <div className="rItemMeta">{tags.slice(0, 4).join(" · ")}</div>
      ) : null}
    </div>
  );

  return sourceUrl ? (
    <a className="rMiniLink" href={sourceUrl}>
      {top}
    </a>
  ) : (
    top
  );
}

export default function ResumePage() {
  const {
    header = {},
    skills = [],
    projects = [],
    work = [],
    education = [],
    summary = "",
  } = getResumeData();

  const { links = [] } = header;

  return (
    <main className="rPage">
      <header className="rTop">
        <div>
          <h1 className="rName">{header.name ?? "Your Name"}</h1>
          <div className="rTitle">{header.title ?? ""}</div>

          <div className="rContactLine">
            {header.location ? <span>{header.location}</span> : null}
            {header.email ? <span className="dot">•</span> : null}
            {header.email ? <span>{header.email}</span> : null}
            {links.length ? <span className="dot">•</span> : null}
            {links.map((l) => (
              <a key={l.url} href={l.url} className="rLink">
                {l.label}
              </a>
            ))}
          </div>
        </div>

        <button className="rBtn noPrint" onClick={() => window.print()}>
          Download PDF
        </button>
      </header>

      <div className="rGrid">
        <div className="rMain">
          <Section title="Summary">
            <p className="rP">{summary}</p>
          </Section>

          <Section title="Key Projects">
            <div className="rList">
              {projects.map((p) => (
                <div key={p.id ?? p.title} className="rItem">
                  <ProjectTitle
                    title={p.title}
                    sourceUrl={p.sourceUrl}
                    tags={p.tags}
                  />

                  {p.subtitle ? (
                    <div className="rItemSub">{p.subtitle}</div>
                  ) : null}
                  {p.description ? (
                    <div className="rItemDesc">{p.description}</div>
                  ) : null}

                  {p.liveUrl ? (
                    <div className="rItemLinks">
                      <a className="rMiniLink" href={p.liveUrl}>
                        Live
                      </a>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </Section>

          <Section title="Work Experience">
            <div className="rList">
              {work.map((w, idx) => (
                <div key={`${w.org}-${w.role}-${idx}`} className="rItem">
                  <div className="rItemTop">
                    <div className="rItemTitle">{w.role}</div>
                    <div className="rItemMeta">
                      {w.start} – {w.end}
                    </div>
                  </div>

                  <div className="rItemSub">{w.org}</div>

                  {w.description ? (
                    <div className="rItemDesc">{w.description}</div>
                  ) : null}

                  {w.bullets?.length ? (
                    <ul className="rBullets">
                      {w.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          </Section>
        </div>

        <aside className="rSide">
          <Section title="Education & Certifications">
            <div className="rList compact">
              {education.map((e, idx) => (
                <div key={`${e.org}-${e.role}-${idx}`} className="rItem">
                  <div className="rItemTop">
                    <div className="rItemTitle">{e.role}</div>
                    <div className="rItemMeta">
                      {e.start} – {e.end}
                    </div>
                  </div>

                  <div className="rItemSub">{e.org}</div>

                  {e.bullets?.length ? (
                    <ul className="rBullets">
                      {e.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          </Section>

          <Section title="Technical Skills">
            <div className="rChips">
              {skills.map((s) => (
                <span key={s} className="rChip">
                  {s}
                </span>
              ))}
            </div>
          </Section>

          <Section title="Hobbies">
            <ul className="rBullets">
              <li>Web & game development</li>
              <li>Music production & remixing</li>
              <li>Exploring game genres for inspiration</li>
              <li>Sports & weightlifting</li>
            </ul>
          </Section>

          <Section title="Languages">
            <ul className="rBullets">
              <li>Hebrew: Native</li>
              <li>English: Fluent</li>
            </ul>
          </Section>
        </aside>
      </div>
    </main>
  );
}
