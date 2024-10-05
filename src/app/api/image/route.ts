import { Jimp } from "jimp";

type Body = {
  lng: number;
  lat: number;
  maxCloudCoverage?: number;
  email: string;
  from: string;
  to: string;
};

const getRequestForm = (
  lng: number,
  lat: number,
  maxCloudCoverage: number,
  from: string,
  to: string,
) => {
  const range = 0.01;
  const bbox = [lng - range, lat - range, lng + range, lat + range];
  const requestBody = {
    input: {
      bounds: {
        properties: {
          crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        },
        bbox: bbox,
      },
      data: [
        {
          type: "landsat-ot-l1",
          dataFilter: {
            maxCloudCoverage: maxCloudCoverage,
            timeRange: {
              from,
              to,
            },
          },
        },
      ],
    },
    output: {
      width: 512,
      height: 512,
    },
  };

  const evalscript = `
    //VERSION=3
    function setup() {
      return {
        input: ["B02", "B03", "B04"],
        output: {
          bands: 3,
          sampleType: "AUTO"
        }
      }
    }
    function evaluatePixel(sample) {
      return [2.5 * sample.B04, 2.5 * sample.B03, 2.5 * sample.B02]
    }
  `;

  const form = new FormData();
  form.append("request", JSON.stringify(requestBody));
  form.append("evalscript", evalscript);

  console.log(form.get("request"));

  return form;
};

let cachedAccessToken: string | null = null;

const getAccessToken = async () => {
  const { SENTINEL_HUB_CLIENT_ID, SENTINEL_HUB_CLIENT_SECRET } = process.env;
  const client_id = SENTINEL_HUB_CLIENT_ID;
  const client_secret = SENTINEL_HUB_CLIENT_SECRET;
  if (!client_id || !client_secret) {
    throw new Error("Missing Sentinel Hub credentials");
  }
  if (cachedAccessToken) {
    return cachedAccessToken;
  }

  const body = new URLSearchParams({
    client_id,
    client_secret,
    grant_type: "client_credentials",
  }).toString();

  const response = await fetch(
    `https://services.sentinel-hub.com/auth/realms/main/protocol/openid-connect/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    },
  );

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }
  const token = data.access_token;
  cachedAccessToken = token;
  return token;
};

const daysAgo = (days: number) => {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
};

const getPixelGrid = async (buffer: ArrayBuffer) => {
  const image = await Jimp.read(buffer);

  const { width, height } = image.bitmap;

  const grid = [];
  for (const x of [-1, 0, 1]) {
    for (const y of [-1, 0, 1]) {
      const color = image.getPixelColor(
        Math.floor(width / 2) + x,
        Math.floor(height / 2) + y,
      );
      grid.push(color);
    }
  }

  return grid;
};

export async function POST(request: Request) {
  const body: Body = await request.json();
  const {
    lng,
    lat,
    maxCloudCoverage = 100,
    email,
    from = daysAgo(3).toISOString(),
    to = new Date().toISOString(),
  } = body;

  const accessToken = await getAccessToken();

  const formRequest = getRequestForm(lng, lat, maxCloudCoverage, from, to);
  const response = await fetch(
    `https://services-uswest2.sentinel-hub.com/api/v1/process`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formRequest,
    },
  );

  if (!response.ok) {
    console.log(await response.text());
    return new Response(response.statusText, {
      status: response.status,
    });
  }

  const imageData = await response.arrayBuffer();
  const color = await getPixelGrid(imageData);

  const headers = new Headers(response.headers);
  return new Response(
    JSON.stringify({
      color,
    }),
    {
      status: response.status,
      headers,
    },
  );
}
