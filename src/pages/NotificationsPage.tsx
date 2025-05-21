import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setNotifications(data || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", id);

      if (error) {
        throw error;
      }

      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("read", false);

      if (error) {
        throw error;
      }

      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  return (
    <div className="min-h-screen bg-kitchen-cream flex flex-col">
      <Header 
        title="Notifications" 
        showBack={true} 
        onBack={() => navigate(-1)} 
        showSettings={false}
      />
      
      <main className="flex-1 px-4 py-6 mb-16">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6 text-kitchen-dark" />
              <h1 className="text-2xl font-bold text-kitchen-dark">Notifications</h1>
            </div>
            
            {notifications.some(n => !n.read) && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={markAllAsRead}
                className="text-sm"
              >
                <Check className="h-4 w-4 mr-1" />
                Mark all as read
              </Button>
            )}
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </Card>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <Card className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">No notifications yet</h2>
              <p className="text-gray-500">
                We'll notify you when there's something new
              </p>
            </Card>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    className={`p-4 cursor-pointer transition-colors ${
                      notification.read ? "bg-gray-50" : "bg-white"
                    }`}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-kitchen-dark">
                            {notification.title}
                          </h3>
                          <Badge variant={notification.type === "info" ? "secondary" : "destructive"}>
                            {notification.type}
                          </Badge>
                          {!notification.read && (
                            <Badge variant="default" className="bg-kitchen-green">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                        <p className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      
                      {notification.action_url && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="ml-4"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = notification.action_url!;
                          }}
                        >
                          View
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotificationsPage;