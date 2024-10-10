import Pusher from 'pusher-js';

const getPusher = () => {
  if (!globalThis.PusherInstance) {
    globalThis.PusherInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, { cluster: 'ap2' });
  }
  return globalThis.PusherInstance;
};
export const pusher = getPusher();
