
import { API_BASE_URL } from "@/utils/api";

interface Notification {
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

export const getNotifications = async (recipientId?: string): Promise<Notification[]> => {
  const url = recipientId 
    ? `${API_BASE_URL}/notifications?recipientId=${recipientId}` 
    : `${API_BASE_URL}/notifications`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch notifications');
  }
  
  const data = await response.json();
  return data.map((notification: any) => ({
    ...notification,
    createdAt: new Date(notification.createdAt),
    scheduledFor: notification.scheduledFor ? new Date(notification.scheduledFor) : undefined
  }));
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to mark notification as read');
  }
};

export const dismissNotification = async (notificationId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    throw new Error('Failed to dismiss notification');
  }
};
