import { addGraphDocuments, getGraphDocuments } from "./create-graph";
import { weaponTexts } from "./data/weapons.jp";
import { chunk } from "./utils/util";

const chunkTexts = chunk(weaponTexts, 100);

for (const texts of chunkTexts) {
    const gd = await getGraphDocuments(texts, '`weapon`');
    await addGraphDocuments(gd);

    console.log(`🌀 Processed: ${texts.at(-1)}`)
}

console.log('🏁 Finished.')