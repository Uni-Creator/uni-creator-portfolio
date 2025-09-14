function DetailItem({
  icon,
  label,
  text,
}: {
  icon: string;
  label: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-indigo-500 text-xl">{icon}</span>
      <p>
        <strong>{label}:</strong> {text}
      </p>
    </div>
  );
}

export default DetailItem;
