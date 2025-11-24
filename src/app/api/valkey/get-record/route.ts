import { NextRequest, NextResponse } from "next/server";
import { getFileRecord } from "@/lib/valkey-operations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { shortId } = body;

    if (!shortId) {
      return NextResponse.json(
        { error: "Missing shortId" },
        { status: 400 }
      );
    }

    const record = await getFileRecord(shortId);

    if (!record) {
      return NextResponse.json(
        { error: "File not found or expired" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      record: record
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to retrieve file record" },
      { status: 500 }
    );
  }
}
