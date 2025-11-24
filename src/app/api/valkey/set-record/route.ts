import { NextRequest, NextResponse } from "next/server";
import { setFileRecord } from "@/lib/valkey-operations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { shortId, data } = body;

    if (!shortId || data === undefined) {
      return NextResponse.json(
        { error: "Missing shortId or data" },
        { status: 400 }
      );
    }

    await setFileRecord(shortId, data);

    return NextResponse.json({
      success: true,
      message: "File record stored successfully"
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to store file record" },
      { status: 500 }
    );
  }
}
