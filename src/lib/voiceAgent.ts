"use client";

import { RealtimeAgent, RealtimeSession } from "@openai/agents-realtime";

export async function setupVoiceAgent(ephemeralKey: string) {
  const agent = new RealtimeAgent({
    name: "Assessly Assistant",
    instructions: "You are a helpful voice assistant that helps users with their assessments.",
  });

  const session = new RealtimeSession(agent);

  try {
    await session.connect({
      apiKey: ephemeralKey,
    });

    console.log("Connected to Realtime Voice Agent via WebRTC");

    session.sendMessage("Say a warm greeting to the user and ask how their assessment is going.");

    return session;
  } catch (err) {
    console.error("Failed to connect to Realtime Voice Agent:", err);
    throw err;
  }
}

