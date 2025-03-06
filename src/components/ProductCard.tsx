
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Product } from "@/utils/mockData";
import StatusIndicator from "@/components/StatusIndicator";
import { formatDistanceToNow } from "date-fns";
import { AlertTriangle, Clock, Activity } from "lucide-react";

export interface ProductCardProps {
  product: Product;
  compact?: boolean;
  className?: string;
  onClick?: () => void; // Added onClick prop
}

export const ProductCard = ({ product, compact = false, className, onClick }: ProductCardProps) => {
  const timeUntilMaintenance = product.nextMaintenanceDate 
    ? formatDistanceToNow(product.nextMaintenanceDate, { addSuffix: true })
    : "Unknown";
  
  return (
    <Link to={`/product/${product.id}`} onClick={onClick}>
      <Card className={cn(
        "transition-all duration-300 h-full hover:shadow-md",
        product.status === "Critical" && "border-destructive/40",
        product.status === "Warning" && "border-orange-400/40",
        className
      )}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">{product.type}</p>
              <h3 className="font-semibold leading-none tracking-tight">
                {product.name}
              </h3>
              {!compact && (
                <p className="text-xs text-muted-foreground mt-1">
                  {product.manufacturer} {product.model}
                </p>
              )}
            </div>
            <StatusIndicator 
              status={product.status} 
              size={compact ? "sm" : "md"}
            />
          </div>
        </CardHeader>
        
        <CardContent className="pb-2">
          {!compact && (
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Location</span>
                <span>{product.location.city}, {product.location.state}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Total Hours</span>
                <span>{product.totalHoursRun} hrs</span>
              </div>
            </div>
          )}
          
          <div className="space-y-1.5">
            <div className={cn(
              "flex items-center gap-1.5",
              product.hoursUntilMaintenance && product.hoursUntilMaintenance < 50 
                ? "text-amber-500" 
                : "text-muted-foreground"
            )}>
              <Clock className="h-3.5 w-3.5" />
              <span className="text-xs">
                Next Maintenance: {timeUntilMaintenance}
              </span>
            </div>
            
            {product.status !== "Healthy" && !compact && (
              <div className="flex items-center gap-1.5 text-amber-500">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span className="text-xs">
                  {product.status === "Critical" 
                    ? "Requires immediate attention" 
                    : "May require maintenance soon"}
                </span>
              </div>
            )}
            
            {!compact && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs flex items-center">
                    <Activity className="h-3.5 w-3.5 mr-1" />
                    Weekly Usage
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {product.weeklyUsage.reduce((sum, hours) => sum + hours, 0)} hrs
                  </span>
                </div>
                <div className="flex h-2 w-full space-x-0.5">
                  {product.weeklyUsage.map((hours, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex-1 rounded-sm", 
                        hours > 0 ? "bg-primary/80" : "bg-muted"
                      )}
                      style={{ 
                        height: "8px",
                        opacity: hours ? 0.3 + (hours / 10) * 0.7 : 0.2
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className={cn(!compact && "pt-2")}>
          <div className="w-full text-xs text-muted-foreground flex items-center justify-between">
            <span>S/N: {product.serialNumber}</span>
            <span>View Details →</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
