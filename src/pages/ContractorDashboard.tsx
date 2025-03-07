
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { mockProducts, mockNotifications } from "@/utils/mockData";
import { useState, useEffect } from "react";
import { ArrowLeft, Users, Home, Wrench, Bell } from "lucide-react";
import NotificationsList from "@/components/NotificationsList";
import UserRoleBadge from "@/components/UserRoleBadge";
import SendNotificationDialog from "@/components/SendNotificationDialog";
import { getNotifications, markNotificationAsRead, dismissNotification } from "@/services/notificationService";
import { toast } from "sonner";

const ContractorDashboard = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Mock contractor ID - in a real app, this would come from authentication
  const contractorId = "contractor-123";
  
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Fallback to mock data if API fails
      setNotifications(mockNotifications.slice(0, 5).map(notification => ({
        ...notification,
        id: notification.id || `fallback-${Math.random().toString(36).substring(2, 9)}`,
        type: notification.type || "General",
        title: notification.title || "Notification",
        message: notification.message || "No details available",
        createdAt: new Date(),
        read: notification.read || false,
        recipients: notification.recipients || []
      })));
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchNotifications();
  }, []);
  
  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true } 
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };
  
  const handleDismiss = async (id: string) => {
    try {
      await dismissNotification(id);
      setNotifications(prev => 
        prev.filter(notification => notification.id !== id)
      );
    } catch (error) {
      console.error("Error dismissing notification:", error);
      toast.error("Failed to dismiss notification");
    }
  };
  
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
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Contractor Dashboard</h1>
              <UserRoleBadge className="ml-2" />
            </div>
            <p className="text-muted-foreground">
              Manage your team of installers and homeowner clients
            </p>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 mb-6">
          <div className="space-y-6 md:col-span-2 lg:col-span-3">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { 
                  title: "Total Systems", 
                  value: mockProducts.length, 
                  description: "Across all clients", 
                  icon: <Home className="h-4 w-4" /> 
                },
                { 
                  title: "Homeowner Clients", 
                  value: 18, 
                  description: "Active customers",
                  icon: <Users className="h-4 w-4" /> 
                },
                { 
                  title: "Installer Team", 
                  value: 6, 
                  description: "Field technicians",
                  icon: <Wrench className="h-4 w-4" /> 
                },
                { 
                  title: "Active Alerts", 
                  value: 12, 
                  description: "Requiring attention",
                  className: "border-amber-200 bg-amber-50 dark:bg-amber-950", 
                  icon: <Bell className="h-4 w-4" /> 
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

            <Tabs defaultValue="team" className="space-y-6">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="team">Team</TabsTrigger>
                  <TabsTrigger value="clients">Clients</TabsTrigger>
                  <TabsTrigger value="alerts">Alerts</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                  <SendNotificationDialog 
                    contractorId={contractorId} 
                    onSuccess={fetchNotifications}
                  />
                </div>
              </div>

              <TabsContent value="team" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Installer Team</CardTitle>
                    <CardDescription>
                      Manage your team of field technicians
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "John Smith", email: "john@example.com", phone: "555-123-4567", activeJobs: 3 },
                        { name: "Sarah Johnson", email: "sarah@example.com", phone: "555-987-6543", activeJobs: 2 },
                        { name: "Michael Brown", email: "michael@example.com", phone: "555-456-7890", activeJobs: 5 },
                        { name: "Jessica Williams", email: "jessica@example.com", phone: "555-789-0123", activeJobs: 1 },
                      ].map((installer, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-medium">{installer.name}</h3>
                            <p className="text-sm text-muted-foreground">{installer.email} • {installer.phone}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-sm">
                              <span className={`${installer.activeJobs > 3 ? "text-amber-600" : ""}`}>
                                {installer.activeJobs} active jobs
                              </span>
                            </div>
                            <Button size="sm">View Details</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="clients" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Homeowner Clients</CardTitle>
                    <CardDescription>
                      Manage your customer relationships
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "David Wilson", email: "david@example.com", phone: "555-222-3333", systems: 2, location: "Los Angeles, CA" },
                        { name: "Emily Davis", email: "emily@example.com", phone: "555-444-5555", systems: 1, location: "San Francisco, CA" },
                        { name: "Robert Taylor", email: "robert@example.com", phone: "555-666-7777", systems: 3, location: "San Diego, CA" },
                        { name: "Jennifer Martinez", email: "jennifer@example.com", phone: "555-888-9999", systems: 1, location: "Sacramento, CA" },
                      ].map((client, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-medium">{client.name}</h3>
                            <p className="text-sm text-muted-foreground">{client.location}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <span className="text-sm">{client.systems} systems</span>
                              <p className="text-xs text-muted-foreground">{client.email}</p>
                            </div>
                            <Button size="sm">View Details</Button>
                          </div>
                        </div>
                      ))}
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
                      {/* Example alerts - replace with actual data */}
                      {[
                        { message: "Generator #1234 - Low oil pressure", severity: "critical" },
                        { message: "System #5678 - Approaching maintenance", severity: "warning" },
                      ].map((alert, i) => (
                        <div key={i} className={`p-4 border rounded-lg ${alert.severity === "critical" ? "bg-red-50 border-red-200 dark:bg-red-950" : "bg-amber-50 border-amber-200 dark:bg-amber-950"}`}>
                          <p className="text-sm">{alert.message}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="schedule" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Team Schedule</CardTitle>
                    <CardDescription>
                      View scheduled tasks for your team
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Example schedule items - replace with actual data */}
                      {[
                        { task: "Install Generator #9101", installer: "John Smith", time: "9:00 AM" },
                        { task: "Maintenance System #2345", installer: "Sarah Johnson", time: "1:00 PM" },
                      ].map((schedule, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-medium">{schedule.task}</h3>
                            <p className="text-sm text-muted-foreground">Installer: {schedule.installer}</p>
                          </div>
                          <div>
                            <span className="text-sm">{schedule.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="md:col-span-1">
            <NotificationsList 
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onDismiss={handleDismiss}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractorDashboard;
