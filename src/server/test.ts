import { db } from "./db";

async function main() {
  const lol = await db.selectFrom("submitted_forms").selectAll().execute();

  console.log(lol);
}

main();
