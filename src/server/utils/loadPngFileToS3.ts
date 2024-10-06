import { s3 } from "../s3";

export async function loadPngFileToS3(data: Buffer) {
  const key = generateFileName();
  const bucket = process.env.S3_BUCKET_NAME;
  const region = process.env.S3_AWS_REGION;

  console.log(key);
  await s3
    .putObject({
      Bucket: bucket,
      Key: key,
      Body: data,
      ContentType: "image/png",
    })
    .catch((err) => {
      console.error(err);
      throw new Error("Failed to upload image to S3");
    });

  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

export function generateFileName() {
  return new Date().getTime().toString() + ".png";
}
