
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/utils/mockData";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface ChartDataPoint {
  name: string;
  hoursRun: number;
  efficiency: number;
  predictedEfficiency?: number;
  maintenanceDue?: number;
}

interface PerformanceChartProps {
  product: Product;
  className?: string;
}

const PerformanceChart = ({ product, className }: PerformanceChartProps) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  
  useEffect(() => {
    // Create past data points based on current hours and anticipated future performance
    const hoursPerDay = Math.round(product.totalHoursRun / 
      Math.max(1, Math.round((new Date().getTime() - product.installDate.getTime()) / (24 * 60 * 60 * 1000))));
    
    // Get maintenance history for key points
    const maintenancePoints = product.maintenanceHistory?.map(record => ({
      dateMs: record.datePerformed?.getTime() || 0,
      hours: record.hoursAtService || 0
    })) || [];
    
    const hoursInterval = product.type.includes("Home Standby") ? 200 : 100;
    const currentEfficiency = product.performanceMetrics?.efficiency || 85;
    
    // Create data points for the past
    const pastData: ChartDataPoint[] = [];
    
    // Start from install date
    let simulationDate = new Date(product.installDate);
    let simulatedHours = 0;
    const now = new Date();
    const dataPointInterval = Math.max(1, Math.round((now.getTime() - product.installDate.getTime()) / (24 * 60 * 60 * 1000) / 10));
    
    while (simulationDate.getTime() <= now.getTime()) {
      // Add hours for this interval
      simulatedHours += hoursPerDay * dataPointInterval;
      
      // Check if a maintenance event occurred close to this point
      const maintenance = maintenancePoints.find(point => 
        Math.abs(point.dateMs - simulationDate.getTime()) < (dataPointInterval * 24 * 60 * 60 * 1000) / 2
      );
      
      // Calculate efficiency based on hours since last maintenance
      const hoursSinceLastMaintenance = simulatedHours % hoursInterval;
      const efficiencyDrop = (hoursSinceLastMaintenance / hoursInterval) * 15; // Maximum 15% drop
      
      let efficiency = 100 - efficiencyDrop;
      if (maintenance) {
        // Efficiency gets reset after maintenance
        efficiency = 100;
      }
      
      pastData.push({
        name: formatDistanceToNow(simulationDate, { addSuffix: true }),
        hoursRun: simulatedHours,
        efficiency: Math.round(efficiency),
        maintenanceDue: maintenance ? 100 : undefined
      });
      
      // Advance time
      simulationDate = new Date(simulationDate.getTime() + (dataPointInterval * 24 * 60 * 60 * 1000));
    }
    
    // Create future predictions
    const futureData: ChartDataPoint[] = [];
    
    // Assume the next maintenance would be at the next hour interval
    const nextMaintenanceHours = product.hoursUntilMaintenance || 
      (hoursInterval - (product.totalHoursRun % hoursInterval));
    
    const daysUntilMaintenance = Math.ceil(nextMaintenanceHours / hoursPerDay);
    const predictionDays = Math.min(60, daysUntilMaintenance * 1.5); // Predict up to 60 days or 1.5x time to maintenance
    
    const predictionInterval = Math.max(5, Math.round(predictionDays / 5)); // 5-10 data points for future
    
    simulationDate = new Date(); // Start from now
    let futureHours = product.totalHoursRun;
    let futureDays = 0;
    
    while (futureDays <= predictionDays) {
      // Add days
      futureDays += predictionInterval;
      // Add hours for this interval
      futureHours += hoursPerDay * predictionInterval;
      
      // Calculate future efficiency - it drops faster as we approach maintenance
      const hoursSinceLastMaintenance = futureHours % hoursInterval;
      const efficiencyDrop = (hoursSinceLastMaintenance / hoursInterval) * 20; // Maximum 20% drop
      
      const futureDate = new Date(simulationDate.getTime() + (futureDays * 24 * 60 * 60 * 1000));
      
      // Check if this is close to the next maintenance date
      const isMaintenancePoint = product.nextMaintenanceDate && 
        Math.abs(futureDate.getTime() - product.nextMaintenanceDate.getTime()) < (predictionInterval * 24 * 60 * 60 * 1000) / 2;
      
      futureData.push({
        name: formatDistanceToNow(futureDate, { addSuffix: true }),
        hoursRun: futureHours,
        efficiency: undefined, // No actual data yet
        predictedEfficiency: Math.round(currentEfficiency - efficiencyDrop),
        maintenanceDue: isMaintenancePoint ? 100 : undefined
      });
    }
    
    // Combine data and set to state
    setChartData([...pastData, ...futureData]);
  }, [product]);

  // Custom tooltip to show relevant information
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload as ChartDataPoint;
      
      return (
        <div className="bg-background/95 p-2 border border-border rounded-md shadow-md text-sm">
          <p className="font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">Hours: {data.hoursRun}</p>
          {data.efficiency !== undefined && (
            <p className="text-primary">Efficiency: {data.efficiency}%</p>
          )}
          {data.predictedEfficiency !== undefined && (
            <p className="text-amber-500">Predicted: {data.predictedEfficiency}%</p>
          )}
          {data.maintenanceDue && (
            <p className="text-green-500 text-xs mt-1">Maintenance performed</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Performance Prediction</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="colorMaintenance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--status-healthy))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--status-healthy))" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 10 }} 
                tickMargin={10}
                angle={-45}
                height={60}
                tickFormatter={(value) => value.replace('about ', '')}
              />
              <YAxis 
                tickFormatter={(value) => `${value}%`}
                domain={[40, 100]}
                tick={{ fontSize: 10 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="efficiency"
                name="Actual Efficiency"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#colorEfficiency)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="predictedEfficiency"
                name="Predicted Efficiency"
                stroke="#f59e0b"
                fillOpacity={1}
                fill="url(#colorPrediction)"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
              <Area
                type="monotone"
                dataKey="maintenanceDue"
                name="Maintenance"
                stroke="hsl(var(--status-healthy))"
                fillOpacity={0.5}
                fill="url(#colorMaintenance)"
                strokeWidth={1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
