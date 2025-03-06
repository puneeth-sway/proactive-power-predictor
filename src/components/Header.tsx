
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Bell, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { mockProducts } from "@/utils/mockData";

const Header = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [alertCount, setAlertCount] = useState(0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Calculate the number of critical/warning systems
  useEffect(() => {
    const criticalCount = mockProducts.filter(product => 
      product.status === "Critical" || product.status === "Warning"
    ).length;
    setAlertCount(criticalCount);
  }, []);

  // Navigation items
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/dashboard" }
  ];

  // Show notifications
  const showNotifications = () => {
    const criticalItems = mockProducts.filter(p => p.status === "Critical");
    const warningItems = mockProducts.filter(p => p.status === "Warning");
    
    if (criticalItems.length > 0) {
      criticalItems.forEach(item => {
        toast.error(`Critical: ${item.name} requires immediate attention`, {
          description: `Serial: ${item.serialNumber} - Location: ${item.location.city}`,
          action: {
            label: "View",
            onClick: () => window.location.href = `/product/${item.id}`
          }
        });
      });
    }
    
    if (warningItems.length > 0) {
      warningItems.forEach(item => {
        toast.warning(`Warning: ${item.name} showing signs of potential issues`, {
          description: `${item.hoursUntilMaintenance} hours until next maintenance`,
          action: {
            label: "View",
            onClick: () => window.location.href = `/product/${item.id}`
          }
        });
      });
    }
    
    if (criticalItems.length === 0 && warningItems.length === 0) {
      toast.info("No critical alerts at this time");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-xl font-semibold tracking-tight transition-colors"
            onClick={closeMenu}
          >
            <div className="relative size-8 overflow-hidden rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
              PP
            </div>
            <span className="hidden sm:inline-block">PowerPredictor</span>
          </Link>
        </div>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === item.path ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        
        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={showNotifications}
          >
            <Bell className="h-5 w-5" />
            {alertCount > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                {alertCount}
              </span>
            )}
          </Button>
          
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile navigation menu */}
      {isMenuOpen && isMobile && (
        <div className="absolute top-16 left-0 right-0 z-50 bg-background border-b border-border animate-fade-in">
          <nav className="container py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "py-2 text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === item.path ? "text-foreground" : "text-muted-foreground"
                )}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
