import { NextResponse } from 'next/server';
import webPush from 'web-push';

const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
const privateVapidKey = process.env.VAPID_PRIVATE_KEY || '';

// Initialize web-push if keys are present
if (publicVapidKey && privateVapidKey) {
  webPush.setVapidDetails(
    'mailto:contact@ffnet.work',
    publicVapidKey,
    privateVapidKey
  );
}

export async function POST(req: Request) {
  if (!publicVapidKey || !privateVapidKey) {
    return NextResponse.json({ error: 'VAPID keys not configured' }, { status: 500 });
  }

  try {
    const { title, body } = await req.json();

    // Fetch subscriptions from Rails API
    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/push_subscriptions`);
    const subscriptions = await apiRes.json();

    const payload = JSON.stringify({ title, body });

    // Send push to all subscribers
    const promises = subscriptions.map((sub: any) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      };

      return webPush.sendNotification(pushSubscription, payload).catch(err => {
        console.error('Error sending push to subscription:', err);
      });
    });

    await Promise.all(promises);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Push error:', err);
    return NextResponse.json({ error: 'Failed to send push notification' }, { status: 500 });
  }
}
