import { db } from "@/server/db";
import type { TFormSchema } from "@/app/schemes/formSchema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body: TFormSchema = await request.json();

  if (body.type === "acquisition") {
    const res = await db
      .insertInto("submitted_forms")
      .values(body)
      .returning("id")
      .executeTakeFirst();
  } else {
    // fetch data for a given date range and send an email
  }

  return NextResponse.json({
    ok: true,
    message: "Form submitted successfully",
  });
}
