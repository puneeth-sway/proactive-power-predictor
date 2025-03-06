import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, DownloadCloud, Share2 } from "lucide-react";
import StatusIndicator from "@/components/StatusIndicator";
import PerformanceChart from "@/components/PerformanceChart";
import MaintenanceTimeline from "@/components/MaintenanceTimeline";
import { MaintenanceRecommendation } from "@/components/MaintenanceRecommendation";
import { mockProducts } from "@/utils/mockData";
import { format } from "date-fns";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const product = mockProducts.find(p => p.id === id);
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="mr-2 size-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const formattedInstallDate = format(product.installDate, 'MM/dd/yyyy');
  const formattedLastServiceDate = product.lastServiceDate 
    ? format(product.lastServiceDate, 'MM/dd/yyyy') 
    : 'Not serviced yet';

  const maintenanceRecommendationData = {
    name: product.name,
    lastMaintenance: formattedLastServiceDate,
    recommendedMaintenance: product.nextMaintenanceDate 
      ? format(product.nextMaintenanceDate, 'MM/dd/yyyy')
      : 'Not scheduled',
    status: product.status === 'Critical' ? 'critical' : 
           product.status === 'Warning' ? 'warning' : 'healthy' as "healthy" | "warning" | "critical"
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 mx-auto">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to Dashboard
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <div className="flex items-center mt-2 space-x-4">
              <StatusIndicator status={product.status} />
              <span className="text-sm text-muted-foreground">
                Serial: {product.serialNumber}
              </span>
              <span className="text-sm text-muted-foreground">
                Installed: {formattedInstallDate}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 size-4" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <DownloadCloud className="mr-2 size-4" />
              Download Report
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Current operational status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Model</h4>
                        <p>{product.model}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Type</h4>
                        <p>{product.type}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Hours Run</h4>
                        <p>{product.totalHoursRun} hours</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Last Maintenance</h4>
                        <p>{formattedLastServiceDate}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>System efficiency and metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <PerformanceChart product={product} />
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Timeline</CardTitle>
                <CardDescription>Past and upcoming maintenance</CardDescription>
              </CardHeader>
              <CardContent>
                <MaintenanceTimeline product={product} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Performance Analysis</CardTitle>
                <CardDescription>System performance over time</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <PerformanceChart product={product} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="maintenance" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance Recommendations</CardTitle>
                  <CardDescription>Suggested upcoming maintenance</CardDescription>
                </CardHeader>
                <CardContent>
                  <MaintenanceRecommendation product={maintenanceRecommendationData} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance History</CardTitle>
                  <CardDescription>Previous service records</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {product.maintenanceHistory && product.maintenanceHistory.map((record, index) => (
                      <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{record.description}</h4>
                          <span className="text-sm text-muted-foreground">
                            {record.datePerformed ? format(record.datePerformed, 'MM/dd/yyyy') : 'Unknown date'}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{record.notes}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetails;
