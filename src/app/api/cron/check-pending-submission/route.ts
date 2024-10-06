import { db } from "@/server/db";
import { sendEmail } from "@/server/utils/sendEmail";
import { getPixelSVGAndLoadS3Photo } from "@/server/utils/getImageSVG";

export const dynamic = "force-dynamic"; // static by default, unless reading the request

const MS_PER_HOUR = 1000 * 60 * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;

export async function GET(request: Request) {
  const now = new Date().getTime();

  const peopleToHaveSatelliteOverQ = db
    .selectFrom("submitted_forms")
    .select([
      "latitude",
      "longitude",
      "max_cloud_cover",
      "email",
      "id",
      "expected_pass_time",
    ])
    .where("type", "=", "acquisition")
    .where("has_satellite_passed_over", "=", false)
    .where("expected_pass_time", "is not", null)
    .execute();

  const peopleToNotifyQ = db
    .selectFrom("submitted_forms")
    .select([
      "lead_time",
      "latitude",
      "longitude",
      "max_cloud_cover",
      "email",
      "id",
      "expected_pass_time",
    ])
    .where("type", "=", "acquisition")
    .where("is_reminder_sent", "=", false)
    .where("expected_pass_time", "is not", null)
    .execute();

  const [peopleToHaveSatelliteOver, peopleToNotify] = await Promise.all([
    peopleToHaveSatelliteOverQ,
    peopleToNotifyQ,
  ]);

  const promises = [];

  for (const person of peopleToNotify) {
    if (!person.expected_pass_time) continue;

    const expectedTime = new Date(person.expected_pass_time).getTime();
    const delta = (expectedTime - now) / MS_PER_DAY;

    if (delta <= Number(person.lead_time)) {
      console.log("sending notification to", person.email);

      await sendEmail(person.email, {
        template_id: "landsat_notification",
        data: {
          latitude: person.latitude,
          longitude: person.longitude,
          max_cloud_cover: Number(person.max_cloud_cover),
          days_left: Number(person.lead_time),
          user_name: person.email,
        },
      });
      promises.push(
        db
          .updateTable("submitted_forms")
          .set("is_reminder_sent", true)
          .where("id", "=", person.id)
          .execute(),
      );
    }
  }

  for (const person of peopleToHaveSatelliteOver) {
    if (!person.expected_pass_time) continue;

    const expectedTime = new Date(person.expected_pass_time).getTime();
    const delta = expectedTime - now;
    const timeLeft = delta + MS_PER_HOUR * 6;

    if (timeLeft < 0) {
      const { svg, photoUrl } = await getPixelSVGAndLoadS3Photo(
        person.longitude,
        person.latitude,
        Number(person.max_cloud_cover),
        String(person.expected_pass_time),
        person.id,
      );

      await sendEmail(person.email, {
        template_id: "landsat_passed",
        data: {
          latitude: person.latitude,
          longitude: person.longitude,
          pass_date: new Date(expectedTime).toISOString(),
          max_cloud_cover: String(person.max_cloud_cover),
          user_name: person.email,
          map_image_link: photoUrl,
          svg: svg,
        },
      });

      console.log("sending notification to", person.email);

      promises.push(
        db
          .updateTable("submitted_forms")
          .set("has_satellite_passed_over", true)
          .where("id", "=", person.id)
          .execute(),
      );
    }
  }

  await Promise.all(promises);

  return new Response(`Hello from ${process.env.VERCEL_REGION}`);
}
