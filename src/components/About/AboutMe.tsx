import type { AboutProps } from "../../../constants/constantTtypes";

const AboutMe = ({ heading, paragraphs, highlights }: AboutProps) => {
  // Sort highlights by length so multi-word phrases get matched before single words
  const sortedHighlights = [...highlights].sort(
    (a, b) => b.text.length - a.text.length
  );

  // Build regex pattern dynamically (escape special chars)
  const pattern = new RegExp(
    sortedHighlights.map((h) => h.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"),
    "gi"
  );

  // Highlight a single paragraph string
  const renderHighlighted = (text: string, paraIndex: number) => {
    const parts = text.split(pattern);
    const matches = text.match(pattern);

    return (
      <p
        key={paraIndex}
        className="text-lg leading-relaxed text-white/90 mb-4 last:mb-0"
      >
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {matches && matches[i] ? (
              <strong className="text-white font-semibold underline underline-offset-4 decoration-indigo-400">
                {matches[i]}
              </strong>
            ) : null}
          </span>
        ))}
      </p>
    );
  };

  return (
    <div className="flex flex-col items-start justify-center space-y-4 text-text-primary/80 w-full max-w-3xl z-10">
      <h2 className="text-4xl md:text-5xl text-white font-extrabold tracking-tight mb-4">
        {heading}
      </h2>

      <div className="space-y-3">
        {paragraphs.map((para, i) => renderHighlighted(para, i))}
      </div>
    </div>
  );
};

export default AboutMe;
