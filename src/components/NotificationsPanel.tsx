
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NotificationsList from "./NotificationsList";
import { getNotifications, markNotificationAsRead, dismissNotification } from "@/services/notificationService";
import { toast } from "sonner";

interface NotificationsPanelProps {
  userId?: string;
}

const NotificationsPanel = ({ userId }: NotificationsPanelProps) => {
  const queryClient = useQueryClient();
  
  const { data: notifications, isLoading, error } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => getNotifications(userId),
    staleTime: 60000, // 1 minute
  });
  
  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
    },
    onError: (error) => {
      toast.error("Failed to mark notification as read");
      console.error("Error marking notification as read:", error);
    }
  });
  
  const dismissMutation = useMutation({
    mutationFn: dismissNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
    },
    onError: (error) => {
      toast.error("Failed to dismiss notification");
      console.error("Error dismissing notification:", error);
    }
  });
  
  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };
  
  const handleDismiss = (id: string) => {
    dismissMutation.mutate(id);
  };
  
  if (isLoading) {
    return <div className="p-4">Loading notifications...</div>;
  }
  
  if (error) {
    return (
      <div className="p-4 text-destructive">
        Failed to load notifications
      </div>
    );
  }
  
  return (
    <NotificationsList
      notifications={notifications || []}
      onMarkAsRead={handleMarkAsRead}
      onDismiss={handleDismiss}
    />
  );
};

export default NotificationsPanel;
