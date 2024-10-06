import { populate } from "@/server/helpers/populate";
import { NextResponse } from "next/server";

export async function POST() {
  console.log("Optimizing...");
  populate();
  console.log("Optimization complete");
  return NextResponse.json({ message: "Optimization complete" });
}
