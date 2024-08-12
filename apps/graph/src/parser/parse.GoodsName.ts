import fs from "node:fs";

import data from "../data/master_jp/GoodsName.json";

export function parseGoodsName() {
  const texts: string[] = [];

  for (const item of data.children) {
    if (item.text.includes("＋")) {
      // ignore upgraded ver.
      continue;

    }
    texts.push(`\`"${item.text}": "${item.children.map(t => t.text).join(". ")}";\`,`);
  }

  fs.writeFileSync(
    "./src/data/goods.jp.ts",
    texts.join("\n"),
    "utf8"
  );
}