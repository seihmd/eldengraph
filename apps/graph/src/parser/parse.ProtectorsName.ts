import fs from "node:fs";

import data from "../data/master_jp/ProtectorName.json";

export function parseProtectorName() {
  const texts: string[] = [];

  for (const item of data.children) {
    if (item.text.includes("＋") || item.text.includes('軽装')) {
      // ignore upgraded ver.
      continue;

    }
    texts.push(`\`"${item.text}": "${item.children.map(t => t.text).join(". ")}";\`,`
    )
  }

  fs.writeFileSync(
    "./src/data/protectors.jp.ts",
    `export const protectorTexts = [${texts.join("\n")}];`,
    "utf8"
  );
}
