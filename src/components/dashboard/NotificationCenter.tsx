import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, 
  Check, 
  X, 
  MessageSquare, 
  DollarSign, 
  Star, 
  Users, 
  Calendar,
  TrendingUp,
  AlertTriangle
} from "lucide-react";

interface Notification {
  id: string;
  type: 'message' | 'payment' | 'collaboration' | 'achievement' | 'campaign' | 'alert';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  action?: {
    label: string;
    url?: string;
  };
  avatar?: string;
  metadata?: any;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "collaboration",
    title: "New Collaboration Request",
    description: "Sarah Chen wants to collaborate on a fashion campaign",
    timestamp: "2 hours ago",
    read: false,
    priority: "high",
    action: { label: "View Request" },
    avatar: "/placeholder.svg"
  },
  {
    id: "2",
    type: "payment",
    title: "Payment Received",
    description: "$2,500 payment from Nike Campaign completed",
    timestamp: "4 hours ago",
    read: false,
    priority: "medium",
    action: { label: "View Payment" }
  },
  {
    id: "3",
    type: "achievement",
    title: "Milestone Reached!",
    description: "You've reached 100K followers on Instagram!",
    timestamp: "1 day ago",
    read: true,
    priority: "medium"
  },
  {
    id: "4",
    type: "campaign",
    title: "Campaign Performance Update",
    description: "Your Summer Fashion campaign exceeded engagement targets by 25%",
    timestamp: "2 days ago",
    read: true,
    priority: "low",
    action: { label: "View Analytics" }
  },
  {
    id: "5",
    type: "alert",
    title: "Profile Optimization",
    description: "Complete your portfolio to improve your AI match score",
    timestamp: "3 days ago",
    read: false,
    priority: "medium",
    action: { label: "Complete Profile" }
  },
  {
    id: "6",
    type: "message",
    title: "New Message from Brand",
    description: "TechCorp has sent you a direct message about a potential collaboration",
    timestamp: "3 days ago",
    read: true,
    priority: "low",
    action: { label: "Reply" },
    avatar: "/placeholder.svg"
  }
];

export function NotificationCenter() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageSquare className="h-4 w-4" />;
      case 'payment': return <DollarSign className="h-4 w-4" />;
      case 'collaboration': return <Users className="h-4 w-4" />;
      case 'achievement': return <Star className="h-4 w-4" />;
      case 'campaign': return <TrendingUp className="h-4 w-4" />;
      case 'alert': return <AlertTriangle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'message': return 'text-corporate-blue';
      case 'payment': return 'text-corporate-success';
      case 'collaboration': return 'text-corporate-teal';
      case 'achievement': return 'text-corporate-warning';
      case 'campaign': return 'text-corporate-blue';
      case 'alert': return 'text-corporate-danger';
      default: return 'text-corporate-gray';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-corporate-danger';
      case 'medium': return 'border-l-corporate-warning';
      case 'low': return 'border-l-corporate-gray';
      default: return 'border-l-corporate-gray';
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const filteredNotifications = notifications.filter(notif =>
    filter === 'all' || !notif.read
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card className="border border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-corporate-gray-dark flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="bg-corporate-danger text-white">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Stay updated with your latest activities</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
            >
              {filter === 'all' ? 'Show Unread' : 'Show All'}
            </Button>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <Check className="h-4 w-4 mr-1" />
                Mark All Read
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-96">
          {filteredNotifications.length === 0 ? (
            <div className="p-6 text-center text-corporate-gray">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notifications found</p>
            </div>
          ) : (
            <div className="space-y-0">
              {filteredNotifications.map((notification, index) => (
                <div key={notification.id}>
                  <div 
                    className={`p-4 hover:bg-muted/50 transition-colors border-l-4 ${getPriorityColor(notification.priority)} ${
                      !notification.read ? 'bg-muted/30' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        {notification.avatar ? (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={notification.avatar} />
                            <AvatarFallback>
                              {notification.title.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className={`p-2 rounded-lg bg-muted ${getTypeColor(notification.type)}`}>
                            {getTypeIcon(notification.type)}
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className={`text-sm font-medium ${!notification.read ? 'text-corporate-gray-dark' : 'text-corporate-gray'}`}>
                                {notification.title}
                              </h4>
                              <p className="text-sm text-corporate-gray mt-1">
                                {notification.description}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-corporate-gray">
                                  {notification.timestamp}
                                </span>
                                {notification.priority === 'high' && (
                                  <Badge variant="destructive" className="text-xs bg-corporate-danger text-white">
                                    High Priority
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1 ml-2">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          {notification.action && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => markAsRead(notification.id)}
                            >
                              {notification.action.label}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < filteredNotifications.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}