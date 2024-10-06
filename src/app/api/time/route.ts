import { db } from "@/server/db";
import { NextResponse } from "next/server";

// const apiKey = process.env.N2YO_API_KEY;
// const satellites = {
//   landsat8: 39084,
//   landsat9: 48274,
// };
//

type Body = {
  path: number;
};

export async function POST(request: Request) {
  const body = (await request.json()) as Body;
  const { path } = body;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const daysAgo = new Date(startOfToday);
  daysAgo.setDate(startOfToday.getDate() - 16);

  const result = await db
    .selectFrom("path")
    .innerJoin("path_metadata", "path.path", "path_metadata.path")
    .selectAll()
    .where("path.path", "=", path.toString())
    .where("path_metadata.date", ">=", daysAgo)
    .groupBy(["path_metadata.satellite", "path.path", "path_metadata.id"])
    .orderBy("path_metadata.date", "asc")
    .limit(10)
    .execute();

  // const nextPasses = await predictLandsat8Imaging(lat, lng);

  return NextResponse.json(result);
}

// async function predictLandsat8Imaging(lat: number, lng: number) {
//   const baseUrl = "https://api.n2yo.com/rest/v1/satellite";
//   const endpoint = "visualpasses";
//   const days = 30; // Predict for the next 30 days
//   const minElevation = 5; // Minimum elevation for consideration
//
//   const url = `${baseUrl}/${endpoint}/${satellites.landsat8}/${lat}/${lng}/0/${days}/${minElevation}/&apiKey=${apiKey}`;
//
//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const data = await response.json();
//
//     if (data.passes && data.passes.length > 0) {
//       console.log(
//         `Analyzing ${data.passes.length} passes of Landsat-8 over the next ${days} days...`,
//       );
//
//       const imagingPasses = data.passes.filter((pass) => {
//         // Landsat-8 has a 16-day repeat cycle
//         const daysSinceEpoch = Math.floor(pass.startUTC / 86400);
//         const inCycle = daysSinceEpoch % 16 === 0;
//
//         // Landsat-8 typically images when the sun elevation is between 25 and 75 degrees
//         const sunElevation = calculateSunElevation(lat, lng, pass.startUTC);
//         const goodSunAngle = sunElevation >= 25 && sunElevation <= 75;
//
//         // Landsat-8 has a ~185km swath width, so it can image areas within about 92.5km of its ground track
//         const withinSwath = pass.maxEl >= 70; // Approximation
//
//         return inCycle && goodSunAngle && withinSwath;
//       });
//
//       if (imagingPasses.length > 0) {
//         console.log(`Found ${imagingPasses.length} potential imaging passes:`);
//         imagingPasses.forEach((pass) => {
//           const passTime = new Date(pass.startUTC * 1000).toUTCString();
//           console.log(
//             `- ${passTime} (Max elevation: ${pass.maxEl.toFixed(2)}°)`,
//           );
//         });
//       } else {
//         console.log(
//           "No suitable imaging passes found in the predicted timeframe.",
//         );
//       }
//     } else {
//       console.log("No passes found in the specified timeframe.");
//     }
//   } catch (error) {
//     console.error("Error fetching or processing satellite pass data:", error);
//   }
// }
//
// function calculateSunElevation(lat, lng, timestamp) {
//   // This is a simplified calculation and may not be entirely accurate
//   // For precise calculations, consider using a dedicated astronomy library
//   const date = new Date(timestamp * 1000);
//   const dayOfYear = getDayOfYear(date);
//   const declination =
//     23.45 * Math.sin((Math.PI / 180) * (360 / 365) * (dayOfYear - 81));
//   const hourAngle =
//     (12 - (date.getUTCHours() + date.getUTCMinutes() / 60)) * 15;
//
//   const elevation =
//     (Math.asin(
//       Math.sin((lat * Math.PI) / 180) *
//         Math.sin((declination * Math.PI) / 180) +
//         Math.cos((lat * Math.PI) / 180) *
//           Math.cos((declination * Math.PI) / 180) *
//           Math.cos((hourAngle * Math.PI) / 180),
//     ) *
//       180) /
//     Math.PI;
//
//   return elevation;
// }

// function getDayOfYear(date) {
//   const start = new Date(date.getFullYear(), 0, 0);
//   const diff = date - start;
//   const oneDay = 1000 * 60 * 60 * 24;
//   return Math.floor(diff / oneDay);
// }
//
// // Usage
// const latitude = 51.558; // Replace with your latitude
// const longitude = 23.835; // Replace with your longitude
//
// predictLandsat8Imaging(latitude, longitude);

// async function getNextSatellitePass(
//   satelliteId: number,
//   lat: number,
//   lng: number,
//   alt = 0,
// ) {
//   const baseUrl = "https://api.n2yo.com/rest/v1/satellite";
//   const endpoint = "visualpasses";
//   const days = 10;
//   const minElevation = 20;
//
//   const url = `${baseUrl}/${endpoint}/${satelliteId}/${lat}/${lng}/${alt}/${days}/${minElevation}/&apiKey=${apiKey}`;
//
//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const data = await response.json();
//
//     console.log(data);
//
//     if (data.error) {
//       throw new Error(data.error);
//     }
//
//     const passes = [];
//     if (data.passes && data.passes.length > 0) {
//       for (const pass of data.passes) {
//         const startTime = new Date(pass.startUTC * 1000);
//         const endTime = new Date(pass.endUTC * 1000);
//         passes.push({ startTime, endTime });
//       }
//       return NextResponse.json(passes);
//     } else {
//       throw new Error("No passes found");
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }

// const mapServiceURL =
//   "https://nimbus.cr.usgs.gov/arcgis/rest/services/LLook_Outlines/MapServer/1/";
//
// type Body = {
//   lat: number;
//   lng: number;
// };
//
// export async function POST(request: Request) {
//   const body: Body = await request.json();
//   const { lat, lng } = body;
//   const time = await getNextAcuqisitionDate(lat, lng);
//
//   return {
//     status: 200,
//     headers: { "content-type": "application/json" },
//     body: JSON.stringify(time),
//   };
// }
//
// async function getNextAcuqisitionDate(lat: number, lon: number) {
//   const dir = "D"; // can be "D" or "A"
//
//   const dataRaw = await fetch(
//     `${mapServiceURL}query?where=MODE='${dir}'&geometry=${lon},${lat}&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=false&returnTrueCurves=false&returnIdsOnly=false&returnCountOnly=false&returnZ=false&returnM=false&returnDistinctValues=false&f=json`,
//   );
//   const json = await dataRaw.json();
//
//   for (let i = 1; i < json.features.length; i++) {
//     const path = json.features[i].attributes.PATH;
//     const row = json.features[i].attributes.ROW;
//
//     // showFootPrint(L, path, row, dir, multiple_points);
//     // showLatLon(L, map, lat, lon, multiple_points);
//
//     const nextAcq = await nextAcquisitionDate(path);
//
//     console.log(nextAcq);
//   }
// }
//
// async function nextAcquisitionDate(path: string) {
//   const dateSeconds = new Date().getTime() / 1000;
//
//   const cycleSeconds = 60 * 60 * 24 * 16;
//
//   const pathSeconds = dateSeconds % cycleSeconds;
//
//   const pathDateObj = new Date(pathSeconds * 1000);
//
//   //to be used with cycles hard coded
//   const currentDate = new Date();
//   const currentYear = currentDate.getFullYear();
//   let fullPath = "";
//   let pathDate;
//
//   if (currentYear > 2020) {
//     fullPath =
//       "https://landsat.usgs.gov/sites/default/files/landsat_acq/assets/json/cycles_full.json";
//     pathDate =
//       currentDate.getMonth() +
//       1 +
//       "/" +
//       currentDate.getDate() +
//       "/" +
//       currentDate.getFullYear();
//   } else {
//     fullPath =
//       "https://landsat.usgs.gov/sites/default/files/landsat_acq/assets/json/cycles.json";
//     pathDate =
//       pathDateObj.getUTCMonth() +
//       1 +
//       "/" +
//       pathDateObj.getUTCDate() +
//       "/" +
//       pathDateObj.getUTCFullYear();
//   }
//
//   let nextAcqL8 = "-";
//   let nextAcqL9 = "-";
//
//   path = path + "";
//
//   const respRaw = await fetch(fullPath);
//   const data = await respRaw.json();
//
//   const todayCycleL8 = data["landsat_8"][pathDate]["cycle"];
//   const todayCycleL9 = data["landsat_9"][pathDate]["cycle"];
//
//   for (let i = 1; i <= 16; i++) {
//     const thePath = data["landsat_8"]["1/" + i + "/2024"]["path"];
//
//     const pathSplit = thePath.split(",");
//
//     if (pathSplit.indexOf(path) > -1) {
//       const cycle = data["landsat_8"]["1/" + i + "/2024"]["cycle"];
//
//       let diff = cycle - todayCycleL8;
//
//       if (diff < 0) {
//         diff = diff + 16;
//       }
//
//       const pathDateObj = new Date();
//
//       pathDateObj.setDate(pathDateObj.getDate() + diff);
//
//       nextAcqL8 =
//         pathDateObj.getUTCMonth() +
//         1 +
//         "/" +
//         pathDateObj.getUTCDate() +
//         "/" +
//         pathDateObj.getUTCFullYear();
//     }
//   }
//
//   for (let i = 1; i <= 31; i++) {
//     const thePath = data["landsat_9"]["1/" + i + "/2024"]["path"];
//
//     const pathSplit = thePath.split(",");
//
//     if (pathSplit.indexOf(path) > -1) {
//       const cycle = data["landsat_9"]["1/" + i + "/2024"]["cycle"];
//
//       let diff = cycle - todayCycleL9;
//
//       if (diff < 0) {
//         diff = diff + 16;
//       }
//
//       const pathDateObj = new Date();
//
//       pathDateObj.setDate(pathDateObj.getDate() + diff);
//
//       nextAcqL9 =
//         pathDateObj.getUTCMonth() +
//         1 +
//         "/" +
//         pathDateObj.getUTCDate() +
//         "/" +
//         pathDateObj.getUTCFullYear();
//     }
//   }
//
//   return { L8: nextAcqL8, L9: nextAcqL9 };
// }
