import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Wrench, AlertTriangle, CheckCircle } from "lucide-react";

interface MaintenanceRecommendationProps {
  product: {
    name: string;
    lastMaintenance: string;
    recommendedMaintenance: string;
    status: "healthy" | "warning" | "critical";
  };
}

export const MaintenanceRecommendation = ({
  product,
}: MaintenanceRecommendationProps) => {
  const needsMaintenance = product.status === "warning" || product.status === "critical";

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Recommended Action</h3>
          <p className="text-sm text-muted-foreground">
            {needsMaintenance
              ? `Maintenance is recommended for ${product.name}.`
              : `No immediate action needed for ${product.name}.`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">
              Last Maintenance
            </h4>
            <p>{product.lastMaintenance}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">
              Recommended Next
            </h4>
            <p>{product.recommendedMaintenance}</p>
          </div>
        </div>

        <Button
          variant="outline"
          className={cn(needsMaintenance ? "text-amber-500" : "text-green-500")}
        >
          {needsMaintenance ? (
            <>
              <AlertTriangle className="mr-2 size-4" />
              Schedule Maintenance
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 size-4" />
              System Okay
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
