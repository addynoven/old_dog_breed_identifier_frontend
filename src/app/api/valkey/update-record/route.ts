import { NextRequest, NextResponse } from "next/server";
import { updateFileRecord } from "@/lib/valkey-operations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { shortId, data } = body;

    if (!shortId || !data) {
      return NextResponse.json(
        { error: "Missing shortId or data" },
        { status: 400 }
      );
    }

    await updateFileRecord(shortId, data);

    return NextResponse.json({
      success: true,
      message: "File record updated successfully"
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update file record" },
      { status: 500 }
    );
  }
}
