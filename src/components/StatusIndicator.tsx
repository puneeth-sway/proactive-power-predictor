
import { cn } from "@/lib/utils";
import { CheckCircle, AlertTriangle, AlertCircle, Clock } from "lucide-react";
import { HealthStatus } from "@/utils/mockData";

interface StatusIndicatorProps {
  status: HealthStatus;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const StatusIndicator = ({ 
  status, 
  size = "md", 
  showLabel = true, 
  className 
}: StatusIndicatorProps) => {
  // Define styles based on status
  const styles = {
    [HealthStatus.Healthy]: {
      containerClass: "status-healthy",
      icon: CheckCircle,
      label: "Healthy"
    },
    [HealthStatus.Warning]: {
      containerClass: "status-warning",
      icon: AlertTriangle,
      label: "Warning"
    },
    [HealthStatus.Critical]: {
      containerClass: "status-critical",
      icon: AlertCircle,
      label: "Critical"
    },
    [HealthStatus.Neutral]: {
      containerClass: "status-neutral",
      icon: Clock,
      label: "Neutral"
    },
  };

  const currentStyle = styles[status];
  const Icon = currentStyle.icon;
  
  // Size variations
  const sizeClasses = {
    sm: "text-xs py-0.5 px-1.5",
    md: "text-sm py-1 px-2",
    lg: "text-base py-1.5 px-3"
  };
  
  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  return (
    <span className={cn(
      "status-indicator",
      currentStyle.containerClass,
      sizeClasses[size],
      className
    )}>
      <Icon size={iconSizes[size]} className="mr-1" />
      {showLabel && <span>{currentStyle.label}</span>}
    </span>
  );
};

export default StatusIndicator;
