import { addGraphDocuments, getGraphDocuments } from "./create-graph";
import { protectorTexts } from "./data/protectors.jp";
import { chunk } from "./utils/util";

const chunkTexts = chunk(protectorTexts, 100);

for (const texts of chunkTexts) {
    const gd = await getGraphDocuments(texts, 'protectors');
    await addGraphDocuments(gd);

    console.log(`🌀 Processed: ${texts.at(-1)}`)
}

console.log('🏁 Finished.')