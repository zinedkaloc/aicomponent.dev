import { useEffect, useState } from "react";
import Agnost from "@/lib/agnost";
import { useAuth } from "@/context/AuthContext";

export default function useSocket() {
  const { realtime } = Agnost.getBrowserClient();
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);

  function onConnect() {
    setConnected(true);
  }

  function onDisconnect() {
    setConnected(false);
  }

  useEffect(() => {
    realtime.open();

    realtime.onConnect(onConnect);
    realtime.onDisconnect(onDisconnect);

    return () => {
      realtime.close();
      realtime.offAny(onConnect);
      realtime.offAny(onDisconnect);
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    const userKey = `user:${user?.id}`;

    realtime.join(userKey);
    return () => {
      realtime.leave(userKey);
    };
  }, [user]);

  return { realtime, connected };
}
