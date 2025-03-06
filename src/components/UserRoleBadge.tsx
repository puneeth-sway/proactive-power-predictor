
import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/pages/UserSelection";
import { Home, Wrench, Users } from "lucide-react";

interface UserRoleBadgeProps {
  className?: string;
}

const UserRoleBadge: React.FC<UserRoleBadgeProps> = ({ className }) => {
  const userRole = localStorage.getItem("userRole") as UserRole | null;
  
  if (!userRole) return null;
  
  const roleConfig = {
    homeowner: {
      label: "Homeowner",
      icon: Home,
      variant: "default" as const,
    },
    installer: {
      label: "Installer",
      icon: Wrench,
      variant: "secondary" as const,
    },
    contractor: {
      label: "Contractor",
      icon: Users,
      variant: "outline" as const,
    },
  };
  
  const config = roleConfig[userRole];
  const Icon = config.icon;
  
  return (
    <Badge variant={config.variant} className={className}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
};

export default UserRoleBadge;
