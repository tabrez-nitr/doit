"use client";

import { useEffect, useState } from "react";
import { Todo } from "@/types/todo";

export function useLocalNotifications(todos: Todo[]) {
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      // Register simple Service Worker for Android support
      if (result === 'granted' && 'serviceWorker' in navigator) {
         navigator.serviceWorker.register('/sw.js').catch(err => console.error("SW Register failed", err));
      }
      return result;
    }
    return "denied";
  };

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (permission === "granted") {
      // Try using Service Worker registration if available for better Android support
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification(title, {
                icon: "/web-app-manifest-192x192.png",
                badge: "/web-app-manifest-192x192.png",
                ...options
            });
        });
      } else {
        new Notification(title, {
            icon: "/web-app-manifest-192x192.png", 
            badge: "/web-app-manifest-192x192.png",
            ...options,
        });
      }
    }
  };

  // Polling: Every 2 Hours
  // Checks for incomplete tasks for the CURRENT DAY
  useEffect(() => {
    if (permission !== "granted") return;

    const checkInterval = 2 * 60 * 60 * 1000; // 2 hours
    
    // Initial Check after 5 seconds of load (optional, or immediate)
    // We'll stick to interval to avoid immediate spam on reload
    
    const interval = setInterval(() => {
      const now = new Date();
      const currentKey = now.toISOString().split('T')[0];
      
      const pendingToday = todos.filter(t => t.date === currentKey && !t.completed).length;

      if (pendingToday > 0) {
          sendNotification(`You have ${pendingToday} tasks left today!`, {
              body: "Stay on track perfectly.",
              tag: 'recurring-reminder' // Overwrites previous
          });
      }
    }, checkInterval);

    return () => clearInterval(interval);
  }, [todos, permission]);

  return { permission, requestPermission, sendNotification };
}
