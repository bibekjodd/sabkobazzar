import Pusher from 'pusher-js';

export {};
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_BACKEND_URL: string;
      NEXT_PUBLIC_IMGBB_KEY: string;
      NEXT_PUBLIC_PUSHER_KEY: string;
    }
  }

  var PusherInstance: Pusher | undefined;
}
