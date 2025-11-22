import Pusher from "pusher";

const pusherAppId = process.env.PUSHER_APP_ID!;
const pusherKey = process.env.PUSHER_KEY!;
const pusherSecret = process.env.PUSHER_SECRET!;
const pusherCluster = process.env.PUSHER_CLUSTER!;

export const pusherServer = new Pusher({
  appId: pusherAppId,
  key: pusherKey,
  secret: pusherSecret,
  cluster: pusherCluster,
  useTLS: true,
});