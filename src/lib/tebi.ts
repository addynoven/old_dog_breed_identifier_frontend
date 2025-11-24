import {
	S3Client,
	HeadObjectCommand,
	PutObjectCommand,
	DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
	endpoint: "https://s3.tebi.io",
	region: "global",
	credentials: {
		accessKeyId: process.env.TEBI_ACCESS_KEY!,
		secretAccessKey: process.env.TEBI_SECRET_KEY!,
	},
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any);

export async function checkFileExists(fileHash: string): Promise<boolean> {
	try {
		await s3Client.send(
			new HeadObjectCommand({
				Bucket: process.env.TEBI_BUCKET_NAME!,
				Key: fileHash,
			})
		);
		return true;
	} catch {
		return false;
	}
}

export async function getUploadUrl(
	fileHash: string,
	contentType: string
): Promise<string> {
	const putCommand = new PutObjectCommand({
		Bucket: process.env.TEBI_BUCKET_NAME!,
		Key: fileHash,
		ContentType: contentType,
	});

	return await getSignedUrl(s3Client, putCommand, {
		expiresIn: 3600, // 1 hour
	});
}

export async function deleteFile(fileHash: string): Promise<void> {
	await s3Client.send(
		new DeleteObjectCommand({
			Bucket: process.env.TEBI_BUCKET_NAME!,
			Key: fileHash,
		})
	);
}

export function getPublicUrl(fileHash: string): string {
	const bucketName = process.env.NEXT_PUBLIC_TEBI_BUCKET_NAME || process.env.TEBI_BUCKET_NAME;
	return `https://s3.tebi.io/${bucketName}/${fileHash}`;
}
