import { S3 } from "@aws-sdk/client-s3";

export const s3 = new S3({
  region: String(process.env.S3_AWS_REGION),
  credentials: {
    accessKeyId: String(process.env.S3_ACCESS_KEY),
    secretAccessKey: String(process.env.S3_SECRET_ACCESS_KEY),
  },
});
