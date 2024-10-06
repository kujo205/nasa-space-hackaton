const token = process.env.MAILERSEND_ACCESS_TOKEN;

const templateMap = {
  landsat_passed: "neqvygmmz5wg0p7w",
  landsat_notification: "0p7kx4xv1o8l9yjr",
  historical_data: "ynrw7gyk9qk42k8e",
} as const;

type Keys = keyof typeof templateMap;

type TemplateData = {
  landsat_passed: {
    user_name: string;
    latitude: number;
    longitude: number;
    pass_date: string;
    max_cloud_cover: string;
    map_image_link: string;
    pixel_image_link: string;
  };
  landsat_notification: {
    user_name: string;
    days_left: number;
    hours_left: number;
    max_cloud_cover: number; // 0-100
    latitude: number;
    longitude: number;
  };
  historical_data: {
    user_name: string; // email
    latitude: number;
    longitude: number;
    hist_start_date: string;
    hist_end_date: string;
    max_cloud_cover: number; // 0-100
    map_image_link: string;
  };
};

type Template<T extends Keys> = {
  template_id: T;
  data: TemplateData[T];
};

export async function sendEmail<T extends Keys>(
  email: string,
  template: Template<T>,
) {
  console.log(`[sending a ${template.template_id} email]`);

  console.log(template);

  const res = await fetch("https://api.mailersend.com/v1/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      from: {
        email: "info@space-crammers.earth",
        name: "Space Crammers",
      },
      to: [
        {
          email: email,
          name: email,
        },
      ],
      template_id: templateMap[template.template_id],
      tags: [],
      personalization: [
        {
          email: email,
          data: template.data,
        },
      ],
    }),
  });
  // const resParsed = await res.json();

  if (res.ok) {
    console.log(`[email is sent successfully]`);
  } else {
    console.error(`[email is not sent successfully]`);
  }

  return res;
}
