
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, Bell, Info, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import NotificationsList from "@/components/NotificationsList";
import { mockProducts, mockNotifications, generateAlertMessage } from "@/utils/mockData";
import { useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeNotifications, setActiveNotifications] = useState(mockNotifications.slice(0, 5));

  const handleMarkAsRead = (id: string) => {
    setActiveNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleDismissNotification = (id: string) => {
    setActiveNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Count critical/warning products
  const criticalProducts = mockProducts.filter(p => p.status === "Critical");
  const warningProducts = mockProducts.filter(p => p.status === "Warning");
  const upcomingMaintenance = mockProducts.filter(p => p.hoursUntilMaintenance && p.hoursUntilMaintenance < 100);

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 mx-auto">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">System Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your equipment performance and upcoming maintenance.
          </p>
        </div>

        <div className="mb-6">
          <Button 
            variant="outline"
            className="border-dashed"
            onClick={() => navigate('/contractor')}
          >
            <Users className="mr-2 h-4 w-4" />
            Contractor Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 mb-6">
          <div className="space-y-6 md:col-span-2 lg:col-span-3">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { 
                  title: "Total Systems", 
                  value: mockProducts.length, 
                  description: "Active equipment", 
                  icon: null 
                },
                { 
                  title: "Critical Issues", 
                  value: criticalProducts.length, 
                  description: "Requiring immediate attention",
                  className: "border-red-200 bg-red-50 dark:bg-red-950", 
                  icon: null 
                },
                { 
                  title: "Warning Items", 
                  value: warningProducts.length, 
                  description: "Possible problems detected",
                  className: "border-amber-200 bg-amber-50 dark:bg-amber-950", 
                  icon: null 
                },
                { 
                  title: "Upcoming Maintenance", 
                  value: upcomingMaintenance.length, 
                  description: "Due in the next ~100 hours",
                  className: "border-blue-200 bg-blue-50 dark:bg-blue-950", 
                  icon: null 
                },
              ].map((item, i) => (
                <Card key={i} className={item.className}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {item.value}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
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
                    <div className="space-y-4">
                      {criticalProducts.length > 0 || warningProducts.length > 0 ? (
                        <div className="space-y-4">
                          {criticalProducts.map(product => (
                            <div
                              key={product.id}
                              className="bg-red-50 border-l-4 border-red-500 p-4 rounded dark:bg-red-950"
                            >
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <Bell className="h-5 w-5 text-red-500" />
                                </div>
                                <div className="ml-3">
                                  <h3 className="text-sm font-medium text-red-600 dark:text-red-400">
                                    Critical Alert: {product.name}
                                  </h3>
                                  <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                                    <p>{generateAlertMessage(product)}</p>
                                  </div>
                                  <div className="mt-3">
                                    <Button
                                      size="sm"
                                      onClick={() => navigate(`/product/${product.id}`)}
                                    >
                                      View Details
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {warningProducts.map(product => (
                            <div
                              key={product.id}
                              className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded dark:bg-amber-950"
                            >
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <Bell className="h-5 w-5 text-amber-500" />
                                </div>
                                <div className="ml-3">
                                  <h3 className="text-sm font-medium text-amber-600 dark:text-amber-400">
                                    Warning: {product.name}
                                  </h3>
                                  <div className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                                    <p>{generateAlertMessage(product)}</p>
                                  </div>
                                  <div className="mt-3">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => navigate(`/product/${product.id}`)}
                                    >
                                      View Details
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                          <Bell className="size-12 text-muted-foreground" />
                          <h3 className="text-lg font-semibold mt-2">No Alerts</h3>
                          <p className="text-sm text-muted-foreground max-w-xs mt-1">
                            There are currently no critical alerts or warnings for your equipment.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="md:col-span-1">
            <NotificationsList 
              notifications={activeNotifications}
              onMarkAsRead={handleMarkAsRead}
              onDismiss={handleDismissNotification}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
