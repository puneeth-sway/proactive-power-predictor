
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Wrench, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

export type UserRole = "homeowner" | "installer" | "contractor";

const UserSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleRoleSelection = (role: UserRole) => {
    setSelectedRole(role);
    
    // Store the selected role in localStorage
    localStorage.setItem("userRole", role);
    
    // Navigate to the appropriate dashboard
    switch (role) {
      case "homeowner":
        navigate("/dashboard");
        break;
      case "installer":
        navigate("/installer");
        break;
      case "contractor":
        navigate("/contractor");
        break;
    }
    
    toast.success(`Logged in as ${role}`);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome to PowerPredictor</h1>
          <p className="text-muted-foreground">
            Please select your role to continue
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedRole === "homeowner" ? "border-primary ring-2 ring-primary/20" : ""
            }`}
            onClick={() => handleRoleSelection("homeowner")}
          >
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                <Home className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Homeowner</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>
                Monitor your equipment and receive maintenance alerts
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedRole === "installer" ? "border-primary ring-2 ring-primary/20" : ""
            }`}
            onClick={() => handleRoleSelection("installer")}
          >
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-amber-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                <Wrench className="h-8 w-8 text-amber-600" />
              </div>
              <CardTitle>Installer</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>
                Manage installations and track maintenance schedules
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedRole === "contractor" ? "border-primary ring-2 ring-primary/20" : ""
            }`}
            onClick={() => handleRoleSelection("contractor")}
          >
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Contractor</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>
                Oversee teams, manage clients, and coordinate maintenance
              </CardDescription>
            </CardContent>
          </Card>
        </div>
        
        <p className="text-sm text-muted-foreground text-center mt-8">
          This selection simulates different user roles for demonstration purposes
        </p>
      </div>
    </div>
  );
};

export default UserSelection;
