import { Priority } from "@/types/todo";
import { cn } from "@/lib/utils";
import { AlertCircle, ArrowUp, ArrowDown } from "lucide-react";

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
  showIcon?: boolean;
}

export function PriorityBadge({ priority, className, showIcon = true }: PriorityBadgeProps) {
  const getPriorityConfig = (priority: Priority) => {
    switch (priority) {
      case 'High':
        return {
          styles: "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20",
          icon: AlertCircle
        };
      case 'Medium':
        return {
          styles: "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20",
          icon: ArrowUp
        };
      case 'Low':
        return {
          styles: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20",
          icon: ArrowDown
        };
      default:
        return {
          styles: "bg-zinc-800 text-zinc-400 border-zinc-700",
          icon: null
        };
    }
  };

  const config = getPriorityConfig(priority);
  const Icon = config.icon;

  return (
    <span
      className={cn(
        // Base Layout
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-colors",
        // Typography
        "text-[10px] font-mono font-medium uppercase tracking-wider",
        // Dynamic Styles
        config.styles,
        className
      )}
    >
      {showIcon && Icon && <Icon className="w-3 h-3" />}
      {priority}
    </span>
  );
}