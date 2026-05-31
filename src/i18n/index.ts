// Central re-export and lookup utility.
// Import from "@/i18n" everywhere — never import bn.ts or en.ts directly.

export type { Lang, Dictionary } from "./types";
export { default as bn } from "./bn";
export { default as en } from "./en";

import bn from "./bn";
import en from "./en";
import type { Lang, Dictionary } from "./types";

const DICTIONARIES: Record<Lang, Dictionary> = { bn, en };

// Primary hook into the dictionary — used in non-hook contexts (e.g. Server Components)
export function getDictionary(lang: Lang): Dictionary {
  return DICTIONARIES[lang];
}
