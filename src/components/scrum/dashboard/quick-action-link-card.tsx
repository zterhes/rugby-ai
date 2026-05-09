import Link from "next/link";
import type { IconType } from "react-icons";

type QuickActionLinkCardProps = {
  href: string;
  label: string;
  icon: IconType;
};

export function QuickActionLinkCard({ href, label, icon: Icon }: QuickActionLinkCardProps) {
  return (
    <Link
      href={href}
      className="w-full flex items-center gap-3 p-4 rounded-lg bg-surface-elevated/40 border border-white/5 hover:bg-white/5 transition-colors text-left group"
    >
      <span className="w-8 h-8 rounded-full bg-surface-bright flex items-center justify-center text-secondary group-hover:text-primary transition-colors">
        <Icon className="text-lg shrink-0" aria-hidden />
      </span>
      <span className="font-body-ui text-secondary group-hover:text-on-surface transition-colors">
        {label}
      </span>
    </Link>
  );
}
