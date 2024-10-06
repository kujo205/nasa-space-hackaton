import { s3 } from "../s3";
import { insertIntoImagesRequestTable } from "./insertIntoPhotosTable";

export async function loadPngFileToS3(data: Buffer, formId: string) {
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

  const link = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

  await insertIntoImagesRequestTable(formId, link);

  return link;
}

export function generateFileName() {
  return new Date().getTime().toString() + ".png";
}
