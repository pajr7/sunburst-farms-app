import Icon, { type IconName } from "./Icon";

export default function EmptyState({
  icon,
  title,
  body,
  action,
  compact = false,
}: {
  icon: IconName;
  title: string;
  body?: string;
  action?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={`flex flex-col items-center text-center ${compact ? "py-8" : "py-16"} px-6`}>
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
        style={{ background: "var(--surface-2)", color: "var(--text-3)" }}
      >
        <Icon name={icon} size={26} />
      </div>
      <p className="text-[17px] font-bold mb-1" style={{ color: "var(--text)" }}>
        {title}
      </p>
      {body && (
        <p className="text-[15px] leading-relaxed max-w-[32ch]" style={{ color: "var(--text-2)" }}>
          {body}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
