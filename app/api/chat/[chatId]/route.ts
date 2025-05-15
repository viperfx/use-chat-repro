import { type NextRequest, NextResponse } from "next/server";
import { Message } from "@ai-sdk/react";
import fs from "fs";
import path from "path";

// Define the expected structure of the CHATS data
interface ChatsData {
  [key: string]: Message[];
}

// Helper function to read and parse the JSON data
async function getChatsData(): Promise<ChatsData> {
  const jsonPath = path.join(process.cwd(), "data", "chats.json");
  const jsonData = await fs.promises.readFile(jsonPath, "utf-8");
  return JSON.parse(jsonData) as ChatsData;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  const chatId = params.chatId;
  try {
    const CHATS = await getChatsData();
    const chatMessages = CHATS[chatId];

    if (!chatMessages) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // The createdAt fields are already strings from JSON, matching client expectation after API call.
    // AppContext.tsx will convert them to Date objects.
    return NextResponse.json(chatMessages);
  } catch (error) {
    console.error("Failed to read or parse chats.json:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
