import { NextRequest, NextResponse } from "next/server";
import { checkFileExists, getUploadUrl, getPublicUrl } from "@/lib/tebi";

export async function POST(request: NextRequest) {
	console.log("📥 API Route: POST request received");

	try {
		const body = await request.json();
		const { fileHash, fileName, contentType } = body;

		console.log("📥 Request:", { fileHash, fileName, contentType });

		// Check if file already exists
		console.log("🔍 Checking if file exists...");
		const fileExists = await checkFileExists(fileHash);

		if (fileExists) {
			console.log("✅ File exists! Returning existing URL");
			const existingUrl = getPublicUrl(fileHash);
			console.log("✅ Existing URL:", existingUrl);

			return NextResponse.json({
				exists: true,
				url: existingUrl,
			});
		} else {
			console.log("🔍 File doesn't exist, creating presigned URL");
			const uploadUrl = await getUploadUrl(fileHash, contentType);
			console.log("✅ Presigned URL generated successfully");

			return NextResponse.json({
				exists: false,
				uploadUrl: uploadUrl,
			});
		}
	} catch (error) {
		console.error("❌ API Route Error:", error);
		return NextResponse.json(
			{
				error: "Failed to generate upload URL",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		);
	}
}
