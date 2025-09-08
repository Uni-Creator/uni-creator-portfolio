import type { AboutProps } from "../../constants/constantTtypes";

const AboutMe = ({ heading, description, highlights, tagline }: AboutProps) => {
  // Sort highlights by length so multi-word phrases get matched before single words
  const sortedHighlights = [...highlights].sort(
    (a, b) => b.text.length - a.text.length
  );

  // Build regex pattern dynamically (escape special chars)
  const pattern = new RegExp(
    sortedHighlights.map((h) => h.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"),
    "gi"
  );

  // Replace with <strong>
  const parts = description.split(pattern);

  // Extract matches separately
  const matches = description.match(pattern);

  return (
    <div className="flex flex-col items-start justify-center space-y-6 text-white w-full max-w-5xl z-10">
      <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight">
        {heading}
      </h2>

      <p className="text-lg md:text-xl leading-relaxed text-gray-200">
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {matches && matches[i] ? (
              <strong className="text-indigo-300">{matches[i]}</strong>
            ) : null}
          </span>
        ))}
      </p>

      <span className="text-lg italic text-indigo-200">{tagline}</span>
    </div>
  );
};


export default AboutMe;
