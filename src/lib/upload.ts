/**
 * Utility functions for file upload operations
 */
import { getPublicUrl } from './tebi';

// Calculate SHA-256 hash of a file
export async function calculateFileHash(file: File): Promise<string> {
	console.log("🔢 CLIENT: Starting file hash calculation...");
	const arrayBuffer = await file.arrayBuffer();
	console.log(
		"🔢 CLIENT: File converted to arrayBuffer, size:",
		arrayBuffer.byteLength
	);

	const hashBuffer = await globalThis.crypto.subtle.digest(
		"SHA-256",
		arrayBuffer
	);
	console.log("🔢 CLIENT: Hash calculated");

	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const fileHash = hashArray
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");

	console.log("🔢 CLIENT: File hash:", fileHash);
	return fileHash;
}

// Request presigned upload URL from API
export async function requestUploadUrl(
	fileHash: string,
	fileName: string,
	contentType: string
) {
	console.log("📡 CLIENT: Calling API for presigned URL...");

	const requestBody = {
		fileHash,
		fileName,
		contentType,
	};

	console.log("📡 CLIENT: Request body:", requestBody);

	const response = await fetch("/api/upload-url", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(requestBody),
	});

	console.log("📡 CLIENT: API response status:", response.status);
	console.log("📡 CLIENT: API response ok:", response.ok);

	const data = await response.json();
	console.log("📡 CLIENT: API response data:", data);

	if (!response.ok) {
		console.error("❌ CLIENT: API request failed:", data);
		throw new Error(data.error || "Failed to get upload URL");
	}

	return data;
}

// Upload file to Tebi with progress tracking
export async function uploadToTebi(
	uploadUrl: string,
	file: File,
	fileHash: string,
	onProgress: (progress: number) => void
): Promise<string> {
	console.log("📤 CLIENT: Starting upload to Tebi...");
	console.log("📤 CLIENT: Upload URL:", uploadUrl);

	return new Promise((resolve, reject) => {
		console.log("📤 CLIENT: Creating XMLHttpRequest...");
		const xhr = new XMLHttpRequest();

		xhr.upload.onprogress = (event) => {
			if (event.lengthComputable) {
				const progress = Math.round((event.loaded / event.total) * 100);
				console.log("📊 CLIENT: Upload progress:", progress + "%");
				onProgress(progress);
			}
		};

		xhr.onload = () => {
			console.log("📤 CLIENT: Upload completed, status:", xhr.status);
			if (xhr.status >= 200 && xhr.status < 300) {
				console.log("✅ CLIENT: Upload successful!");
				// Use the correct public URL with fileHash
				const publicUrl = getPublicUrl(fileHash);
				console.log("🔗 CLIENT: Clean public URL:", publicUrl);
				resolve(publicUrl);
			} else {
				console.error("❌ CLIENT: Upload failed with status:", xhr.status);
				reject(new Error("Upload to Tebi failed"));
			}
		};

		xhr.onerror = () => {
			console.error("❌ CLIENT: Upload network error");
			reject(new Error("Upload failed"));
		};

		console.log("📤 CLIENT: Starting XMLHttpRequest...");
		xhr.open("PUT", uploadUrl);
		xhr.setRequestHeader("Content-Type", file.type);
		xhr.send(file);
	});
}
