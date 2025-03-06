
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { 
  Product, 
  getRecommendationsForProduct, 
  MaintenanceType, 
  MaintenanceRecord 
} from "@/utils/mockData";
import { CheckCircle, Clock, Calendar, Info } from "lucide-react";

interface MaintenanceTimelineProps {
  product: Product;
  className?: string;
}

const MaintenanceTimeline = ({ product, className }: MaintenanceTimelineProps) => {
  // Sort maintenance history by date (most recent first)
  const sortedHistory = [...(product.maintenanceHistory || [])]
    .sort((a, b) => {
      const dateA = a.datePerformed ? a.datePerformed.getTime() : 0;
      const dateB = b.datePerformed ? b.datePerformed.getTime() : 0;
      return dateB - dateA;
    });
  
  // Get next scheduled maintenance
  const nextMaintenance = product.nextMaintenanceDate ? {
    date: product.nextMaintenanceDate,
    hours: product.hoursUntilMaintenance || 0,
    hoursRun: product.totalHoursRun + (product.hoursUntilMaintenance || 0)
  } : null;

  // Get recommendations for this product type
  const recommendations = getRecommendationsForProduct(product);
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Maintenance Timeline</CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        <div className="relative">
          {/* Left vertical timeline line */}
          <div className="absolute top-0 bottom-0 left-2 w-0.5 bg-border" />
          
          {/* Upcoming Maintenance */}
          {nextMaintenance && (
            <div className="mb-8 ml-7 relative">
              <div className="absolute -left-7 top-1 size-4 rounded-full bg-primary/20 flex items-center justify-center">
                <Clock className="text-primary h-3 w-3" />
              </div>
              
              <div className="flex flex-col">
                <h4 className="text-sm font-medium text-foreground">
                  Upcoming Maintenance
                </h4>
                <time className="text-xs text-muted-foreground">
                  {format(nextMaintenance.date, "MMM d, yyyy")} 
                  {" "}({nextMaintenance.hours} hours remaining)
                </time>
                
                <div className="mt-2 space-y-2">
                  {recommendations
                    .filter(rec => rec.maintenanceType === MaintenanceType.Routine)
                    .map(rec => (
                      <div key={rec.id} className="glass-card p-3 rounded-md text-sm">
                        <p className="font-medium mb-1">{rec.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {rec.intervalDescription}
                        </p>
                      </div>
                    ))}
                </div>
                
                <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>At approximately {nextMaintenance.hoursRun} total hours</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Past Maintenance History */}
          <div className="space-y-6">
            {sortedHistory.map((record: MaintenanceRecord) => (
              <div key={record.id} className="ml-7 relative">
                <div className="absolute -left-7 top-1 size-4 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="text-green-500 h-3 w-3" />
                </div>
                
                <div className="flex flex-col">
                  <h4 className="text-sm font-medium text-foreground">
                    {record.description}
                  </h4>
                  {record.datePerformed && (
                    <time className="text-xs text-muted-foreground">
                      {format(record.datePerformed, "MMM d, yyyy")}
                      {record.hoursAtService && ` (${record.hoursAtService} hours)`}
                    </time>
                  )}
                  
                  {record.notes && (
                    <p className="mt-1.5 text-xs">
                      {record.notes}
                    </p>
                  )}
                  
                  {record.technician && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Info className="h-3 w-3" />
                      <span>Serviced by: {record.technician}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Installation point */}
            <div className="ml-7 relative">
              <div className="absolute -left-7 top-1 size-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Calendar className="text-blue-500 h-3 w-3" />
              </div>
              
              <div className="flex flex-col">
                <h4 className="text-sm font-medium text-foreground">
                  Initial Installation
                </h4>
                <time className="text-xs text-muted-foreground">
                  {format(product.installDate, "MMM d, yyyy")}
                </time>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenanceTimeline;
