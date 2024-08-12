import { addGraphDocuments, getGraphDocuments } from "./create-graph";
import { accessoryTexts } from "./data/accessories.jp";

const gd = await getGraphDocuments(accessoryTexts, '`accessories`');
await addGraphDocuments(gd);

console.log('Finished.')
