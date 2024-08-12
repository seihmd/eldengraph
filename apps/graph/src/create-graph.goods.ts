import { addGraphDocuments, getGraphDocuments } from "./create-graph";
import { goodsTexts } from "./data/goods.jp";
import { chunk } from "./utils/util";

const chunkTexts = chunk(goodsTexts, 100);

for (const texts of chunkTexts) {
    const gd = await getGraphDocuments(texts, "`items`");
    await addGraphDocuments(gd);

    console.log(`🌀 Processed: ${texts.at(-1)}`)
}

console.log('🏁 Finished.')