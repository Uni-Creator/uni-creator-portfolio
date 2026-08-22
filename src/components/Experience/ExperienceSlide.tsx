import type { ExperienceItem } from "../../../constants/constantTtypes";

const ExperienceSlide = ({
  item,
  active,
}: {
  item: ExperienceItem;
  active: boolean;
}) => {
  return (
    <div
      className={`w-full transition-all duration-500 ease-in-out ${
        active
          ? "opacity-100 scale-100 relative z-10"
          : "opacity-0 scale-95 absolute inset-0 pointer-events-none z-0"
      }`}
    >
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 md:p-10 shadow-sm hover:shadow-md transition">
        {/* Header: Period & Location */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100/80 px-3 py-1 rounded-full">
            {item.period}
          </span>
          {item.location && (
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              {item.location}
            </span>
          )}
        </div>

        {/* Title & Organization */}
        <div className="mb-6">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 leading-snug">
            {item.title}
          </h3>
          <p className="text-sm sm:text-base font-semibold text-slate-600 mt-1">
            {item.subtitle}
          </p>
        </div>

        {/* Bullet Points */}
        <ul className="space-y-3 text-slate-700 text-sm sm:text-base leading-relaxed pl-5 list-disc marker:text-indigo-500">
          {item.details.map((bullet, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: bullet }} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExperienceSlide;
