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
  const timeStart = new Date(ms).toISOString();
  const timeEnd = new Date(time + 1000 * 60 * 60 * 24).toISOString();

  const imageData = await getPhotoFromSentinel(
    lng,
    lat,
    maxCloudCoverage,
    timeStart,
    timeEnd,
  );

  const colorArray = await getPixelGrid(imageData);

  const photoUrl = await loadPngFileToS3(Buffer.from(imageData), formId);

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
  <rect x="0" y="0" width="100" height="100" fill="${colorArray[0].toString(16)}"/>
  <rect x="100" y="0" width="100" height="100" fill="${colorArray[1].toString(16)}" />
  <rect x="200" y="0" width="100" height="100" fill="${colorArray[2].toString(16)}" />
  <rect x="0" y="100" width="100" height="100" fill="${colorArray[3].toString(16)}" />
  <rect x="100" y="100" width="100" height="100" fill="${colorArray[4].toString(16)}" />
  <rect x="200" y="100" width="100" height="100" fill="${colorArray[5].toString(16)}" />
  <rect x="0" y="200" width="100" height="100" fill="${colorArray[6].toString(16)}" />
  <rect x="100" y="200" width="100" height="100" fill="${colorArray[7].toString(16)}" />
  <rect x="200" y="200" width="100" height="100" fill="${colorArray[8].toString(16)}" />
</svg>
  `;

  return {
    svg,
    photoUrl,
  };
}

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
