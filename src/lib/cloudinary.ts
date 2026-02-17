import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

export async function uploadImage(image: File) {
  try {
    // Convert File to buffer
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Compress image with sharp
    const compressedBuffer = await sharp(buffer)
      .resize(1920, 1080, {
        withoutEnlargement: true,
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Convert compressed buffer to base64 Data URI
    const base64 = compressedBuffer.toString("base64");
    const dataURI = `data:image/jpeg;base64,${base64}`;

    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      resource_type: "image",
      folder: "review-destinations",
    });

    return uploadResult;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image");
  }
}
