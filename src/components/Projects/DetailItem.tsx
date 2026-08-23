function DetailItem({
  label,
  text,
}: {
  label: string;
  text: string;
}) {
  return (
    <div className="mb-3 last:mb-0">
      <span className="block font-bold text-sm sm:text-base text-slate-900 tracking-tight">
        {label}
      </span>
      <p className="text-sm sm:text-base text-slate-700 leading-relaxed mt-0.5">
        {text}
      </p>
    </div>
  );
}

export default DetailItem;
