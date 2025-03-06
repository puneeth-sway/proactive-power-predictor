
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, Bell, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { mockProducts } from "@/utils/mockData";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 mx-auto">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">System Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your equipment performance and upcoming maintenance.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Bell className="size-4 mr-2" />
                Notifications
              </Button>
              <Button size="sm">
                Generate Report
                <ArrowUpRight className="ml-2 size-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {["Total Systems", "Critical Issues", "Upcoming Maintenance", "Efficiency Score"][i]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {[mockProducts.length, 2, 5, "94%"][i]}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {[
                        "+2 from last month",
                        "Requiring immediate attention",
                        "Due in the next 30 days",
                        "Overall system performance",
                      ][i]}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <h2 className="text-xl font-semibold mt-8 mb-4">Your Equipment</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => navigate(`/product/${product.id}`)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Schedule</CardTitle>
                <CardDescription>
                  View upcoming maintenance for all your equipment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-8">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Info className="size-12 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">Maintenance Data</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      This would display a calendar or timeline of upcoming maintenance for all
                      equipment based on actual data.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>
                  Recent notifications and warnings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-8">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Bell className="size-12 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">Alerts & Notifications</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      This would display system alerts, warnings, and notifications based on
                      real-time monitoring data.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
