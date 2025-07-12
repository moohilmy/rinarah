import { v2 as cloudinary } from "cloudinary";
type typeImage = { url: string; publicID: string };
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});
export const cloudinaryUploadImage = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const bytes = Buffer.from(buffer);
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "auto",
          timeout: 120000,
        },
        async (error, result) => {
          if (error) {
            return reject(error.message);
          }
          if (!result) {
            return reject("No result returned from Cloudinary.");
          }
          return resolve({
            url: result.secure_url,
            publicID: result.public_id,
          });
        }
      )
      .end(bytes);
  });
};
export const cloudinaryUploadMultipleImages = async (
  filesToUpload: File[]
): Promise<typeImage[] | undefined> => {
  try {
    const uploadPromises = filesToUpload.map((file) =>
      cloudinaryUploadImage(file)
    );
    const results = await Promise.all(uploadPromises);
    return results as typeImage[];
  } catch (error) {
    console.error("Cloudinary Multiple Upload Error:", error);
    return undefined;
  }
};
