import { db } from "@/server/db";

export async function insertIntoImagesRequestTable(
  form_id: string,
  image_url: string,
) {
  return db
    .insertInto("image_requests")
    .values({
      submitted_forms_id: form_id,
      link: image_url,
    })
    .executeTakeFirst();
}
