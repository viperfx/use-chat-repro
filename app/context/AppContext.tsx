"use client";

import React, { createContext, useContext, ReactNode, useMemo } from "react";
import { useParams } from "next/navigation";
import { useChat, Message } from "@ai-sdk/react";
import useSWR from "swr";

interface AppContextType {
  messages: Message[];
  conversationId: string | undefined;
  keys: string[];
  isLoadingMessages: boolean;
  isLoadingKeys: boolean;
}

// const CHATS: Record<string, Message[]> = { ... }; // Removed CHATS constant

const AppContext = createContext<AppContextType | undefined>(undefined);

// Fetcher function for SWR to get messages for a specific chat from the API
const fetchChatMessagesAPI = async (url: string): Promise<Message[]> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch chat messages");
  }
  const data = await response.json();
  // Convert createdAt from string to Date object
  return data.map((message: any) => ({
    ...message,
    createdAt: new Date(message.createdAt),
  }));
};

// Fetcher function for SWR to get all chat keys from the API
const fetchChatKeysAPI = async (url: string): Promise<string[]> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch chat keys");
  }
  return response.json();
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { conversationId } = useParams<{ conversationId: string }>();

  // Use SWR to fetch messages for the current conversationId from the API
  const { data: currentChatMessages, isLoading: isLoadingMessages } = useSWR<
    Message[]
  >(
    conversationId ? `/api/chat/${conversationId}` : null, // Key for SWR
    fetchChatMessagesAPI // The fetcher function
  );

  // Use SWR to fetch all chat keys from the API
  const { data: chatKeys, isLoading: isLoadingKeys } = useSWR<string[]>(
    "/api/chat", // API endpoint for chat keys
    fetchChatKeysAPI // The fetcher function
  );

  const initialMessages = useMemo(() => {
    return currentChatMessages || [];
  }, [currentChatMessages]);

  const { messages } = useChat({
    id: conversationId,
    initialMessages,
  });

  const keys = useMemo(() => chatKeys || [], [chatKeys]);

  return (
    <AppContext.Provider
      value={{
        messages,
        conversationId,
        keys,
        isLoadingMessages,
        isLoadingKeys,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
