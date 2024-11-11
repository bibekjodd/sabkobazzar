'use client';

import { EVENTS, ReceivedNotificationResponse } from '@/lib/events';
import { onReceivedNotification } from '@/lib/events-actions';
import { pusher } from '@/lib/pusher';
import { getQueryClient } from '@/lib/query-client';
import { useProfile } from '@/queries/use-profile';
import { Channel } from 'pusher-js';
import { useEffect, useState } from 'react';

export default function RealtimeListener() {
  const { data: profile } = useProfile();
  const profileId = profile?.id;
  const [channel, setChannel] = useState<Channel | null>(null);
  const queryClient = getQueryClient();

  useEffect(() => {
    if (!profileId) return;
    setChannel(pusher.subscribe(profileId));
    return () => {
      pusher.unsubscribe(profileId);
      setChannel(null);
    };
  }, [profileId]);

  useEffect(() => {
    if (!channel) return;

    channel.bind(EVENTS.RECEIVED_NOTIFICATION, (data: ReceivedNotificationResponse) => {
      onReceivedNotification({ queryClient, notification: data.notification });
    });

    return () => {
      channel.unbind_all();
    };
  }, [channel, queryClient]);

  return null;
}
