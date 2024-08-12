import fs from "node:fs";

import data from "../data/master_jp/WeaponName.json";

export function parseWeaponName() {
  const texts: string[] = [];

  for (const item of data.children) {
    texts.push(`\`"${item.text}": "${item.children.map(t => t.text).join(". ")}";\`,`
    )
  }

  fs.writeFileSync(
    "./src/data/weapons.jp.ts",
    `export const weaponTexts = [${texts.join("\n")}];`,
    "utf8"
  );
}