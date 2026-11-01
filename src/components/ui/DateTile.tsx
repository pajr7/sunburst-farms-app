export default function DateTile({ date, size = 48 }: { date: string; size?: number }) {
  const d = new Date(date + "T00:00:00");
  return (
    <span
      className="rounded-lg flex flex-col items-center justify-center shrink-0"
      style={{ width: size, height: size, background: "var(--primary-soft)", color: "var(--primary-soft-text)" }}
    >
      <span className="text-[11px] font-bold uppercase leading-none">{d.toLocaleString("en-US", { month: "short" })}</span>
      <span className="text-[19px] font-bold leading-none mt-0.5">{d.getDate()}</span>
    </span>
  );
}
