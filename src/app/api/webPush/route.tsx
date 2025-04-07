/** @format */

import { NextRequest, NextResponse } from "next/server";

const webPush = require("web-push");

webPush.setVapidDetails(
  "mailto:test@example.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export const runtime = "nodejs"; // Explicitly set to Node.js runtime

export async function POST(req: NextRequest) {
  try {
    const { subscription, message } = await req.json();

    // Validate structure
    if (
      !subscription?.endpoint ||
      !subscription?.keys?.auth ||
      !subscription?.keys?.p256dh
    ) {
      return NextResponse.json(
        { error: "Invalid subscription object" },
        { status: 400 }
      );
    }

    await webPush.sendNotification(
      subscription,
      JSON.stringify({
        title: "🔔 SG Parks Condition Notification",
        body: message || "This is your notification!",
      })
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Push error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
