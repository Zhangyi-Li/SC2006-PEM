/** @format */

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // return hello world to indicate api passed through
    return NextResponse.json({
      message: "Hello World",
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
