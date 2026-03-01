import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  variant?: "default" | "primary" | "success" | "warning" | "destructive";
  isLoading?: boolean;
}

const variantStyles = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  success: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  warning: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  destructive: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
  isLoading,
}: StatsCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-20 mt-4" />
          <Skeleton className="h-3 w-32 mt-2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", variantStyles[variant])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
          {trend && (
            <p
              className={cn(
                "text-xs mt-1 font-medium",
                trend.value >= 0 ? "text-emerald-500" : "text-red-500"
              )}
            >
              {trend.value >= 0 ? "+" : ""}
              {trend.value}% {trend.label}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
