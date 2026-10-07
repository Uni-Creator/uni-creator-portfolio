/**
 * Exports src/constants/*.ts to terminal-server/app/data/portfolio.json so the
 * Python terminal reads the SAME data as the website (single source of truth).
 *
 * Run from the repo root:   npx tsx terminal-server/scripts/export_portfolio_data.ts
 */
import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import projectsList from "../../../constants/projects";
import aboutData from "../../../constants/aboutMe";
import mySkillsList from "../../../constants/skills";
import educationData from "../../../constants/education";
import experienceData from "../../../constants/experience";
import contactDetails from "../../../constants/contactDetails";

// Not stored in src/constants, so edit here:
const profile = {
  name: "ABHAY SINGH",
  headline: "AI/ML ENGINEER • DEVELOPER",
  tagline: "Computer Vision • AI/ML • Backend • Systems",
};

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "../app/data/portfolio.json");

const strip = <T extends { img?: unknown; backgroundImg?: unknown; href?: unknown }>(p: T) => {
  const { img: _i, backgroundImg: _b, href: _h, ...rest } = p;
  return rest;
};

writeFileSync(
  out,
  JSON.stringify(
    {
      profile,
      projects: projectsList.map(strip),
      about: aboutData,
      skills: mySkillsList,
      experience: experienceData,
      education: educationData,
      contact: contactDetails,
    },
    null,
    1,
  ),
);
console.log(`Wrote ${out}`);
