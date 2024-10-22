import { db } from "@/server/db";
import type { TFormSchema } from "@/app/schemes/formSchema";
import { NextResponse } from "next/server";
import { getPhotoFromSentinel } from "@/server/utils/getPhotoFromSentinel";
import { loadPngFileToS3 } from "@/server/utils/loadPngFileToS3";
import { sendEmail } from "@/server/utils/sendEmail";

export async function POST(request: Request) {
  const body: TFormSchema = await request.json();

  console.log("[inserting data]");
  const res = await db
    .insertInto("submitted_forms")
    .values({
      ...body,
      lead_time: body.lead_time || null,
    })
    .returning("id")
    .executeTakeFirst();

  if (body.type === "acquisition") {
    return NextResponse.json({
      ok: true,
      message: `Form submitted successfully, expect satellite pass on ${String(body?.expected_pass_time).split("T")[0]}`,
    });
  } else if (body.type === "historic") {
    const photoBuffer = await getPhotoFromSentinel(
      body.longitude,
      body.latitude,
      body.max_cloud_cover,
      String(body.span_start_time),
      String(body.span_end_time),
    );

    const link = await loadPngFileToS3(Buffer.from(photoBuffer), res!.id);

    console.log("image url", link);

    await sendEmail(body.email, {
      template_id: "historical_data",
      data: {
        latitude: body.latitude,
        longitude: body.longitude,
        hist_start_date: new Date(String(body.span_start_time))
          .toISOString()
          .split("T")[0],
        hist_end_date: new Date(String(body.span_end_time))
          .toISOString()
          .split("T")[0],
        max_cloud_cover: body.max_cloud_cover,
        user_name: body.email,
        map_image_link: link,
      },
    });
    // fetch data for a given date range and send an email
  }

  return NextResponse.json({
    ok: true,
    message: `Form submitted successfully, check ${body.email}'s mailbox`,
  });
}
