import { Jimp } from "jimp";
import { getPhotoFromSentinel } from "@/server/utils/getPhotoFromSentinel";
import { loadPngFileToS3 } from "@/server/utils/loadPngFileToS3";

export async function getPixelSVGAndLoadS3Photo(
  lng: number,
  lat: number,
  maxCloudCoverage: number,
  time: string,
  formId: string,
) {
  const ms = new Date(time).getTime();
  const timeStart = new Date(ms - 1000 * 60 * 60 * 24).toISOString();
  const timeEnd = new Date(ms + 1000 * 60 * 60 * 24).toISOString();

  const imageData = await getPhotoFromSentinel(
    lng,
    lat,
    maxCloudCoverage,
    timeStart,
    timeEnd,
  );

  const gridUrl = await getPixelGrid(imageData);

  const photoUrl = await loadPngFileToS3(Buffer.from(imageData), formId);

  return {
    gridUrl,
    photoUrl,
  };
}

const getPixelGrid = async (buffer: ArrayBuffer) => {
  const image = await Jimp.read(buffer);

  const { width, height } = image.bitmap;

  const grid: string[] = [];

  for (const x of [-1, 0, 1]) {
    for (const y of [-1, 0, 1]) {
      const color = image.getPixelColor(
        Math.floor(width / 2) + x,
        Math.floor(height / 2) + y,
      );
      grid.push(`${color.toString(16)}`);
    }
  }

  return `https://imgenx.vercel.app/img?s=300x300&fill=0xffffff&l=shp:rect;w:100,h:100,c:0x${grid[0]}|shp:rect;x:100,w:100,h:100,c:0x${grid[1]}|shp:rect;x:200,w:100,h:100,c:0x${grid[2]}|shp:rect;y:100,w:100,h:100,c:0x${grid[3]}|shp:rect;x:100,y:100,w:100,h:100,c:0x${grid[4]}|shp:rect;x:200,y:100,w:100,h:100,c:0x${grid[5]}|shp:rect;y:200,w:100,h:100,c:0x${grid[6]}|shp:rect;x:100,y:200,w:100,h:100,c:0x${grid[7]}|shp:rect;x:200,y:200,w:100,h:100,c:0x${grid[8]}`;
};
