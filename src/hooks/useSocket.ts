import { useEffect } from "react";
import Agnost from "@/lib/agnost";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { RealtimeManager } from "@agnost/client";

export default function useSocket() {
  const { realtime, connected, setConnected } = useSocketStore();

  function onConnect() {
    console.log("Connected to socket");
    setConnected(true);
  }

  function onDisconnect() {
    console.log("Disconnected from socket");
    setConnected(false);
  }

  useEffect(() => {
    realtime.onConnect(onConnect);
    realtime.onDisconnect(onDisconnect);

    return () => {
      if (!connected) return;
      realtime.close();
      realtime.offAny(onConnect);
      realtime.offAny(onDisconnect);
    };
  }, [connected]);

  return { realtime, connected };
}

export const useSocketStore = create<{
  realtime: RealtimeManager;
  setRealtime: (realtime: RealtimeManager) => void;
  setConnected: (isConnected: boolean) => void;
  connected: boolean;
}>()(
  devtools(
    (set) => ({
      realtime: Agnost.getBrowserClient().realtime,
      connected: false,
      setRealtime: (realtime) => set({ realtime }),
      setConnected: (connected) => set({ connected }),
    }),
    {
      name: "socket-storage",
    },
  ),
);
