import { NextResponse } from "next/server";
import { Message } from "@ai-sdk/react";
import fs from "fs";
import path from "path";

// Define the expected structure of the CHATS data
interface ChatsData {
  [key: string]: any; // Value can be any if we only care about keys
}

// Helper function to read and parse the JSON data
async function getChatsData(): Promise<ChatsData> {
  const jsonPath = path.join(process.cwd(), "data", "chats.json");
  const jsonData = await fs.promises.readFile(jsonPath, "utf-8");
  return JSON.parse(jsonData) as ChatsData;
}

export async function GET() {
  try {
    const CHATS = await getChatsData();
    return NextResponse.json(Object.keys(CHATS));
  } catch (error) {
    console.error("Failed to read or parse chats.json:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
