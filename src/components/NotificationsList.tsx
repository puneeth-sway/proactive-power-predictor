import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, AlertTriangle, Calendar, Info, CheckCircle, X } from "lucide-react";
import { NotificationType } from "@/utils/mockData";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  productId?: string;
  createdAt: Date;
  read: boolean;
  scheduledFor?: Date;
  recipients: string[];
}

interface NotificationsListProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
  maxHeight?: string;
  showEmpty?: boolean;
  loading?: boolean;
}

const NotificationsList = ({
  notifications,
  onMarkAsRead,
  onDismiss,
  maxHeight = "350px",
  showEmpty = true,
  loading = false,
}: NotificationsListProps) => {
  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onMarkAsRead) {
      onMarkAsRead(id);
    }
  };

  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDismiss) {
      onDismiss(id);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case NotificationType.CRITICAL_ALERT:
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case NotificationType.WARNING:
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case NotificationType.MAINTENANCE_DUE:
        return <Calendar className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case NotificationType.CRITICAL_ALERT:
        return "bg-destructive/10 border-destructive/20";
      case NotificationType.WARNING:
        return "bg-amber-500/10 border-amber-500/20";
      case NotificationType.MAINTENANCE_DUE:
        return "bg-blue-500/10 border-blue-500/20";
      default:
        return "bg-muted border-muted-foreground/20";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (notifications.length === 0 && showEmpty) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Bell className="h-10 w-10 text-muted-foreground mb-3" />
            <h3 className="font-medium">No notifications</h3>
            <p className="text-sm text-muted-foreground mt-1">
              You're all caught up! There are no notifications at this time.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
          {notifications.filter(n => !n.read).length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {notifications.filter(n => !n.read).length} new
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className={`h-[${maxHeight}]`}>
          <ul className="divide-y">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={cn(
                  "p-4 border-l-4 relative",
                  notification.read ? "opacity-70" : "bg-muted/30",
                  getNotificationColor(notification.type)
                )}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground mb-1">
                          {format(new Date(notification.createdAt), "MMM d, h:mm a")}
                        </p>
                      </div>
                      {onDismiss && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => handleDismiss(notification.id, e)}
                          aria-label="Dismiss notification"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-sm">{notification.message}</p>
                    {!notification.read && onMarkAsRead && (
                      <Button
                        variant="link"
                        size="sm"
                        className="px-0 h-7 mt-1"
                        onClick={(e) => handleMarkAsRead(notification.id, e)}
                      >
                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NotificationsList;
