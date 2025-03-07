import { API_BASE_URL } from "@/utils/api";

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

interface SendNotificationParams {
  contractorId: string;
  type: string;
  title: string;
  message: string;
  recipientType: "homeowners" | "installers" | "both";
  productId?: string;
  scheduledFor?: string;
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

export const sendNotificationToRecipients = async (params: SendNotificationParams): Promise<void> => {
  const { contractorId, ...notificationData } = params;
  
  const response = await fetch(`${API_BASE_URL}/contractors/${contractorId}/send-notification`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(notificationData)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to send notification');
  }
};
