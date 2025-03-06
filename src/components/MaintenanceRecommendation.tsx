
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Product, 
  getRecommendationsForProduct,
  MaintenanceType,
  generateAlertMessage
} from "@/utils/mockData";
import { 
  Tools, Zap, Clock, AlertCircle, 
  CheckCircle, ShieldCheck, BarChart4
} from "lucide-react";
import { toast } from "sonner";

interface MaintenanceRecommendationProps {
  product: Product;
  className?: string;
}

const MaintenanceRecommendation = ({ product, className }: MaintenanceRecommendationProps) => {
  const recommendations = getRecommendationsForProduct(product);
  const alertMessage = generateAlertMessage(product);
  
  // Get appropriate action based on product status
  const getActionButton = () => {
    switch (product.status) {
      case "Critical":
        return (
          <Button 
            className="w-full mt-2" 
            variant="destructive"
            onClick={() => toast.success("Service appointment scheduled", {
              description: "A technician will contact the owner within 24 hours."
            })}
          >
            <AlertCircle className="mr-2 h-4 w-4" />
            Schedule Emergency Service
          </Button>
        );
      case "Warning":
        return (
          <Button 
            className="w-full mt-2"
            variant="default"
            onClick={() => toast.success("Maintenance notification sent", {
              description: "The homeowner has been notified of recommended maintenance."
            })}
          >
            <Clock className="mr-2 h-4 w-4" />
            Notify Owner of Required Maintenance
          </Button>
        );
      default:
        return (
          <Button 
            className="w-full mt-2"
            variant="outline"
            onClick={() => toast.success("Status report sent", {
              description: "A system status report has been sent to the owner."
            })}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Send System Status Report
          </Button>
        );
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Maintenance Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        {alertMessage && (
          <div className={cn(
            "p-3 rounded-md mb-4 text-sm",
            product.status === "Critical" ? "bg-destructive/10 text-destructive border border-destructive/20" :
            product.status === "Warning" ? "bg-amber-500/10 text-amber-600 border border-amber-200/20" :
            "bg-blue-500/10 text-blue-600 border border-blue-200/20"
          )}>
            <div className="flex items-start gap-2">
              {product.status === "Critical" ? 
                <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" /> : 
                product.status === "Warning" ? 
                <Clock className="h-5 w-5 mt-0.5 shrink-0" /> :
                <ShieldCheck className="h-5 w-5 mt-0.5 shrink-0" />
              }
              <div>
                <p className="font-medium">{alertMessage}</p>
                <p className="text-xs mt-1.5 opacity-80">
                  {product.status === "Critical" 
                    ? "This system shows signs of imminent failure. Immediate action is recommended."
                    : product.status === "Warning"
                    ? "Based on usage patterns and system data, maintenance will prevent future issues."
                    : "Regular maintenance keeps your system running efficiently."
                  }
                </p>
              </div>
            </div>
            {getActionButton()}
          </div>
        )}
        
        <div className="space-y-4">
          {/* Key Performance Indicators */}
          {product.performanceMetrics && (
            <div className="mb-4">
              <h4 className="text-sm font-medium flex items-center mb-2">
                <BarChart4 className="h-4 w-4 mr-1.5" />
                System Performance
              </h4>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 glass-card rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">Efficiency</p>
                  <p className={cn(
                    "text-lg font-semibold",
                    product.performanceMetrics.efficiency < 70 ? "text-destructive" :
                    product.performanceMetrics.efficiency < 85 ? "text-amber-500" :
                    "text-green-500"
                  )}>
                    {product.performanceMetrics.efficiency}%
                  </p>
                </div>
                
                <div className="text-center p-2 glass-card rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">Reliability</p>
                  <p className={cn(
                    "text-lg font-semibold",
                    product.performanceMetrics.reliability < 70 ? "text-destructive" :
                    product.performanceMetrics.reliability < 85 ? "text-amber-500" :
                    "text-green-500"
                  )}>
                    {product.performanceMetrics.reliability}%
                  </p>
                </div>
                
                <div className="text-center p-2 glass-card rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">Emissions</p>
                  <p className={cn(
                    "text-lg font-semibold",
                    product.performanceMetrics.emissions < 70 ? "text-destructive" :
                    product.performanceMetrics.emissions < 85 ? "text-amber-500" :
                    "text-green-500"
                  )}>
                    {product.performanceMetrics.emissions}%
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Maintenance Recommendations by Type */}
          <div>
            <h4 className="text-sm font-medium flex items-center mb-2">
              <Tools className="h-4 w-4 mr-1.5" />
              Scheduled Maintenance
            </h4>
            
            <div className="space-y-3">
              {[
                MaintenanceType.Initial,
                MaintenanceType.Routine,
                MaintenanceType.LongTerm
              ].map(type => {
                const typeRecs = recommendations.filter(rec => rec.maintenanceType === type);
                if (typeRecs.length === 0) return null;
                
                return (
                  <div key={type} className="glass-card p-3 rounded-md">
                    <h5 className="text-sm font-medium mb-1">
                      {type} Maintenance
                    </h5>
                    <div className="space-y-2">
                      {typeRecs.map(rec => (
                        <div key={rec.id} className="text-xs">
                          <div className="flex items-start gap-1.5">
                            <Zap className="h-3 w-3 mt-0.5 text-primary shrink-0" />
                            <div>
                              <p>{rec.description}</p>
                              <p className="text-muted-foreground mt-0.5">
                                {rec.intervalDescription}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Special Considerations */}
          <div>
            <h4 className="text-sm font-medium flex items-center mb-2">
              <AlertCircle className="h-4 w-4 mr-1.5" />
              Special Considerations
            </h4>
            
            <div className="glass-card p-3 rounded-md">
              <div className="space-y-2">
                {recommendations
                  .filter(rec => rec.maintenanceType === MaintenanceType.Special)
                  .map(rec => (
                    <div key={rec.id} className="text-xs">
                      <div className="flex items-start gap-1.5">
                        <Zap className="h-3 w-3 mt-0.5 text-primary shrink-0" />
                        <div>
                          <p>{rec.description}</p>
                          {rec.intervalDescription && (
                            <p className="text-muted-foreground mt-0.5">
                              {rec.intervalDescription}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenanceRecommendation;
