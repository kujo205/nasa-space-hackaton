import { Jimp } from "jimp";

type Body = {
  lng: number;
  lat: number;
  maxCloudCoverage?: number;
  email: string;
  from: string;
  to: string;
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

const daysAgo = (days: number) => {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
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

  const color = await getPixelGrid(imageData);

  return new Response(
    JSON.stringify({
      color,
    }),
    {
      status: response.status,
    },
  );
}
