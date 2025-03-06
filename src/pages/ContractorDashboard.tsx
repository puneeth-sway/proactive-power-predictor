
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { CalendarIcon, Check, Send, Users, AlertTriangle, Bell } from "lucide-react";
import { mockProducts, NotificationType } from "@/utils/mockData";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Contractor = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  installers: string[];
  homeowners: string[];
};

// Mockup contractor data (in a real app, this would come from the API)
const mockContractor: Contractor = {
  id: "contractor-1",
  name: "Alpha Maintenance Services",
  email: "contact@alphamaintenance.com",
  phone: "(555) 123-4567",
  company: "Alpha Maintenance Inc.",
  installers: ["installer-1", "installer-2", "installer-3"],
  homeowners: mockProducts.map(p => p.owner.id)
};

const ContractorDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [notificationType, setNotificationType] = useState<string>(NotificationType.GENERAL);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [recipientType, setRecipientType] = useState("both");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  const handleSendNotification = () => {
    if (!notificationTitle || !notificationMessage) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide both a title and message for the notification.",
      });
      return;
    }

    // In a real app, this would call the API
    const productText = selectedProducts.length > 0 
      ? `for ${selectedProducts.length} selected products` 
      : "to all recipients";
    
    toast({
      title: "Notification Sent",
      description: `Your notification has been sent ${productText}`,
    });

    // Reset form
    setNotificationTitle("");
    setNotificationMessage("");
    setSelectedProducts([]);
    setDate(undefined);
    setDialogOpen(false);
  };

  // Filter products by installer or homeowner
  const productsByInstaller = mockProducts.reduce((acc, product) => {
    const installerId = product.installer.id;
    if (!acc[installerId]) {
      acc[installerId] = [];
    }
    acc[installerId].push(product);
    return acc;
  }, {} as Record<string, typeof mockProducts>);

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 mx-auto">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Contractor Dashboard</h1>
          <p className="text-muted-foreground">
            Manage products and send notifications to homeowners and installers.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Contractor Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">Company:</span>
                  <p className="font-medium">{mockContractor.company}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Contact:</span>
                  <p className="font-medium">{mockContractor.name}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <p className="font-medium">{mockContractor.email}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Phone:</span>
                  <p className="font-medium">{mockContractor.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Total Products</span>
                  <p className="text-2xl font-bold">{mockProducts.length}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Installers</span>
                  <p className="text-2xl font-bold">{mockContractor.installers.length}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Homeowners</span>
                  <p className="text-2xl font-bold">{mockContractor.homeowners.length}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Critical Issues</span>
                  <p className="text-2xl font-bold text-destructive">
                    {mockProducts.filter(p => p.status === "Critical").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Managed Products</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Bell className="mr-2 h-4 w-4" />
                Send Notification
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Send Notification</DialogTitle>
                <DialogDescription>
                  Send notifications to homeowners and installers.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="recipient-type">Recipients</Label>
                  <Select value={recipientType} onValueChange={setRecipientType}>
                    <SelectTrigger id="recipient-type">
                      <SelectValue placeholder="Select recipients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="homeowners">Homeowners only</SelectItem>
                      <SelectItem value="installers">Installers only</SelectItem>
                      <SelectItem value="both">Both homeowners and installers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="notification-type">Notification Type</Label>
                  <Select value={notificationType} onValueChange={setNotificationType}>
                    <SelectTrigger id="notification-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NotificationType.MAINTENANCE_DUE}>Maintenance Due</SelectItem>
                      <SelectItem value={NotificationType.CRITICAL_ALERT}>Critical Alert</SelectItem>
                      <SelectItem value={NotificationType.WARNING}>Warning</SelectItem>
                      <SelectItem value={NotificationType.GENERAL}>General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={notificationTitle}
                    onChange={(e) => setNotificationTitle(e.target.value)}
                    placeholder="Notification title"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                    placeholder="Enter your notification message here"
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Schedule for later (optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Schedule date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label className="mb-2 block">
                    Selected Products ({selectedProducts.length})
                  </Label>
                  <div className="text-sm text-muted-foreground">
                    {selectedProducts.length > 0 ? (
                      <span>Notifications will be sent to the owners and installers of the selected products.</span>
                    ) : (
                      <span>Notifications will be sent to all recipients. Select specific products if needed.</span>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" onClick={handleSendNotification}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Notification
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Products</TabsTrigger>
            <TabsTrigger value="critical">Critical Issues</TabsTrigger>
            <TabsTrigger value="by-installer">By Installer</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockProducts.map((product) => (
                <div key={product.id} className="relative">
                  <div className="absolute top-2 right-2 z-10">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8 rounded-full",
                        selectedProducts.includes(product.id) && "bg-primary text-primary-foreground"
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSelectProduct(product.id);
                      }}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => navigate(`/product/${product.id}`)}
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="critical">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockProducts
                .filter(p => p.status === "Critical")
                .map((product) => (
                  <div key={product.id} className="relative">
                    <div className="absolute top-2 right-2 z-10">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-8 w-8 rounded-full",
                          selectedProducts.includes(product.id) && "bg-primary text-primary-foreground"
                        )}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSelectProduct(product.id);
                        }}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={() => navigate(`/product/${product.id}`)}
                    />
                  </div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="by-installer">
            <div className="space-y-8">
              {Object.entries(productsByInstaller).map(([installerId, products]) => {
                const installer = products[0]?.installer;
                return (
                  <div key={installerId} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <h3 className="text-lg font-semibold">{installer.name}</h3>
                      <span className="text-sm text-muted-foreground">
                        ({products.length} products)
                      </span>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {products.map((product) => (
                        <div key={product.id} className="relative">
                          <div className="absolute top-2 right-2 z-10">
                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn(
                                "h-8 w-8 rounded-full",
                                selectedProducts.includes(product.id) && "bg-primary text-primary-foreground"
                              )}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleSelectProduct(product.id);
                              }}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </div>
                          <ProductCard
                            key={product.id}
                            product={product}
                            compact
                            onClick={() => navigate(`/product/${product.id}`)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ContractorDashboard;
