"use client";

import { useEffect, useState } from 'react';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushNotification() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js')
        .then(swReg => {
          swReg.pushManager.getSubscription()
            .then(sub => {
              if (sub) {
                setIsSubscribed(true);
              }
            });
        })
        .catch(err => console.error('Service Worker Error', err));
    }
  }, []);

  const subscribeUser = async () => {
    try {
      const swReg = await navigator.serviceWorker.ready;
      const subscription = await swReg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '')
      });

      const subData = JSON.parse(JSON.stringify(subscription));

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      const res = await fetch(`${API_URL}/push_subscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: subData.endpoint,
          keys: {
            p256dh: subData.keys.p256dh,
            auth: subData.keys.auth
          }
        })
      });

      if (res.ok) {
        setIsSubscribed(true);
      }
    } catch (err) {
      console.error('Failed to subscribe the user: ', err);
    }
  };

  if (isSubscribed) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 bg-black/80 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center gap-4 animate-fade-in-up">
      <p className="text-sm text-white/80">Get notified when new articles are published!</p>
      <button 
        onClick={subscribeUser}
        className="px-4 py-2 bg-white text-black text-xs font-medium uppercase tracking-wider rounded-md hover:bg-white/80 transition-colors"
      >
        Enable
      </button>
    </div>
  );
}
