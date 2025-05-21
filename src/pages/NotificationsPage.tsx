import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  action_url: string | null;
  created_at: string;
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error);
        return;
      }

      setNotifications(data || []);
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id);

    if (error) {
      console.error("Error marking notification as read:", error);
      return;
    }

    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card className="p-6 text-center text-gray-500">
            No notifications yet
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 cursor-pointer transition-colors ${
                notification.read ? "bg-gray-50" : "bg-white"
              }`}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{notification.title}</h3>
                    <Badge variant={notification.type === "info" ? "secondary" : "destructive"}>
                      {notification.type}
                    </Badge>
                    {!notification.read && (
                      <Badge variant="default">New</Badge>
                    )}
                  </div>
                  <p className="text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default NotificationsPage;