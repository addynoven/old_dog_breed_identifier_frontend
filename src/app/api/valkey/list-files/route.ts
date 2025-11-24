import { createClient } from "redis";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function createValkeyClient() {
	const client = createClient({
		url: process.env.AIVEN_VALKEY_URI,
		socket: {
			connectTimeout: 60000,
		},
	});

	await client.connect();
	return client;
}

export async function GET(request: NextRequest) {
	try {
		const client = await createValkeyClient();

		try {
			const keys = await client.keys("file:*");

			if (keys.length === 0) {
				return NextResponse.json({ files: [] });
			}

			const fileRecords = await Promise.all(
				keys.map(async (key) => {
					const data = await client.get(key);
					if (!data) return null;

					try {
						const record = JSON.parse(data);
						const shortId = key.replace("file:", "");

						const now = new Date();
						const expiresAt = new Date(record.expiresAt);

						if (now > expiresAt) {
							await client.del(key);
							return null;
						}
						
						const baseUrl = new URL(request.url).origin;
						return {
							id: shortId,
							shortId,
							fileName: record.fileName,
							s3Url: record.s3Url,
							expiresAt: record.expiresAt,
							downloadCount: record.downloadCount || 0,
							shareUrl: `${baseUrl}/f/${shortId}`,
						};
					} catch {
						return null;
					}
				})
			);

			const validFiles = fileRecords
				.filter((record): record is NonNullable<typeof record> => record !== null)
				.sort((a, b) => new Date(b.expiresAt).getTime() - new Date(a.expiresAt).getTime());

			return NextResponse.json({ files: validFiles });
		} finally {
			if (client.isOpen) {
				await client.quit();
			}
		}
	} catch {
		return NextResponse.json(
			{ error: "Failed to fetch files" },
			{ status: 500 }
		);
	}
}
