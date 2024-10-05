import { db } from "@/server/db";
import type { TFormSchema } from "@/app/schemes/formSchema";
import { NextResponse } from "next/server";
import { getPhotoFromSentinel } from "@/server/utils/getPhotoFromSentinel";
import { loadPngFileToS3 } from "@/server/utils/loadPngFileToS3";
import * as fs from "node:fs";

export async function POST(request: Request) {
  const body: TFormSchema = await request.json();

  if (body.type === "acquisition") {
    // fetch send back a prediction date
  } else if (body.type === "historic") {
    const photoBuffer = await getPhotoFromSentinel(
      body.longitude,
      body.latitude,
      body.max_cloud_cover,
      String(body.span_start_time),
      String(body.span_end_time),
    );

    const name = await loadPngFileToS3(Buffer.from(photoBuffer));

    console.log("image url", name);
    // fetch data for a given date range and send an email
  }

  const res = await db
    .insertInto("submitted_forms")
    .values(body)
    .returning("id")
    .executeTakeFirst();

  return NextResponse.json({
    ok: true,
    message: "Form submitted successfully",
  });
}
