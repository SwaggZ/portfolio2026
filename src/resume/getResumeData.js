import experience from "../data/experience.json";
import projects from "../data/projects.json";
import technologies from "../data/technologies.json";

/* =======================
   Limits (1-page control)
======================= */
const MAX_PROJECTS = 3;
const MAX_WORK = 2;
const MAX_EDU = 5;
const MAX_SKILLS = 12;

/* =======================
   Helpers
======================= */
function formatDate(iso) {
  if (!iso) return "Present";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });
}

/* =======================
   Normalize Work (Top scored)
======================= */
function getTopWork(exp, topN) {
  return (exp.work ?? [])
    .slice()
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, topN)
    .flatMap((org) =>
      (org.positions ?? []).map((p) => ({
        org: org.org,
        role: p.role,
        start: formatDate(p.startDate),
        end: formatDate(p.endDate),
        description: p.description,
        bullets: (p.bullets ?? []).slice(0, 2),
      }))
    );
}

/* =======================
   Normalize Education
======================= */
function getEducation(exp, maxEdu) {
  return (exp.education ?? [])
    .flatMap((org) =>
      (org.positions ?? []).map((p) => ({
        org: org.org,
        role: p.role,
        start: formatDate(p.startDate),
        end: formatDate(p.endDate),
        bullets: p.bullets ?? [],
      }))
    )
    .slice(0, maxEdu);
}

/* =======================
   Normalize Projects (Top scored)
======================= */
function getTopProjects(maxProjects) {
  return (projects.featured ?? [])
    .slice()
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, maxProjects)
    .map((p) => ({
      title: p.resumeTitle ?? p.title,
      subtitle: p.subtitle ?? "",
      description: p.resumeDescription ?? p.description ?? "",
      tags: (p.tags ?? []).slice(0, 3),
      sourceUrl: p.sourceUrl ?? null,
      liveUrl: p.liveUrl ?? null,
      score: p.score ?? 0,
    }));
}

/* =======================
   Main Export
======================= */
export function getResumeData() {
  return {
    header: {
      name: "Aviv Tenenbaum Haddar",
      title: "Full-Stack & Game Developer",
      location: "Modi'in, Israel",
      email: "avivdth@gmail.com",
      links: [
        { label: "GitHub", url: "https://github.com/SwaggZ" },
        { label: "Portfolio", url: "https://avivs-portfolio.onrender.com" },
        {
          label: "LinkedIn",
          url: "https://www.linkedin.com/in/aviv-tenenbaum-haddar-0321b821b/",
        },
      ],
    },

    summary:
      "Software engineering student driven to build polished web and Unity products, with a strong foundation in full-stack development, IT, networking, and intelligence systems.",

    projects: getTopProjects(MAX_PROJECTS),
    work: getTopWork(experience, MAX_WORK),
    education: getEducation(experience, MAX_EDU),
    skills: (technologies.items ?? [])
      .map((t) => t.name)
      .filter(Boolean)
      .slice(0, MAX_SKILLS),
  };
}
