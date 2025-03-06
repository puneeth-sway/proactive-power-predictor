import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, Wrench, Calendar, Clock, Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockProducts, mockNotifications } from "@/utils/mockData";
import NotificationsList from "@/components/NotificationsList";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const InstallerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Filter products assigned to this installer (in a real app, this would use the logged-in user's ID)
  const installerProducts = mockProducts.slice(0, 6); // Simulating products assigned to this installer
  
  // Get installer-specific notifications
  const [installerNotifications, setInstallerNotifications] = useState(
    mockNotifications
      .filter(n => n.type.includes("MAINTENANCE"))
      .slice(0, 4)
      .map(notification => ({
        ...notification,
        id: notification.id || `fallback-${Math.random().toString(36).substring(2, 9)}`,
        type: notification.type || "General",
        title: notification.title || "Maintenance Required",
        message: notification.message || "A system requires your attention",
        createdAt: notification.createdAt || new Date(),
        read: notification.read || false,
        recipients: notification.recipients || []
      }))
  );

  const handleMarkAsRead = (id: string) => {
    setInstallerNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleDismissNotification = (id: string) => {
    setInstallerNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  // Organize installations by time
  const upcomingInstallations = installerProducts.filter(p => new Date(p.installDate) > new Date()).slice(0, 3);
  const recentInstallations = installerProducts.filter(p => new Date(p.installDate) <= new Date()).slice(0, 3);
  
  // Filter maintenance tasks
  const maintenanceTasks = installerProducts
    .filter(p => p.hoursUntilMaintenance !== undefined && p.hoursUntilMaintenance < 200)
    .map(product => ({
      id: product.id,
      productName: product.name,
      location: `${product.location.city}, ${product.location.state}`,
      dueIn: product.hoursUntilMaintenance || 0,
      status: product.status
    }));

  const filteredTasks = filterStatus === "all" 
    ? maintenanceTasks 
    : maintenanceTasks.filter(task => task.status === filterStatus);
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Installer Dashboard</h1>
            <p className="text-muted-foreground">
              Manage installations and maintenance schedules
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 mb-6">
          <div className="space-y-6 md:col-span-2 lg:col-span-3">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { 
                  title: "Total Installations", 
                  value: installerProducts.length, 
                  description: "Systems you've installed", 
                  icon: <Home className="h-4 w-4" /> 
                },
                { 
                  title: "Pending Maintenance", 
                  value: maintenanceTasks.length, 
                  description: "Requiring attention soon",
                  className: "border-amber-200 bg-amber-50 dark:bg-amber-950", 
                  icon: <Wrench className="h-4 w-4" /> 
                },
                { 
                  title: "Hours This Month", 
                  value: "126", 
                  description: "Total service hours",
                  className: "border-blue-200 bg-blue-50 dark:bg-blue-950", 
                  icon: <Clock className="h-4 w-4" /> 
                },
              ].map((item, i) => (
                <Card key={i} className={item.className}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      {item.icon}
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

            <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="upcoming">Upcoming Work</TabsTrigger>
                  <TabsTrigger value="installations">Installations</TabsTrigger>
                  <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="upcoming" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>This Week's Schedule</CardTitle>
                    <CardDescription>
                      Your upcoming installation and maintenance work
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {maintenanceTasks.slice(0, 2).map((task, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-medium">{task.productName}</h3>
                            <p className="text-sm text-muted-foreground">{task.location}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <span className="text-sm font-medium">Due in {task.dueIn} hours</span>
                              <p className="text-xs text-muted-foreground">Maintenance</p>
                            </div>
                            <Button size="sm" onClick={() => navigate(`/product/${task.id}`)}>
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      {upcomingInstallations.slice(0, 2).map((installation, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                          <div>
                            <h3 className="font-medium">{installation.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {installation.location.city}, {installation.location.state}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <span className="text-sm font-medium">
                                {new Date(installation.installDate).toLocaleDateString()}
                              </span>
                              <p className="text-xs text-muted-foreground">Installation</p>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => navigate(`/product/${installation.id}`)}>
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="installations" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Upcoming Installations</CardTitle>
                      <CardDescription>New systems scheduled for installation</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {upcomingInstallations.map((installation, i) => (
                          <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h3 className="font-medium">{installation.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {installation.location.city}, {installation.location.state}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm">
                                {new Date(installation.installDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Installations</CardTitle>
                      <CardDescription>Systems you've recently installed</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentInstallations.map((installation, i) => (
                          <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h3 className="font-medium">{installation.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {installation.location.city}, {installation.location.state}
                              </p>
                            </div>
                            <Button size="sm" onClick={() => navigate(`/product/${installation.id}`)}>
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="maintenance" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle>Maintenance Tasks</CardTitle>
                      <CardDescription>
                        Systems that require maintenance soon
                      </CardDescription>
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Filter status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                        <SelectItem value="Warning">Warning</SelectItem>
                        <SelectItem value="Healthy">Healthy</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredTasks.length > 0 ? (
                        filteredTasks.map((task, i) => (
                          <div 
                            key={i} 
                            className={`flex items-center justify-between p-4 border rounded-lg ${
                              task.status === "Critical" 
                                ? "bg-red-50 border-red-100 dark:bg-red-950" 
                                : task.status === "Warning"
                                ? "bg-amber-50 border-amber-100 dark:bg-amber-950"
                                : ""
                            }`}
                          >
                            <div>
                              <h3 className="font-medium">{task.productName}</h3>
                              <p className="text-sm text-muted-foreground">{task.location}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <span className="text-sm font-medium">Due in {task.dueIn} hours</span>
                                <p className="text-xs text-muted-foreground">{task.status} priority</p>
                              </div>
                              <Button 
                                size="sm" 
                                variant={task.status === "Critical" ? "destructive" : "default"}
                                onClick={() => navigate(`/product/${task.id}`)}
                              >
                                View
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <Calendar className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                          <h3 className="font-medium">No maintenance tasks found</h3>
                          <p className="text-sm text-muted-foreground">
                            No systems currently match your filter criteria
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
              notifications={installerNotifications}
              onMarkAsRead={handleMarkAsRead}
              onDismiss={handleDismissNotification}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallerDashboard;
