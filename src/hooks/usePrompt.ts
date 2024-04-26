"use client";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const usePrompt = create<{
  prompt: string | undefined;
  setPrompt: (prompt: string | undefined) => void;
  channelId: string | undefined;
  setChannelId: (channelId: string | undefined) => void;
  generateChannelId: () => string;
}>()(
  devtools(
    (set) => ({
      prompt: undefined,
      channelId: undefined,
      setPrompt: (prompt) => set({ prompt }),
      setChannelId: (channelId) => set({ channelId }),
      generateChannelId: () => {
        const channelId = uuidv4();
        set({ channelId });
        return channelId;
      },
    }),
    {
      name: "prompt-storage",
    },
  ),
);
